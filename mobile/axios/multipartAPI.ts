import axios from "axios";
import useAuthStore from "@/store/useAuthStore";
import * as secureStorage from 'expo-secure-store';
import tokenRefreshLock from "./tokenRefreshLock";

const multipartAPI = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});

multipartAPI.interceptors.request.use(
  (request) => {
  const token = useAuthStore.getState().token;

  console.log("Request headers:", JSON.stringify(request.headers, null, 2));

  if(token) {
    request.headers.Authorization = `Bearer ${token}`
  }
  return request;
}, (error) => Promise.reject(error)
);

multipartAPI.interceptors.response.use(
  (response) => {
    // we will return the response if not any error
    return response;
  },
  async (error) => {
    const {setToken, logout} = useAuthStore.getState();

    const originalRequest = error.config;

    if(error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if(tokenRefreshLock.isRefreshing()) {
        return new Promise((resolve, reject) => {
          tokenRefreshLock.addToQueue({
            resolve: (token: string) => {
              originalRequest.headers.Authentication = `Bearer${token}`;
              resolve(multipartAPI(originalRequest));
            },
            reject: (error: any) => reject(error)
          })
        });
      };

      try {
        console.log("[API] Access token expired, Attempting refresh");

        const refreshToken = await secureStorage.getItemAsync('refreshToken');

        if(!refreshToken) {
          throw new Error("No refresh token available")
        }

        const response = await axios.get('http://localhost:3000/api/auth/refresh', {
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        });

        const data = response.data;
        const newAccessToken = data.tokens.accessToken;
        const newRefreshToken = data.tokens.refreshToken;

        setToken(newAccessToken);
        await secureStorage.setItemAsync('refreshToken', newRefreshToken);

        tokenRefreshLock.processQueue(null, newAccessToken);

        // now set accesstoken in header of original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return multipartAPI(originalRequest);

      } catch (error) {
        console.log('Error attempting refresh:', error);

        // if error refreshing token then logout
        logout();
        await secureStorage.deleteItemAsync('refreshToken');

        tokenRefreshLock.processQueue(error);
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default multipartAPI;
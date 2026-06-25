// import useAuthStore from "@/store/useAuthStore";
import axios from "axios";
import * as secureStorage from 'expo-secure-store';
import tokenRefreshLock from "./tokenRefreshLock";

const authApi = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    'Content-Type': 'application/json',
  }
});

authApi.interceptors.request.use(
  async (request) => {
    const { default: useAuthStore } = await import('../store/useAuthStore');
    const token = useAuthStore.getState().token;

    console.log("Request headers:", JSON.stringify(request.headers, null, 2));

    if (token) {
      request.headers.Authorization = `Bearer ${token}`
    }
    return request;
  }, (error) => Promise.reject(error)
);

authApi.interceptors.response.use(
  (response) => {
    // we will return the response if not any error
    return response;
  },
  async (error) => {

    const { default: useAuthStore } = await import('../store/useAuthStore');
    const { setToken, logout } = useAuthStore.getState();

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (tokenRefreshLock.isRefreshing()) {
        return new Promise((resolve, reject) => {
          tokenRefreshLock.addToQueue({
            resolve: (token: string) => {
              originalRequest.headers.Authentication = `Bearer${token}`;
              resolve(authApi(originalRequest));
            },
            reject: (error) => reject(error)
          });
        });
      }

      tokenRefreshLock.setIsRefreshing(true);

      try {
        console.log("[API] Access token expired, Attempting refresh");

        const refreshToken = await secureStorage.getItemAsync('refreshToken');

        if (!refreshToken) {
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
        return authApi(originalRequest);

      } catch (error) {
        console.log('Error attempting refresh:', error);

        // if error refreshing token then logout
        logout();
        await secureStorage.deleteItemAsync('refreshToken');
        tokenRefreshLock.processQueue(error);
        return Promise.reject(error);
      } finally {
        tokenRefreshLock.setIsRefreshing(false);
      }
    }
    return Promise.reject(error);
  }
);

export default authApi;
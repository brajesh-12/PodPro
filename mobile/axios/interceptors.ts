import useAuthStore from "@/store/useAuthStore";
import axios from "axios";
import * as secureStorage from 'expo-secure-store';

const authApi = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

authApi.interceptors.request.use(
  (request) => {
  const token = useAuthStore.getState().token;

  if(token) {
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
    const {setToken, logout} = useAuthStore.getState();

    const originalRequest = error.config;

    if(error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

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

        // now set accesstoken in header of original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return authApi(originalRequest);

      } catch (error) {
        console.log('Error attempting refresh:', error);

        // if error refreshing token then logout
        logout();
        await secureStorage.deleteItemAsync('refreshToken');
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default authApi;
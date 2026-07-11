import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import usePlayerStore from "./usePlayerStore";
import * as SecureStorage from "expo-secure-store";
import { Alert } from "react-native";
import authApi from "@/axios/interceptors";
import useDownloadStore from "./useDownloadStore";

interface User {
  id: string;
  userName: string;
  email: string;
  profilePic: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthorized: boolean;
  isHydrated: boolean;

  setAuth: (user: any, token: string) => void;
  setToken: (token: any) => void;
  setUser: (user: any) => void;
  logout: () => Promise<void>;
  setIsHydrated: () => void;
  toggleAuthorization: () => void;
  clearLocalStore: () => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

const secureStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await SecureStorage.getItemAsync(name)) || null;
  },
  setItem: async (name: string, value: any): Promise<void> => {
    await SecureStorage.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStorage.deleteItemAsync(name);
  },
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({

      user: null,
      token: null,
      isAuthorized: false,
      isHydrated: false,

      setAuth: (user, token) => {
        set({ user: user });
        set({ token: token });
      },

      toggleAuthorization() {
        set({ isAuthorized: true });
      },

      setUser: (user) => set({ user: user }),

      setToken: (value) => {
        set({ token: value });
      },

      logout: async () => {
        try {
          const refreshToken = await SecureStorage.getItemAsync('refreshToken');
          console.log("refreshToken:", refreshToken);

          if (!refreshToken) {
            await get().clearLocalStore();
            return;
          }

          await authApi.post('/auth/logout', {
            refreshToken: refreshToken
          });
          await get().clearLocalStore();

        } catch (error: any) {
          console.error("Error logging out:", error);

          if (!error.response) {
            Alert.alert(
              "Network Error",
              "Could not connect to the server. Please check your internet and try logging out again."
            );
            return;
          };

          if (error.response.status === 500) {
            Alert.alert(
              "Server Error",
              "Our servers are currently experiencing issues. Please try logging out later."
            );
            return;
          };
        };
      },

      clearLocalStore: async () => {
        set({ user: null });
        set({ token: null });

        useDownloadStore.getState().clearDownloads();

        set({ isAuthorized: false });

        usePlayerStore.getState().resetPlayer();
        await SecureStorage.deleteItemAsync('refreshToken');
      },

      setIsHydrated: () => {
        set({ isHydrated: true })
      },

      deleteAccount: async (password) => {
        try {
          await authApi.post('/auth/delete', {
            password: password,
          });

          await get().clearLocalStore();
        } catch (error: any) {
          console.log("Error deleting account:", error);

          if (!error.response) {
            Alert.alert(
              "Network Error",
              "Could not connect to the server. Please check your internet and try logging out again."
            );
            return;
          };

          if(error.response.status === 401) {
            Alert.alert(
              "Incorrect Password",
              "Password entered by you was incorrect. Please try again."
            );
            return;
          };

          if (error.response.status === 500) {
            Alert.alert(
              "Server error",
              "Our servers are currently experiencing issues. Please try logging out later."
            );
            return;
          };

        };
      }
    }),
    {
      // here we same this in secure-storage
      // also run onRehydrated function for setting hydration
      name: 'auth-store',
      storage: createJSONStorage(() => secureStorage)
    }
  )
);

export default useAuthStore;
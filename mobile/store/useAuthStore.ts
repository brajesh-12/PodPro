import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import usePlayerStore from "./usePlayerStore";
import * as SecureStorage from "expo-secure-store";

interface User {
  id: string,
  userName: string,
  email: string,
  profilePic: string
}

interface AuthStore {
  user: User | null,
  token: string | null,
  isAuthorized: boolean,
  isHydrated: boolean,

  setAuth: (user: any, token: string) => void,
  setToken: (token: any) => void,
  setUser: (user: any) => void,
  logout: () => void,
  setIsHydrated: () => void,
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
    (set) => ({
      user: null,
      token: null,
      isAuthorized: false,
      isHydrated: false,

      setAuth: (user, token) => {
        set({user: user});
        set({token: token});
        set({isAuthorized: true});
      },

      setUser: (user) => set({user: user}),

      setToken: (value) => {
        set({token: value})
      },

      logout: () => {
        set({user: null});
        set({token: null});
        set({isAuthorized: false});

        usePlayerStore.getState().resetPlayer();
      },
      setIsHydrated: () => {
        set({isHydrated: true})
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
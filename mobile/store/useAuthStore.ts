import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import usePlayerStore from "./usePlayerStore";

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
  logout: () => void,
  setIsHydrated: () => void,
}

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
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

export default useAuthStore;
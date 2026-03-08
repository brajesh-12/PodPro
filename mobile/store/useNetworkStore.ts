import { create } from 'zustand';
import NetInfo from '@react-native-community/netinfo';

interface NetworkStore {
  isOnline: boolean;
  isDebugOffline: boolean;
  setIsOnline: (value: boolean) => void;
  toggleDebugOffline: () => void;
}

export const useNetworkStore = create<NetworkStore>(
  (set, get) => ({
    isOnline: true,
    isDebugOffline: false,

    setIsOnline: (value) => set({isOnline: value}),
    toggleDebugOffline: () => {
      const nextDebugState = !get().isDebugOffline;
      set({
        isDebugOffline: nextDebugState,
        isOnline: nextDebugState ? false : true
      })
    }
  })
);

export const initNetworkListener = () => {
  const unsubscribe = NetInfo.addEventListener((state) => {
    const online = !!(state.isConnected && state.isInternetReachable);

    // set value of online in state
    useNetworkStore.getState().setIsOnline(online);

    if(!online) {
      console.log("App is now OFFLINE");
    }
    else {
      console.log("App is now ONLINE");
    }
  });

  return unsubscribe;
};
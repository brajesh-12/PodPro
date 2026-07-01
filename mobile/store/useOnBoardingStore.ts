import { create } from 'zustand';

interface OnBoardingStore {
  email: string;
  password: string;
  
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  resetCredentials: () => void;
}

const useOnBoardingStore = create<OnBoardingStore>((set) => ({
  email: "",
  password: "",

  setEmail: (email) => {
    set({ email: email });
  },
  setPassword: (password) => {
    set({ password: password });
  },
  resetCredentials: () => {
    set({ email: "", password: "" });
  },
}))

export default useOnBoardingStore;
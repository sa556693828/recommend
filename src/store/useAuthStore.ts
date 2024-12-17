import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  isLoading: boolean;
  login: (userId: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: "Abcrobertlau@gmail.com",
  isLoading: false,
  login: async (userId: string, password: string) => {
    set({ isLoading: true });
    return new Promise((resolve) => {
      setTimeout(() => {
        if (userId === password) {
          set({ isAuthenticated: true, userId: userId, isLoading: false });
          localStorage.setItem("userId", userId);
          resolve(true);
        } else {
          set({ isLoading: false });
          resolve(false);
        }
      }, 1500);
    });
  },
  logout: () => {
    set({ isAuthenticated: false, userId: null });
    localStorage.removeItem("userId");
    window.location.href = "/"; // 改用這個方式
  },
}));

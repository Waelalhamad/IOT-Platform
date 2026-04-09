import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User { _id: string; email: string; }

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
      setToken: (accessToken) => set({ accessToken }),
      clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'esp-auth',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

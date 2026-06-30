import { create } from 'zustand';
import { User } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  isAuthenticated: false,
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
  setToken: (token) => {
    set({ token });
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  },
  setRefreshToken: (refreshToken) => {
    set({ refreshToken });
    if (typeof window !== 'undefined') {
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      } else {
        localStorage.removeItem('refreshToken');
      }
    }
  },
  setIsLoading: (loading) => set({ isLoading: loading }),
  logout: () => {
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  },
}));

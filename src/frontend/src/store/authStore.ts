import { create } from 'zustand';
import { User } from '@/types';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      set({ token: access_token, isAuthenticated: true });
      
      await useAuthStore.getState().fetchUser();
      toast.success('Welcome back!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Login failed');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email: string, username: string, password: string) => {
    set({ isLoading: true });
    try {
      await api.post('/auth/register', { email, username, password });
      await useAuthStore.getState().login(email, password);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Registration failed');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
    toast.success('Logged out successfully');
  },

  fetchUser: async () => {
    try {
      const response = await api.get('/users/me');
      set({ user: response.data });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      useAuthStore.getState().logout();
    }
  },
}));

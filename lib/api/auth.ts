import { apiClient } from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  display_name: string;
  bio?: string;
}

export interface UserProfile {
  personal_info: {
    id: string;
    username: string;
    email: string;
    display_name: string;
    bio: string;
    role: string;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
  },

  register: async (userData: RegisterData) => {
    const { data } = await apiClient.post('/auth/register', userData);
    return data;
  },

  getMe: async () => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  logout: () => {
    // Handled by zustand clearAuth
  },
};

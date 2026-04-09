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

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('role', data.data.role);
    }
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
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  },
};

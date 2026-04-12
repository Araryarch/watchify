import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increase to 30 seconds
  decompress: true,
});

import { useAuthStore } from '../store/authStore';

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      console.error('Request timeout:', error.config?.url);
    }
    
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

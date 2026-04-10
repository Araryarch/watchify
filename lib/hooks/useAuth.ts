import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, LoginCredentials, RegisterData } from '../api/auth';

import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      if (data.success && data.data.token) {
        setAuth(data.data.token, data.data.role);
        queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterData) => authApi.register(userData),
  });

  const logout = () => {
    clearAuth();
    authApi.logout();
    queryClient.clear();
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};

export const useMe = () => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.getMe(),
    enabled: !!token,
  });
};

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users';

// ─── Queries ─────────────────────────────────────────────────────────────────

export const useUserDetail = (id: string) =>
  useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
    refetchInterval: 45000, // Refetch setiap 45 detik
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users';

// ─── Queries ─────────────────────────────────────────────────────────────────

export const useUserDetail = (id: string) =>
  useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });

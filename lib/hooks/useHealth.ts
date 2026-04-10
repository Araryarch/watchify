import { useQuery } from '@tanstack/react-query';
import { healthApi } from '../api/health';

export const usePing = () =>
  useQuery({
    queryKey: ['ping'],
    queryFn: () => healthApi.ping(),
    refetchInterval: 30000, // Refetch setiap 30 detik
    retry: 3,
  });

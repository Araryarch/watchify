import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { genresApi, GenreListParams } from '../api/genres';

// ─── Queries ─────────────────────────────────────────────────────────────────

export const useGenres = () =>
  useQuery({
    queryKey: ['genres'],
    queryFn: () => genresApi.getAll(),
    refetchInterval: 60000, // Refetch setiap 60 detik (genre jarang berubah)
    refetchOnWindowFocus: true,
    staleTime: 45000,
  });

export const useGenresPaginated = (params?: GenreListParams) =>
  useQuery({
    queryKey: ['genres-admin', params],
    queryFn: () => genresApi.getAllPaginated(params),
    refetchInterval: 30000, // Refetch setiap 30 detik untuk admin dashboard
    refetchOnWindowFocus: true,
    staleTime: 20000,
  });

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateGenre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => genresApi.create(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      queryClient.invalidateQueries({ queryKey: ['genres-admin'] });
    },
  });
};

export const useUpdateGenre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      genresApi.update(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      queryClient.invalidateQueries({ queryKey: ['genres-admin'] });
    },
  });
};

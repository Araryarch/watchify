import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { genresApi, GenreListParams } from '../api/genres';

// ─── Queries ─────────────────────────────────────────────────────────────────

export const useGenres = () =>
  useQuery({
    queryKey: ['genres'],
    queryFn: () => genresApi.getAll(),
  });

export const useGenresPaginated = (params?: GenreListParams) =>
  useQuery({
    queryKey: ['genres-admin', params],
    queryFn: () => genresApi.getAllPaginated(params),
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

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { filmsApi, FilmListParams, formatDateForApi } from '../api/films';

// ─── Re-export helper ─────────────────────────────────────────────────────────
export { formatDateForApi };

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useFilms(params?: FilmListParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['films', params],
    queryFn: () => filmsApi.getAll(params),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useFilmDetail(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['film', id],
    queryFn: () => filmsApi.getById(id),
    enabled: options?.enabled ?? !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateFilm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => filmsApi.create(formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['films'] }),
  });
};

// export const useUpdateFilm = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
//       filmsApi.update(id, formData),
//     onSuccess: (_, { id }) => {
//       queryClient.invalidateQueries({ queryKey: ['films'] });
//       queryClient.invalidateQueries({ queryKey: ['film', id] });
//     },
//   });
// };

// export const useDeleteFilm = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (id: string) => filmsApi.delete(id),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ['films'] }),
//   });
// };

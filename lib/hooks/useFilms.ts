import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { filmsApi, FilmListParams, formatDateForApi } from '../api/films';

// ─── Re-export helper ─────────────────────────────────────────────────────────
export { formatDateForApi };

// ─── Queries ─────────────────────────────────────────────────────────────────

export const useFilms = (params?: FilmListParams) =>
  useQuery({
    queryKey: ['films', params],
    queryFn: () => filmsApi.getAll(params),
  });

export const useFilmDetail = (id: string, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ['film', id],
    queryFn: () => filmsApi.getById(id),
    enabled: options?.enabled ?? !!id,
  });

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

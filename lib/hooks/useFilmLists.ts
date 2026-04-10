import { useMutation, useQueryClient } from '@tanstack/react-query';
import { filmListsApi, CreateFilmListPayload, UpdateVisibilityPayload } from '../api/film-lists';

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useAddToFilmList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFilmListPayload) => filmListsApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
  });
};

export const useUpdateFilmListVisibility = () =>
  useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateVisibilityPayload }) =>
      filmListsApi.updateVisibility(id, payload),
  });

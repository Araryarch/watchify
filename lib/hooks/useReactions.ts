import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reactionsApi, CreateReactionPayload, UpdateReactionPayload } from '../api/reactions';

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateReaction = (filmId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReactionPayload) => reactionsApi.create(payload),
    onSuccess: () => {
      if (filmId) {
        queryClient.invalidateQueries({ queryKey: ['film', filmId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['film'] });
      }
    },
  });
};

export const useUpdateReaction = (filmId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReactionPayload }) =>
      reactionsApi.update(id, payload),
    onSuccess: () => {
      if (filmId) {
        queryClient.invalidateQueries({ queryKey: ['film', filmId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['film'] });
      }
    },
  });
};

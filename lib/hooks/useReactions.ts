import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reactionsApi, CreateReactionPayload, UpdateReactionPayload } from '../api/reactions';

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateReaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReactionPayload) => reactionsApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['film'] }),
  });
};

export const useUpdateReaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReactionPayload }) =>
      reactionsApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['film'] }),
  });
};

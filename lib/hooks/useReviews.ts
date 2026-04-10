import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi, CreateReviewPayload } from '../api/reviews';

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateReview = (filmId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<CreateReviewPayload, 'film_id'>) =>
      reviewsApi.create({ ...payload, film_id: filmId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['film', filmId] }),
  });
};

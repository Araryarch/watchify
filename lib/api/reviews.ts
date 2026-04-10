import { apiClient } from './client';

// ─── Domain Types ────────────────────────────────────────────────────────────

export interface CreateReviewPayload {
  film_id: string;
  rating: number;
  comment: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const reviewsApi = {
  create: async (payload: CreateReviewPayload) => {
    const { data } = await apiClient.post('/api/v1/reviews', payload);
    return data;
  },
};

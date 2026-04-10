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
    const { data } = await apiClient.post('/reviews', payload);
    return data;
  },
};

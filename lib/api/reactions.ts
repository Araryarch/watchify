import { apiClient } from './client';

// ─── Domain Types ────────────────────────────────────────────────────────────

export type ReactionStatus = 'like' | 'dislike';

export interface CreateReactionPayload {
  review_id: string;
  status: ReactionStatus;
}

export interface UpdateReactionPayload {
  status: ReactionStatus;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const reactionsApi = {
  create: async (payload: CreateReactionPayload) => {
    const { data } = await apiClient.post('/api/v1/reactions', payload);
    return data;
  },

  update: async (id: string, payload: UpdateReactionPayload) => {
    const { data } = await apiClient.put(`/api/v1/reactions/${id}`, payload);
    return data;
  },
};

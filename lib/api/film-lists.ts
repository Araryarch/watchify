import { apiClient } from './client';

// ─── Domain Types ────────────────────────────────────────────────────────────

export type ListStatus = 'watching' | 'completed' | 'plan_to_watch' | 'dropped';
export type Visibility = 'public' | 'private';

export interface CreateFilmListPayload {
  film_id: string;
  list_status: ListStatus;
}

export interface UpdateVisibilityPayload {
  visibility: Visibility;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const filmListsApi = {
  create: async (payload: CreateFilmListPayload) => {
    const { data } = await apiClient.post('/film-lists', payload);
    return data;
  },

  updateVisibility: async (id: string, payload: UpdateVisibilityPayload) => {
    const { data } = await apiClient.patch(`/film-lists/${id}`, payload);
    return data;
  },
};

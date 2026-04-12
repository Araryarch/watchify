import { apiClient } from './client';

// ─── Domain Types ────────────────────────────────────────────────────────────

export interface UserDetail {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  film_lists: Array<{
    id: string;
    film_title: string;
    list_status: string;
    visibility: string;
  }>;
  reviews: Array<{
    film: string;
    rating: number;
    comment: string;
  }>;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const usersApi = {
  getById: async (id: string) => {
    const { data } = await apiClient.get(`/api/v1/users/${id}`);
    return data;
  },
};

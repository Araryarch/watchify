import { apiClient } from './client';

// ─── Domain Types ────────────────────────────────────────────────────────────

export interface Genre {
  id: string;
  name: string;
}

export interface GenreListParams {
  take?: number;
  page?: number;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const genresApi = {
  getAll: async () => {
    const { data } = await apiClient.get('/genres');
    return data;
  },

  getAllPaginated: async (params?: GenreListParams) => {
    const { data } = await apiClient.get('/genres/admin', { params });
    return data;
  },

  create: async (name: string) => {
    const { data } = await apiClient.post('/genres', { name });
    return data;
  },

  update: async (id: string, name: string) => {
    const { data } = await apiClient.put(`/genres/${id}`, { name });
    return data;
  },
};

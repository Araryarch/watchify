import { apiClient } from './client';

export interface Film {
  id?: string;
  title: string;
  synopsis?: string;
  airing_status: 'airing' | 'not_yet_aired' | 'finished_airing';
  total_episodes: number;
  release_date: string;
  images?: string[];
  genres?: Array<{ id: string; name: string }>;
  average_rating?: number;
}

export interface FilmListParams {
  take?: number;
  page?: number;
  filter_by?: string;
  filter?: string;
  sort?: 'asc' | 'desc';
  sort_by?: string;
}

export const filmsApi = {
  getAll: async (params?: FilmListParams) => {
    const { data } = await apiClient.get('/films', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get(`/films/${id}`);
    return data;
  },
};

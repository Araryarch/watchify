import { apiClient } from './client';
import type { Genre } from './genres';

// ─── Domain Types ────────────────────────────────────────────────────────────

export type { Genre };

export interface Film {
  id: string;
  title: string;
  synopsis?: string;
  airing_status: 'airing' | 'not_yet_aired' | 'finished_airing';
  total_episodes: number;
  release_date: string;
  images?: string[];
  genres?: Genre[];
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

export interface PaginationMeta {
  take: number;
  page: number;
  total_data: number;
  total_page: number;
  sort: string;
  sort_by: string;
  filter?: string;
  filter_by?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Formats a datetime-local string to the Go backend format: "YYYY-MM-DD HH:MM:SS"
 */
export function formatDateForApi(isoOrLocalDate: string): string {
  const d = new Date(isoOrLocalDate);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const filmsApi = {
  getAll: async (params?: FilmListParams) => {
    const { data } = await apiClient.get('/api/v1/films', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get(`/api/v1/films/${id}`);
    return data;
  },

  create: async (formData: FormData) => {
    const { data } = await apiClient.post('/api/v1/films', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};

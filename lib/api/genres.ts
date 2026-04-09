import { apiClient } from './client';

export interface Genre {
  id: string;
  name: string;
}

export const genresApi = {
  getAll: async () => {
    const { data } = await apiClient.get('/genres');
    return data;
  },
};

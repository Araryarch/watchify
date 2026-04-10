import { apiClient } from './client';

// ─── API ─────────────────────────────────────────────────────────────────────

export const healthApi = {
  ping: async () => {
    const { data } = await apiClient.get('/api/ping');
    return data;
  },
};

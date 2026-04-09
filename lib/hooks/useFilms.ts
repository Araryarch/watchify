import { useQuery } from '@tanstack/react-query';
import { filmsApi, FilmListParams } from '../api/films';

export const useFilms = (params?: FilmListParams) => {
  return useQuery({
    queryKey: ['films', params],
    queryFn: () => filmsApi.getAll(params),
  });
};

export const useFilmDetail = (id: string) => {
  return useQuery({
    queryKey: ['film', id],
    queryFn: () => filmsApi.getById(id),
    enabled: !!id,
  });
};

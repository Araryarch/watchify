import { useQuery } from '@tanstack/react-query';
import { genresApi } from '../api/genres';

export const useGenres = () => {
  return useQuery({
    queryKey: ['genres'],
    queryFn: () => genresApi.getAll(),
  });
};

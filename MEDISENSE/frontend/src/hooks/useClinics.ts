import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Clinic } from '../types';

export const useNearbyClinics = (lat?: number, lng?: number) =>
  useQuery({
    queryKey: ['clinics', lat, lng],
    queryFn: async () => {
      const { data } = await api.get('/clinics/nearby', { params: { lat, lng } });
      return { results: data.results as Clinic[], topPicks: data.topPicks as Clinic[] };
    },
    enabled: lat !== undefined && lng !== undefined,
  });

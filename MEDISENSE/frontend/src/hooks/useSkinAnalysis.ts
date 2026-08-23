import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { SkinAnalysis, PaginatedResponse } from '../types';

export const useAnalyzeImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post('/skin-analysis', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data as { analysis: SkinAnalysis; mockMode: boolean };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analysis-history'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};

export const useAnalysisHistory = (page: number) =>
  useQuery({
    queryKey: ['analysis-history', page],
    queryFn: async () => {
      const { data } = await api.get(`/skin-analysis?page=${page}&limit=10`);
      return data as PaginatedResponse<SkinAnalysis>;
    },
  });

export const useAnalysisById = (id?: string) =>
  useQuery({
    queryKey: ['analysis', id],
    queryFn: async () => {
      const { data } = await api.get(`/skin-analysis/${id}`);
      return data.analysis as SkinAnalysis;
    },
    enabled: !!id,
  });

export const useAnalytics = () =>
  useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data } = await api.get('/skin-analysis/analytics/summary');
      return data.analytics;
    },
  });

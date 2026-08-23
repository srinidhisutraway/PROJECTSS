import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { MedicalReport, PaginatedResponse } from '../types';

export const useReports = (page: number) =>
  useQuery({
    queryKey: ['reports', page],
    queryFn: async () => {
      const { data } = await api.get(`/reports?page=${page}&limit=12`);
      return data as PaginatedResponse<MedicalReport>;
    },
  });

export const useUploadReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { file: File; title: string; type: string; notes?: string }) => {
      const formData = new FormData();
      formData.append('file', payload.file);
      formData.append('title', payload.title);
      formData.append('type', payload.type);
      if (payload.notes) formData.append('notes', payload.notes);
      const { data } = await api.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.report as MedicalReport;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] }),
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/reports/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] }),
  });
};

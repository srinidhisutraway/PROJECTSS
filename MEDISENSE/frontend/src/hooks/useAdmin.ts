import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export const useAdminDashboard = () =>
  useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard');
      return data.stats;
    },
  });

export const useAdminUsers = (search: string, page: number) =>
  useQuery({
    queryKey: ['admin-users', search, page],
    queryFn: async () => {
      const { data } = await api.get('/admin/users', { params: { search, page, limit: 10 } });
      return data;
    },
  });

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, unknown> }) => {
      const { data } = await api.patch(`/admin/users/${id}`, updates);
      return data.user;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/users/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};

export const useAdminLogs = (page: number) =>
  useQuery({
    queryKey: ['admin-logs', page],
    queryFn: async () => {
      const { data } = await api.get('/admin/logs', { params: { page, limit: 20 } });
      return data;
    },
  });

export const useAdminQuizzes = () =>
  useQuery({
    queryKey: ['admin-quizzes'],
    queryFn: async () => {
      const { data } = await api.get('/admin/quizzes');
      return data.quizzes;
    },
  });

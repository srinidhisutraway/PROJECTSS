import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { OnboardingData } from '../types';

export const useSubmitOnboarding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: OnboardingData) => {
      const { data } = await api.put('/users/me/onboarding', payload);
      return data.user;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile-summary'] }),
  });
};

export const useProfileSummary = () =>
  useQuery({
    queryKey: ['profile-summary'],
    queryFn: async () => {
      const { data } = await api.get('/users/me/summary');
      return data.summary;
    },
  });

export const useUpdateProfile = () =>
  useMutation({
    mutationFn: async (payload: { name?: string }) => {
      const { data } = await api.patch('/users/me', payload);
      return data.user;
    },
  });

export const useChangePassword = () =>
  useMutation({
    mutationFn: async (payload: { currentPassword: string; newPassword: string }) => {
      const { data } = await api.put('/users/me/password', payload);
      return data;
    },
  });

export const useUploadAvatar = () =>
  useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      const { data } = await api.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.user;
    },
  });

export const useDeleteAccount = () =>
  useMutation({
    mutationFn: async () => {
      const { data } = await api.delete('/users/me');
      return data;
    },
  });

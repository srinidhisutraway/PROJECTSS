import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ChatConversation } from '../types';

export const useConversations = () =>
  useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await api.get('/chat');
      return data.conversations as (ChatConversation & { lastMessage: string })[];
    },
  });

export const useConversation = (id?: string) =>
  useQuery({
    queryKey: ['conversation', id],
    queryFn: async () => {
      const { data } = await api.get(`/chat/${id}`);
      return data.conversation as ChatConversation;
    },
    enabled: !!id,
  });

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (message?: string) => {
      const { data } = await api.post('/chat', { message });
      return data.conversation as ChatConversation;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['conversations'] }),
  });
};

export const useSendMessage = (conversationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (message: string) => {
      const { data } = await api.post(`/chat/${conversationId}/messages`, { message });
      return data.conversation as ChatConversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/chat/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['conversations'] }),
  });
};

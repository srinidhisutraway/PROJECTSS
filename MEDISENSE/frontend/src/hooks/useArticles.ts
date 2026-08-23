import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Article, PaginatedResponse } from '../types';

export const useArticles = (params: { page?: number; category?: string; search?: string; trending?: boolean }) =>
  useQuery({
    queryKey: ['articles', params],
    queryFn: async () => {
      const { data } = await api.get('/articles', { params });
      return data as PaginatedResponse<Article>;
    },
  });

export const useArticleCategories = () =>
  useQuery({
    queryKey: ['article-categories'],
    queryFn: async () => {
      const { data } = await api.get('/articles/meta/categories');
      return data.categories as { _id: string; count: number }[];
    },
  });

export const useArticle = (slug?: string) =>
  useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      const { data } = await api.get(`/articles/${slug}`);
      return data.article as Article;
    },
    enabled: !!slug,
  });

export const useBookmarks = () =>
  useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const { data } = await api.get('/articles/me/bookmarks');
      return data.articles as Article[];
    },
  });

export const useToggleBookmark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (articleId: string) => {
      const { data } = await api.post(`/articles/${articleId}/bookmark`);
      return data.bookmarked as boolean;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookmarks'] }),
  });
};

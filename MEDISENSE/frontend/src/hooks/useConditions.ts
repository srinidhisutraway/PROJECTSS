import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { ConditionSummary, ConditionDetail } from '../types';

export const useConditions = (search?: string, category?: string) =>
  useQuery({
    queryKey: ['conditions', search, category],
    queryFn: async () => {
      const { data } = await api.get('/conditions', { params: { search, category } });
      return data.results as ConditionSummary[];
    },
  });

export const useConditionCategories = () =>
  useQuery({
    queryKey: ['condition-categories'],
    queryFn: async () => {
      const { data } = await api.get('/conditions/meta/categories');
      return data.categories as { _id: string; count: number }[];
    },
  });

export const useCondition = (slug?: string) =>
  useQuery({
    queryKey: ['condition', slug],
    queryFn: async () => {
      const { data } = await api.get(`/conditions/${slug}`);
      return data.condition as ConditionDetail;
    },
    enabled: !!slug,
  });

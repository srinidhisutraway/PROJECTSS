import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { QuizSummary, QuizQuestion } from '../types';

export const useQuizzes = () =>
  useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const { data } = await api.get('/quiz');
      return data.quizzes as QuizSummary[];
    },
  });

export const useQuizById = (id?: string) =>
  useQuery({
    queryKey: ['quiz', id],
    queryFn: async () => {
      const { data } = await api.get(`/quiz/${id}`);
      return data.quiz as { _id: string; title: string; description: string; questions: QuizQuestion[] };
    },
    enabled: !!id,
  });

export const useSubmitQuizAttempt = (quizId: string) =>
  useMutation({
    mutationFn: async (answers: { questionId: string; selectedOptionIndex: number }[]) => {
      const { data } = await api.post(`/quiz/${quizId}/attempt`, { answers });
      return data.attempt;
    },
  });

export const useQuizHistory = () =>
  useQuery({
    queryKey: ['quiz-history'],
    queryFn: async () => {
      const { data } = await api.get('/quiz/history/me');
      return data as { attempts: any[]; badges: string[]; totalScore: number };
    },
  });

export const useLeaderboard = () =>
  useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data } = await api.get('/quiz/leaderboard');
      return data.leaderboard as { _id: string; name: string; avatar?: string; totalScore: number; attemptsCount: number }[];
    },
  });

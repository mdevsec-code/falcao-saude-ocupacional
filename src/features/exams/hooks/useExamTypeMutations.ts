import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import i18n from '@/i18n';
import { examsApi } from '../services/exams.api';
import { examsKeys } from './useExamTypes';
import type { ExamTypeRecord } from '../types';

export function useCreateExamType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<ExamTypeRecord, 'id'>) => examsApi.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: examsKeys.all });
      toast.success(i18n.t('exams:toast.createSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('exams:toast.createError'));
    },
  });
}

export function useUpdateExamType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<ExamTypeRecord> }) =>
      examsApi.update(id, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: examsKeys.all });
      toast.success(i18n.t('exams:toast.updateSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('exams:toast.updateError'));
    },
  });
}

export function useDeleteExamType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => examsApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: examsKeys.all });
      toast.success(i18n.t('exams:toast.deleteSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('exams:toast.deleteError'));
    },
  });
}

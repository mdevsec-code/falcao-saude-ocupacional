import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { examsApi } from '../services/exams.api';
import { examsKeys } from './useExamTypes';
import type { ExamTypeRecord } from '../types';

export function useCreateExamType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<ExamTypeRecord, 'id'>) => examsApi.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: examsKeys.all });
      toast.success('Tipo de exame criado.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Não foi possível criar o tipo de exame.');
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
      toast.success('Tipo de exame atualizado.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Não foi possível atualizar o tipo de exame.');
    },
  });
}

export function useDeleteExamType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => examsApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: examsKeys.all });
      toast.success('Tipo de exame removido.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Não foi possível remover o tipo de exame.');
    },
  });
}

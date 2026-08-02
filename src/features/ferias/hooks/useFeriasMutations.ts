import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import i18n from '@/i18n';
import { feriasApi } from '../services/ferias.api';
import { feriasKeys } from './useFerias';
import type { VacationRecord } from '../types';

export function useCreateFerias() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<VacationRecord, 'id'>) => feriasApi.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: feriasKeys.all });
      toast.success(i18n.t('ferias:toast.createSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('ferias:toast.createError'));
    },
  });
}

export function useUpdateFerias() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<VacationRecord> }) =>
      feriasApi.update(id, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: feriasKeys.all });
      toast.success(i18n.t('ferias:toast.updateSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('ferias:toast.updateError'));
    },
  });
}

export function useDeleteFerias() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => feriasApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: feriasKeys.all });
      toast.success(i18n.t('ferias:toast.deleteSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('ferias:toast.deleteError'));
    },
  });
}

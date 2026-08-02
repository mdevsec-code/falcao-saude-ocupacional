import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import i18n from '@/i18n';
import { desviosApi } from '../services/desvios.api';
import { desviosKeys } from './useDesvios';
import type { DeviationRecord } from '../types';

export function useCreateDesvio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<DeviationRecord, 'id'>) => desviosApi.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: desviosKeys.all });
      toast.success(i18n.t('seguranca:desvios.toast.createSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('seguranca:desvios.toast.createError'));
    },
  });
}

export function useUpdateDesvio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<DeviationRecord> }) =>
      desviosApi.update(id, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: desviosKeys.all });
      toast.success(i18n.t('seguranca:desvios.toast.updateSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('seguranca:desvios.toast.updateError'));
    },
  });
}

export function useDeleteDesvio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => desviosApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: desviosKeys.all });
      toast.success(i18n.t('seguranca:desvios.toast.deleteSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('seguranca:desvios.toast.deleteError'));
    },
  });
}

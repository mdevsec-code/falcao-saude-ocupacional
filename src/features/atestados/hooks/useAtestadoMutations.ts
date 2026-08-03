import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import i18n from '@/i18n';
import { atestadosApi } from '../services/atestados.api';
import { atestadosKeys } from './useAtestados';
import type { AtestadoRecord } from '../types';

export function useCreateAtestado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<AtestadoRecord, 'id'>) => atestadosApi.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: atestadosKeys.all });
      toast.success(i18n.t('atestados:toast.createSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('atestados:toast.createError'));
    },
  });
}

export function useUpdateAtestado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: Partial<AtestadoRecord> }) =>
      atestadosApi.update(id, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: atestadosKeys.all });
      toast.success(i18n.t('atestados:toast.updateSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('atestados:toast.updateError'));
    },
  });
}

export function useDeleteAtestado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => atestadosApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: atestadosKeys.all });
      toast.success(i18n.t('atestados:toast.deleteSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('atestados:toast.deleteError'));
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import i18n from '@/i18n';
import { indicadoresApi } from '../services/indicadores.api';
import { indicadoresKeys } from './useIndicadores';
import type { AccidentIndicatorRecord } from '../indicatorTypes';

export function useCreateIndicador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<AccidentIndicatorRecord, 'id'>) => indicadoresApi.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: indicadoresKeys.all });
      toast.success(i18n.t('seguranca:indicadores.toast.createSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('seguranca:indicadores.toast.createError'));
    },
  });
}

export function useUpdateIndicador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<AccidentIndicatorRecord> }) =>
      indicadoresApi.update(id, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: indicadoresKeys.all });
      toast.success(i18n.t('seguranca:indicadores.toast.updateSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('seguranca:indicadores.toast.updateError'));
    },
  });
}

export function useDeleteIndicador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => indicadoresApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: indicadoresKeys.all });
      toast.success(i18n.t('seguranca:indicadores.toast.deleteSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('seguranca:indicadores.toast.deleteError'));
    },
  });
}

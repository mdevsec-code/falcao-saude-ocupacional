import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import i18n from '@/i18n';
import { cidApi } from '../services/cid.api';
import { cidKeys } from './useCidCustomEntries';
import type { CidCustomEntry } from '../types';

export function useCreateCid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<CidCustomEntry, 'id'>) => cidApi.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cidKeys.all });
      toast.success(i18n.t('cid:toast.createSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('cid:toast.createError'));
    },
  });
}

export function useUpdateCid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<CidCustomEntry> }) =>
      cidApi.update(id, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cidKeys.all });
      toast.success(i18n.t('cid:toast.updateSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('cid:toast.updateError'));
    },
  });
}

export function useDeleteCid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cidApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cidKeys.all });
      toast.success(i18n.t('cid:toast.deleteSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('cid:toast.deleteError'));
    },
  });
}

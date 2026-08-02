import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import i18n from '@/i18n';
import { agendaApi } from '../services/agenda.api';
import { agendaKeys } from './useAppointments';
import type { AppointmentRecord } from '../types';

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<AppointmentRecord, 'id'>) => agendaApi.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: agendaKeys.all });
      toast.success(i18n.t('agenda:toast.createSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('agenda:toast.createError'));
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<AppointmentRecord> }) =>
      agendaApi.update(id, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: agendaKeys.all });
      toast.success(i18n.t('agenda:toast.updateSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('agenda:toast.updateError'));
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => agendaApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: agendaKeys.all });
      toast.success(i18n.t('agenda:toast.deleteSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('agenda:toast.deleteError'));
    },
  });
}

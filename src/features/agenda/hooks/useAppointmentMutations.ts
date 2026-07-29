import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { agendaApi } from '../services/agenda.api';
import { agendaKeys } from './useAppointments';
import type { AppointmentRecord } from '../types';

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<AppointmentRecord, 'id'>) => agendaApi.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: agendaKeys.all });
      toast.success('Agendamento criado.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Não foi possível criar o agendamento.');
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
      toast.success('Agendamento atualizado.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Não foi possível atualizar o agendamento.');
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => agendaApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: agendaKeys.all });
      toast.success('Agendamento removido.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Não foi possível remover o agendamento.');
    },
  });
}

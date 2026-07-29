import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { attendancesApi } from '../services/attendances.api';
import { attendancesKeys } from './useAttendances';
import type { AttendanceRecord } from '../types';

export function useCreateAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<AttendanceRecord, 'id'>) => attendancesApi.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: attendancesKeys.all });
      toast.success('Atendimento registrado.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Não foi possível registrar o atendimento.');
    },
  });
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<AttendanceRecord> }) =>
      attendancesApi.update(id, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: attendancesKeys.all });
      toast.success('Atendimento atualizado.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Não foi possível atualizar o atendimento.');
    },
  });
}

export function useDeleteAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => attendancesApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: attendancesKeys.all });
      toast.success('Atendimento removido.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Não foi possível remover o atendimento.');
    },
  });
}

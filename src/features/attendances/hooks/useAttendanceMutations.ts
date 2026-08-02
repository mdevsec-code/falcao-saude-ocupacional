import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import i18n from '@/i18n';
import { attendancesApi } from '../services/attendances.api';
import { attendancesKeys } from './useAttendances';
import type { AttendanceRecord } from '../types';

export function useCreateAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<AttendanceRecord, 'id'>) => attendancesApi.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: attendancesKeys.all });
      toast.success(i18n.t('attendances:toast.createSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('attendances:toast.createError'));
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
      toast.success(i18n.t('attendances:toast.updateSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('attendances:toast.updateError'));
    },
  });
}

export function useDeleteAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => attendancesApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: attendancesKeys.all });
      toast.success(i18n.t('attendances:toast.deleteSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('attendances:toast.deleteError'));
    },
  });
}

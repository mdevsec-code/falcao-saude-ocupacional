import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import i18n from '@/i18n';
import { patientsApi } from '../services/patients.api';
import { patientsKeys } from './usePatients';
import type { PatientRecord } from '../types';

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<PatientRecord, 'id'>) => patientsApi.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: patientsKeys.all });
      toast.success(i18n.t('patients:toast.createSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('patients:toast.createError'));
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<PatientRecord> }) =>
      patientsApi.update(id, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: patientsKeys.all });
      toast.success(i18n.t('patients:toast.updateSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('patients:toast.updateError'));
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patientsApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: patientsKeys.all });
      toast.success(i18n.t('patients:toast.deleteSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('patients:toast.deleteError'));
    },
  });
}

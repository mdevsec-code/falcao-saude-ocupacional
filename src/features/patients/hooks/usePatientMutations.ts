import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { patientsApi } from '../services/patients.api';
import { patientsKeys } from './usePatients';
import type { PatientRecord } from '../types';

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<PatientRecord, 'id'>) => patientsApi.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: patientsKeys.all });
      toast.success('Paciente cadastrado.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Não foi possível cadastrar o paciente.');
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
      toast.success('Paciente atualizado.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Não foi possível atualizar o paciente.');
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patientsApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: patientsKeys.all });
      toast.success('Paciente removido.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Não foi possível remover o paciente.');
    },
  });
}

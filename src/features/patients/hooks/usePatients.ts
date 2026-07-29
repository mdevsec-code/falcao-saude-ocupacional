import { useQuery } from '@tanstack/react-query';
import { patientsApi } from '../services/patients.api';
import type { PatientRecord } from '../types';

export const patientsKeys = {
  all: ['patients'] as const,
  list: () => [...patientsKeys.all, 'list'] as const,
};

export function usePatients() {
  return useQuery<PatientRecord[], Error>({
    queryKey: patientsKeys.list(),
    queryFn: patientsApi.getAll,
    staleTime: 1000 * 60,
  });
}

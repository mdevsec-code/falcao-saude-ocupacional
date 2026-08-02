import { useQuery } from '@tanstack/react-query';
import { feriasApi } from '../services/ferias.api';
import type { VacationRecord } from '../types';

export const feriasKeys = {
  all: ['ferias'] as const,
  list: () => [...feriasKeys.all, 'list'] as const,
};

export function useFerias() {
  return useQuery<VacationRecord[], Error>({
    queryKey: feriasKeys.list(),
    queryFn: feriasApi.getAll,
    staleTime: 1000 * 60,
  });
}

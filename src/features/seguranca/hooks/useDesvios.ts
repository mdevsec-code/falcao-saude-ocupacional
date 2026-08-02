import { useQuery } from '@tanstack/react-query';
import { desviosApi } from '../services/desvios.api';
import type { DeviationRecord } from '../types';

export const desviosKeys = {
  all: ['desvios'] as const,
  list: () => [...desviosKeys.all, 'list'] as const,
};

export function useDesvios() {
  return useQuery<DeviationRecord[], Error>({
    queryKey: desviosKeys.list(),
    queryFn: desviosApi.getAll,
    staleTime: 1000 * 60,
  });
}

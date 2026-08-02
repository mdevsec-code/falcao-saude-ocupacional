import { useQuery } from '@tanstack/react-query';
import { indicadoresApi } from '../services/indicadores.api';
import type { AccidentIndicatorRecord } from '../indicatorTypes';

export const indicadoresKeys = {
  all: ['indicadores'] as const,
  list: () => [...indicadoresKeys.all, 'list'] as const,
};

export function useIndicadores() {
  return useQuery<AccidentIndicatorRecord[], Error>({
    queryKey: indicadoresKeys.list(),
    queryFn: indicadoresApi.getAll,
    staleTime: 1000 * 60,
  });
}

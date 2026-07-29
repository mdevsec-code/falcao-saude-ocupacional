import { useQuery } from '@tanstack/react-query';
import { atestadosApi } from '../services/atestados.api';
import type { AtestadoRecord } from '../types';

export const atestadosKeys = {
  all: ['atestados'] as const,
  list: () => [...atestadosKeys.all, 'list'] as const,
};

export function useAtestados() {
  return useQuery<AtestadoRecord[], Error>({
    queryKey: atestadosKeys.list(),
    queryFn: atestadosApi.getAll,
    staleTime: 1000 * 60 * 10, // 10 min — dataset estático
  });
}

import { useQuery } from '@tanstack/react-query';
import { cidApi } from '../services/cid.api';
import type { CidCustomEntry } from '../types';

export const cidKeys = {
  all: ['cid-custom'] as const,
  list: () => [...cidKeys.all, 'list'] as const,
};

export function useCidCustomEntries() {
  return useQuery<CidCustomEntry[], Error>({
    queryKey: cidKeys.list(),
    queryFn: cidApi.getAll,
    staleTime: 1000 * 60,
  });
}

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../services/users.api';
import type { UserRecord } from '../types';

export const usersKeys = {
  all: ['users'] as const,
  list: () => [...usersKeys.all, 'list'] as const,
};

export function useUsers() {
  return useQuery<UserRecord[], Error>({
    queryKey: usersKeys.list(),
    queryFn: usersApi.getAll,
    staleTime: 1000 * 60,
  });
}

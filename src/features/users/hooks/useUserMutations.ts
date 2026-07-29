import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { usersApi } from '../services/users.api';
import { usersKeys } from './useUsers';
import type { UserRecord } from '../types';

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<UserRecord, 'id'>) => usersApi.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersKeys.all });
      toast.success('Usuário criado.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Não foi possível criar o usuário.');
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<UserRecord> }) =>
      usersApi.update(id, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersKeys.all });
      toast.success('Usuário atualizado.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Não foi possível atualizar o usuário.');
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersKeys.all });
      toast.success('Usuário removido.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Não foi possível remover o usuário.');
    },
  });
}

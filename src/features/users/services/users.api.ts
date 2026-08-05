import { httpClient } from '@/services/http/client';
import type { CreateUserPayload, UserRecord } from '../types';

export const usersApi = {
  async getAll(): Promise<UserRecord[]> {
    const { data } = await httpClient.get<UserRecord[]>('/users');
    return data;
  },

  async create(input: CreateUserPayload): Promise<UserRecord> {
    const { data } = await httpClient.post<UserRecord>('/users', input);
    return data;
  },

  async update(id: string, patch: Partial<UserRecord>): Promise<UserRecord> {
    const { data } = await httpClient.patch<UserRecord>(`/users/${id}`, patch);
    return data;
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/users/${id}`);
  },
};

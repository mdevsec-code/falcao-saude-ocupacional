import { httpClient } from '@/services/http/client';
import type { AuthSession } from '@/types/auth';
import type { LoginInput } from '../types';

export const authApi = {
  async login(input: LoginInput): Promise<AuthSession> {
    const { data } = await httpClient.post<AuthSession>('/auth/login', input);
    return data;
  },

  async logout(): Promise<void> {
    await httpClient.post('/auth/logout');
  },

  async me(): Promise<AuthSession> {
    const { data } = await httpClient.get<AuthSession>('/auth/me');
    return data;
  },
};

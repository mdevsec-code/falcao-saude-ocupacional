import { httpClient } from '@/services/http/client';
import type { AtestadoRecord } from '../types';

export const atestadosApi = {
  async getAll(): Promise<AtestadoRecord[]> {
    const { data } = await httpClient.get<AtestadoRecord[]>('/atestados');
    return data;
  },
};

import { httpClient } from '@/services/http/client';
import type { AtestadoRecord } from '../types';

export const atestadosApi = {
  async getAll(): Promise<AtestadoRecord[]> {
    const { data } = await httpClient.get<AtestadoRecord[]>('/atestados');
    return data;
  },

  async create(input: Omit<AtestadoRecord, 'id'>): Promise<AtestadoRecord> {
    const { data } = await httpClient.post<AtestadoRecord>('/atestados', input);
    return data;
  },

  async update(id: number, patch: Partial<AtestadoRecord>): Promise<AtestadoRecord> {
    const { data } = await httpClient.patch<AtestadoRecord>(`/atestados/${id}`, patch);
    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/atestados/${id}`);
  },
};

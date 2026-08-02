import { httpClient } from '@/services/http/client';
import type { DeviationRecord } from '../types';

export const desviosApi = {
  async getAll(): Promise<DeviationRecord[]> {
    const { data } = await httpClient.get<DeviationRecord[]>('/desvios');
    return data;
  },

  async create(input: Omit<DeviationRecord, 'id'>): Promise<DeviationRecord> {
    const { data } = await httpClient.post<DeviationRecord>('/desvios', input);
    return data;
  },

  async update(id: string, patch: Partial<DeviationRecord>): Promise<DeviationRecord> {
    const { data } = await httpClient.patch<DeviationRecord>(`/desvios/${id}`, patch);
    return data;
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/desvios/${id}`);
  },
};

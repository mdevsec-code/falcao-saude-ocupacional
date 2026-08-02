import { httpClient } from '@/services/http/client';
import type { VacationRecord } from '../types';

export const feriasApi = {
  async getAll(): Promise<VacationRecord[]> {
    const { data } = await httpClient.get<VacationRecord[]>('/ferias');
    return data;
  },

  async create(input: Omit<VacationRecord, 'id'>): Promise<VacationRecord> {
    const { data } = await httpClient.post<VacationRecord>('/ferias', input);
    return data;
  },

  async update(id: string, patch: Partial<VacationRecord>): Promise<VacationRecord> {
    const { data } = await httpClient.patch<VacationRecord>(`/ferias/${id}`, patch);
    return data;
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/ferias/${id}`);
  },
};

import { httpClient } from '@/services/http/client';
import type { AccidentIndicatorRecord } from '../indicatorTypes';

export const indicadoresApi = {
  async getAll(): Promise<AccidentIndicatorRecord[]> {
    const { data } = await httpClient.get<AccidentIndicatorRecord[]>('/indicadores');
    return data;
  },

  async create(input: Omit<AccidentIndicatorRecord, 'id'>): Promise<AccidentIndicatorRecord> {
    const { data } = await httpClient.post<AccidentIndicatorRecord>('/indicadores', input);
    return data;
  },

  async update(
    id: string,
    patch: Partial<AccidentIndicatorRecord>,
  ): Promise<AccidentIndicatorRecord> {
    const { data } = await httpClient.patch<AccidentIndicatorRecord>(`/indicadores/${id}`, patch);
    return data;
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/indicadores/${id}`);
  },
};

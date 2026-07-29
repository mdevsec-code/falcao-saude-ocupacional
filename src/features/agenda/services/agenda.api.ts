import { httpClient } from '@/services/http/client';
import type { AppointmentRecord } from '../types';

export const agendaApi = {
  async getAll(): Promise<AppointmentRecord[]> {
    const { data } = await httpClient.get<AppointmentRecord[]>('/agenda');
    return data;
  },

  async create(input: Omit<AppointmentRecord, 'id'>): Promise<AppointmentRecord> {
    const { data } = await httpClient.post<AppointmentRecord>('/agenda', input);
    return data;
  },

  async update(id: string, patch: Partial<AppointmentRecord>): Promise<AppointmentRecord> {
    const { data } = await httpClient.patch<AppointmentRecord>(`/agenda/${id}`, patch);
    return data;
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/agenda/${id}`);
  },
};

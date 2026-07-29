import { httpClient } from '@/services/http/client';
import type { PatientRecord } from '../types';

export const patientsApi = {
  async getAll(): Promise<PatientRecord[]> {
    const { data } = await httpClient.get<PatientRecord[]>('/patients');
    return data;
  },

  async create(input: Omit<PatientRecord, 'id'>): Promise<PatientRecord> {
    const { data } = await httpClient.post<PatientRecord>('/patients', input);
    return data;
  },

  async update(id: string, patch: Partial<PatientRecord>): Promise<PatientRecord> {
    const { data } = await httpClient.patch<PatientRecord>(`/patients/${id}`, patch);
    return data;
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/patients/${id}`);
  },
};

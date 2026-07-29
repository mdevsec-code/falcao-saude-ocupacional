import { httpClient } from '@/services/http/client';
import type { AttendanceRecord } from '../types';

export const attendancesApi = {
  async getAll(): Promise<AttendanceRecord[]> {
    const { data } = await httpClient.get<AttendanceRecord[]>('/attendances');
    return data;
  },

  async create(input: Omit<AttendanceRecord, 'id'>): Promise<AttendanceRecord> {
    const { data } = await httpClient.post<AttendanceRecord>('/attendances', input);
    return data;
  },

  async update(id: string, patch: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    const { data } = await httpClient.patch<AttendanceRecord>(`/attendances/${id}`, patch);
    return data;
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/attendances/${id}`);
  },
};

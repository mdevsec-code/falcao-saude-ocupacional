import { httpClient } from '@/services/http/client';
import type { ExamTypeRecord } from '../types';

export const examsApi = {
  async getAll(): Promise<ExamTypeRecord[]> {
    const { data } = await httpClient.get<ExamTypeRecord[]>('/exams');
    return data;
  },

  async create(input: Omit<ExamTypeRecord, 'id'>): Promise<ExamTypeRecord> {
    const { data } = await httpClient.post<ExamTypeRecord>('/exams', input);
    return data;
  },

  async update(id: string, patch: Partial<ExamTypeRecord>): Promise<ExamTypeRecord> {
    const { data } = await httpClient.patch<ExamTypeRecord>(`/exams/${id}`, patch);
    return data;
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/exams/${id}`);
  },
};

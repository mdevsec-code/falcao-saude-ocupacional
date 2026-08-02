import { httpClient } from '@/services/http/client';
import type { CidCustomEntry } from '../types';

export const cidApi = {
  async getAll(): Promise<CidCustomEntry[]> {
    const { data } = await httpClient.get<CidCustomEntry[]>('/cid');
    return data;
  },

  async create(input: Omit<CidCustomEntry, 'id'>): Promise<CidCustomEntry> {
    const { data } = await httpClient.post<CidCustomEntry>('/cid', input);
    return data;
  },

  async update(id: string, patch: Partial<CidCustomEntry>): Promise<CidCustomEntry> {
    const { data } = await httpClient.patch<CidCustomEntry>(`/cid/${id}`, patch);
    return data;
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/cid/${id}`);
  },
};

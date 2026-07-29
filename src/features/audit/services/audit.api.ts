import { httpClient } from '@/services/http/client';
import type { AuditLogRecord } from '../types';

export const auditApi = {
  async getAll(): Promise<AuditLogRecord[]> {
    const { data } = await httpClient.get<AuditLogRecord[]>('/audit');
    return data;
  },
};

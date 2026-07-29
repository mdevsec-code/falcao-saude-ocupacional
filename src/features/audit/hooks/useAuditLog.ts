import { useQuery } from '@tanstack/react-query';
import { auditApi } from '../services/audit.api';
import type { AuditLogRecord } from '../types';

export const auditKeys = {
  all: ['audit'] as const,
  list: () => [...auditKeys.all, 'list'] as const,
};

export function useAuditLog() {
  return useQuery<AuditLogRecord[], Error>({
    queryKey: auditKeys.list(),
    queryFn: auditApi.getAll,
    staleTime: 1000 * 30,
  });
}

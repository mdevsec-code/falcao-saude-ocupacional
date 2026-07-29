import type { AuditLogEntry } from '@/services/msw/fixtures/audit';
import type { AuditAction, AuditEntityType } from '@/constants/audit';

export type { AuditLogEntry as AuditLogRecord };
export type { AuditAction, AuditEntityType };

export interface AuditFilters {
  busca?: string;
  action?: AuditAction;
  entityType?: AuditEntityType;
}

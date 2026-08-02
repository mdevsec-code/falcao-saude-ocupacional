import { type Role } from '@/constants/roles';
import { type AuditAction, type AuditEntityType } from '@/constants/audit';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: Role | null;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: string;
  entityLabel?: string;
  detail?: string;
}

/** Sem eventos pré-cadastrados — a trilha de auditoria começa a ser registrada a partir do lançamento. */
export const AUDIT_LOG_SEED: AuditLogEntry[] = [];

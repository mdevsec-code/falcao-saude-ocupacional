import { createTranslatedLabels } from '@/utils/i18nLabels';

/**
 * Ações e tipos de entidade rastreados na trilha de auditoria (LGPD).
 */
export const AUDIT_ACTIONS = {
  LOGIN: 'login',
  LOGIN_FAILED: 'login_failed',
  LOGOUT: 'logout',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

export const ALL_AUDIT_ACTIONS: AuditAction[] = Object.values(AUDIT_ACTIONS);

/** Rótulos traduzidos (`enums:auditAction.*`) — acompanham o idioma ativo. */
export const AUDIT_ACTION_LABELS: Record<AuditAction, string> =
  createTranslatedLabels<AuditAction>('auditAction');

export const AUDIT_ENTITY_TYPES = {
  AUTH: 'auth',
  PATIENT: 'patient',
  ATTENDANCE: 'attendance',
  USER: 'user',
  EXAM_TYPE: 'exam_type',
  VACATION: 'vacation',
  DEVIATION: 'deviation',
  ACCIDENT_INDICATOR: 'accident_indicator',
  CID: 'cid',
} as const;

export type AuditEntityType = (typeof AUDIT_ENTITY_TYPES)[keyof typeof AUDIT_ENTITY_TYPES];

export const ALL_AUDIT_ENTITY_TYPES: AuditEntityType[] = Object.values(AUDIT_ENTITY_TYPES);

/** Rótulos traduzidos (`enums:auditEntity.*`) — acompanham o idioma ativo. */
export const AUDIT_ENTITY_LABELS: Record<AuditEntityType, string> =
  createTranslatedLabels<AuditEntityType>('auditEntity');

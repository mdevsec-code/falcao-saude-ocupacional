import { type Role } from '@/constants/roles';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES, type AuditAction, type AuditEntityType } from '@/constants/audit';
import { ADMIN_USER, DEMO_USERS } from './users';
import { PATIENTS_FIXTURE } from './patients';
import { EXAM_TYPES_FIXTURE } from './exams';

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

/** PRNG determinístico (mulberry32) — fixture estável entre reloads. */
function createRng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  const item = arr[Math.floor(rng() * arr.length)];
  if (item === undefined) throw new Error('pick: array vazio');
  return item;
}

const ACTIVE_USERS = DEMO_USERS.filter((u) => u.status === 'active');
const INACTIVE_USERS = DEMO_USERS.filter((u) => u.status === 'inactive');

function randomTimestampBetween(rng: () => number, start: Date, end: Date): string {
  const t = start.getTime() + rng() * (end.getTime() - start.getTime());
  return new Date(t).toISOString();
}

function generateAuditLog(count: number): AuditLogEntry[] {
  const rng = createRng(20260729);
  const now = new Date();
  const rangeStart = new Date(now);
  rangeStart.setDate(rangeStart.getDate() - 45);

  const entries: AuditLogEntry[] = [];

  for (let i = 1; i <= count; i++) {
    const timestamp = randomTimestampBetween(rng, rangeStart, now);
    const roll = rng();

    if (roll < 0.18) {
      // Login bem-sucedido
      const actor = pick(rng, ACTIVE_USERS);
      entries.push({
        id: `audit-${String(i).padStart(5, '0')}`,
        timestamp,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action: AUDIT_ACTIONS.LOGIN,
        entityType: AUDIT_ENTITY_TYPES.AUTH,
        entityLabel: actor.email,
      });
    } else if (roll < 0.24 && INACTIVE_USERS.length > 0) {
      // Tentativa de login falhou (conta inativa)
      const actor = pick(rng, INACTIVE_USERS);
      entries.push({
        id: `audit-${String(i).padStart(5, '0')}`,
        timestamp,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action: AUDIT_ACTIONS.LOGIN_FAILED,
        entityType: AUDIT_ENTITY_TYPES.AUTH,
        entityLabel: actor.email,
        detail: 'Usuário inativo',
      });
    } else if (roll < 0.3) {
      // Logout
      const actor = pick(rng, ACTIVE_USERS);
      entries.push({
        id: `audit-${String(i).padStart(5, '0')}`,
        timestamp,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action: AUDIT_ACTIONS.LOGOUT,
        entityType: AUDIT_ENTITY_TYPES.AUTH,
        entityLabel: actor.email,
      });
    } else if (roll < 0.62) {
      // Visualização/atualização de paciente (dado sensível de saúde)
      const actor = pick(rng, ACTIVE_USERS);
      const patient = pick(rng, PATIENTS_FIXTURE);
      entries.push({
        id: `audit-${String(i).padStart(5, '0')}`,
        timestamp,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action: rng() < 0.5 ? AUDIT_ACTIONS.UPDATE : AUDIT_ACTIONS.CREATE,
        entityType: AUDIT_ENTITY_TYPES.PATIENT,
        entityId: patient.id,
        entityLabel: patient.name,
      });
    } else if (roll < 0.85) {
      // Alteração em tipo de exame
      const actor = pick(rng, ACTIVE_USERS);
      const exam = pick(rng, EXAM_TYPES_FIXTURE);
      entries.push({
        id: `audit-${String(i).padStart(5, '0')}`,
        timestamp,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action: AUDIT_ACTIONS.UPDATE,
        entityType: AUDIT_ENTITY_TYPES.EXAM_TYPE,
        entityId: exam.id,
        entityLabel: exam.name,
      });
    } else {
      // Gestão de usuários (ação sensível, restrita ao admin)
      const target = pick(rng, DEMO_USERS);
      entries.push({
        id: `audit-${String(i).padStart(5, '0')}`,
        timestamp,
        actorId: ADMIN_USER.id,
        actorName: ADMIN_USER.name,
        actorRole: ADMIN_USER.role,
        action: rng() < 0.7 ? AUDIT_ACTIONS.UPDATE : AUDIT_ACTIONS.CREATE,
        entityType: AUDIT_ENTITY_TYPES.USER,
        entityId: target.id,
        entityLabel: target.name,
      });
    }
  }

  return entries.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export const AUDIT_LOG_SEED: AuditLogEntry[] = generateAuditLog(220);

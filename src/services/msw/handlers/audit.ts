import { http, HttpResponse, delay } from 'msw';
import { AUDIT_LOG_SEED, type AuditLogEntry } from '../fixtures/audit';

/**
 * Store mutável em memória — os demais handlers (auth, pacientes,
 * atendimentos, usuários, exames) chamam `recordAuditEvent` após cada
 * mutação para alimentar a trilha de auditoria. Reinicia a cada reload
 * da página (sem persistência).
 */
let store: AuditLogEntry[] = AUDIT_LOG_SEED.map((r) => ({ ...r }));
let nextId = store.length + 1;

export function recordAuditEvent(input: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
  const entry: AuditLogEntry = {
    ...input,
    id: `audit-${String(nextId++).padStart(5, '0')}`,
    timestamp: new Date().toISOString(),
  };
  store = [entry, ...store];
  return entry;
}

export const auditHandlers = [
  http.get('/api/audit', async () => {
    await delay(200);
    return HttpResponse.json(store);
  }),
];

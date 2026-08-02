import { http, HttpResponse, delay } from 'msw';
import { FERIAS_FIXTURE, type VacationRecord } from '../fixtures/ferias';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/constants/audit';
import { recordAuditEvent } from './audit';
import { getLastSessionUser } from './auth';

/**
 * Store mutável em memória — simula um backend real para CRUD de
 * férias. Reinicia a cada reload da página (sem persistência).
 */
let store: VacationRecord[] = FERIAS_FIXTURE.map((r) => ({ ...r }));
let nextId = store.length + 1;

function logFeriasEvent(
  action: (typeof AUDIT_ACTIONS)['CREATE' | 'UPDATE' | 'DELETE'],
  record: Pick<VacationRecord, 'id' | 'patientName'>,
): void {
  const actor = getLastSessionUser();
  recordAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action,
    entityType: AUDIT_ENTITY_TYPES.VACATION,
    entityId: record.id,
    entityLabel: record.patientName,
  });
}

export const feriasHandlers = [
  http.get('/api/ferias', async () => {
    await delay(200);
    return HttpResponse.json(store);
  }),

  http.post('/api/ferias', async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as Omit<VacationRecord, 'id'>;
    const record: VacationRecord = { ...body, id: `fer-${String(nextId++).padStart(4, '0')}` };
    store = [...store, record];
    logFeriasEvent(AUDIT_ACTIONS.CREATE, record);
    return HttpResponse.json(record, { status: 201 });
  }),

  http.patch('/api/ferias/:id', async ({ request, params }) => {
    await delay(200);
    const { id } = params;
    const patch = (await request.json()) as Partial<VacationRecord>;
    const idx = store.findIndex((r) => r.id === id);
    if (idx === -1) {
      return HttpResponse.json({ message: 'Férias não encontradas' }, { status: 404 });
    }
    const current = store[idx];
    if (!current) {
      return HttpResponse.json({ message: 'Férias não encontradas' }, { status: 404 });
    }
    const updated: VacationRecord = { ...current, ...patch, id: current.id };
    store = [...store.slice(0, idx), updated, ...store.slice(idx + 1)];
    logFeriasEvent(AUDIT_ACTIONS.UPDATE, updated);
    return HttpResponse.json(updated);
  }),

  http.delete('/api/ferias/:id', async ({ params }) => {
    await delay(200);
    const { id } = params;
    const existing = store.find((r) => r.id === id);
    if (!existing) {
      return HttpResponse.json({ message: 'Férias não encontradas' }, { status: 404 });
    }
    store = store.filter((r) => r.id !== id);
    logFeriasEvent(AUDIT_ACTIONS.DELETE, existing);
    return new HttpResponse(null, { status: 204 });
  }),
];

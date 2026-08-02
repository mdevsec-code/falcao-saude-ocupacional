import { http, HttpResponse, delay } from 'msw';
import { DEVIATIONS_FIXTURE, type DeviationRecord } from '../fixtures/desvios';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/constants/audit';
import { recordAuditEvent } from './audit';
import { getLastSessionUser } from './auth';

/**
 * Store mutável em memória — simula um backend real para CRUD de
 * desvios de segurança. Reinicia a cada reload da página (sem persistência).
 */
let store: DeviationRecord[] = DEVIATIONS_FIXTURE.map((r) => ({ ...r }));
let nextId = store.length + 1;

function logDeviationEvent(
  action: (typeof AUDIT_ACTIONS)['CREATE' | 'UPDATE' | 'DELETE'],
  record: Pick<DeviationRecord, 'id' | 'description'>,
): void {
  const actor = getLastSessionUser();
  recordAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action,
    entityType: AUDIT_ENTITY_TYPES.DEVIATION,
    entityId: record.id,
    entityLabel: record.description,
  });
}

export const desviosHandlers = [
  http.get('/api/desvios', async () => {
    await delay(200);
    return HttpResponse.json(store);
  }),

  http.post('/api/desvios', async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as Omit<DeviationRecord, 'id'>;
    const record: DeviationRecord = { ...body, id: `dsv-${String(nextId++).padStart(4, '0')}` };
    store = [...store, record];
    logDeviationEvent(AUDIT_ACTIONS.CREATE, record);
    return HttpResponse.json(record, { status: 201 });
  }),

  http.patch('/api/desvios/:id', async ({ request, params }) => {
    await delay(200);
    const { id } = params;
    const patch = (await request.json()) as Partial<DeviationRecord>;
    const idx = store.findIndex((r) => r.id === id);
    if (idx === -1) {
      return HttpResponse.json({ message: 'Desvio não encontrado' }, { status: 404 });
    }
    const current = store[idx];
    if (!current) {
      return HttpResponse.json({ message: 'Desvio não encontrado' }, { status: 404 });
    }
    const updated: DeviationRecord = { ...current, ...patch, id: current.id };
    store = [...store.slice(0, idx), updated, ...store.slice(idx + 1)];
    logDeviationEvent(AUDIT_ACTIONS.UPDATE, updated);
    return HttpResponse.json(updated);
  }),

  http.delete('/api/desvios/:id', async ({ params }) => {
    await delay(200);
    const { id } = params;
    const existing = store.find((r) => r.id === id);
    if (!existing) {
      return HttpResponse.json({ message: 'Desvio não encontrado' }, { status: 404 });
    }
    store = store.filter((r) => r.id !== id);
    logDeviationEvent(AUDIT_ACTIONS.DELETE, existing);
    return new HttpResponse(null, { status: 204 });
  }),
];

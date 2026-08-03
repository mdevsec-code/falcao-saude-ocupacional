import { http, HttpResponse, delay } from 'msw';
import { ATESTADOS_FIXTURE, type AtestadoRecord } from '../fixtures/atestados';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/constants/audit';
import { recordAuditEvent } from './audit';
import { getLastSessionUser } from './auth';

/**
 * Store mutável em memória — simula um backend real para CRUD de
 * atestados. Reinicia a cada reload da página (sem persistência).
 */
let store: AtestadoRecord[] = ATESTADOS_FIXTURE.map((r) => ({ ...r }));
let nextId = store.reduce((max, r) => Math.max(max, r.id), 0) + 1;

function logAtestadoEvent(
  action: (typeof AUDIT_ACTIONS)['CREATE' | 'UPDATE' | 'DELETE'],
  record: Pick<AtestadoRecord, 'id' | 'nome'>,
): void {
  const actor = getLastSessionUser();
  recordAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action,
    entityType: AUDIT_ENTITY_TYPES.ATESTADO,
    entityId: String(record.id),
    entityLabel: record.nome,
  });
}

export const atestadosHandlers = [
  http.get('/api/atestados', async () => {
    await delay(200);
    return HttpResponse.json(store);
  }),

  http.post('/api/atestados', async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as Omit<AtestadoRecord, 'id'>;
    const record: AtestadoRecord = { ...body, id: nextId++ };
    store = [record, ...store];
    logAtestadoEvent(AUDIT_ACTIONS.CREATE, record);
    return HttpResponse.json(record, { status: 201 });
  }),

  http.patch('/api/atestados/:id', async ({ request, params }) => {
    await delay(200);
    const id = Number(params.id);
    const patch = (await request.json()) as Partial<AtestadoRecord>;
    const idx = store.findIndex((r) => r.id === id);
    if (idx === -1) {
      return HttpResponse.json({ message: 'Atestado não encontrado' }, { status: 404 });
    }
    const current = store[idx];
    if (!current) {
      return HttpResponse.json({ message: 'Atestado não encontrado' }, { status: 404 });
    }
    const updated: AtestadoRecord = { ...current, ...patch, id: current.id };
    store = [...store.slice(0, idx), updated, ...store.slice(idx + 1)];
    logAtestadoEvent(AUDIT_ACTIONS.UPDATE, updated);
    return HttpResponse.json(updated);
  }),

  http.delete('/api/atestados/:id', async ({ params }) => {
    await delay(200);
    const id = Number(params.id);
    const existing = store.find((r) => r.id === id);
    if (!existing) {
      return HttpResponse.json({ message: 'Atestado não encontrado' }, { status: 404 });
    }
    store = store.filter((r) => r.id !== id);
    logAtestadoEvent(AUDIT_ACTIONS.DELETE, existing);
    return new HttpResponse(null, { status: 204 });
  }),
];

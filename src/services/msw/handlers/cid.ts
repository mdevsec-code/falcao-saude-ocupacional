import { http, HttpResponse, delay } from 'msw';
import { CID_CUSTOM_FIXTURE, type CidCustomEntry } from '../fixtures/cid';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/constants/audit';
import { recordAuditEvent } from './audit';
import { getLastSessionUser } from './auth';

/**
 * Store mutável em memória — simula um backend real para CRUD de códigos
 * CID cadastrados manualmente. Reinicia a cada reload da página (sem
 * persistência). O catálogo curado (`constants/cid.ts`) não passa por
 * aqui — é estático e não editável pela UI.
 */
let store: CidCustomEntry[] = CID_CUSTOM_FIXTURE.map((r) => ({ ...r }));
let nextId = store.length + 1;

function logCidEvent(
  action: (typeof AUDIT_ACTIONS)['CREATE' | 'UPDATE' | 'DELETE'],
  record: Pick<CidCustomEntry, 'id' | 'code'>,
): void {
  const actor = getLastSessionUser();
  recordAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action,
    entityType: AUDIT_ENTITY_TYPES.CID,
    entityId: record.id,
    entityLabel: record.code,
  });
}

export const cidHandlers = [
  http.get('/api/cid', async () => {
    await delay(200);
    return HttpResponse.json(store);
  }),

  http.post('/api/cid', async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as Omit<CidCustomEntry, 'id'>;
    const record: CidCustomEntry = { ...body, id: `cid-${String(nextId++).padStart(4, '0')}` };
    store = [...store, record];
    logCidEvent(AUDIT_ACTIONS.CREATE, record);
    return HttpResponse.json(record, { status: 201 });
  }),

  http.patch('/api/cid/:id', async ({ request, params }) => {
    await delay(200);
    const { id } = params;
    const patch = (await request.json()) as Partial<CidCustomEntry>;
    const idx = store.findIndex((r) => r.id === id);
    if (idx === -1) {
      return HttpResponse.json({ message: 'Código CID não encontrado' }, { status: 404 });
    }
    const current = store[idx];
    if (!current) {
      return HttpResponse.json({ message: 'Código CID não encontrado' }, { status: 404 });
    }
    const updated: CidCustomEntry = { ...current, ...patch, id: current.id };
    store = [...store.slice(0, idx), updated, ...store.slice(idx + 1)];
    logCidEvent(AUDIT_ACTIONS.UPDATE, updated);
    return HttpResponse.json(updated);
  }),

  http.delete('/api/cid/:id', async ({ params }) => {
    await delay(200);
    const { id } = params;
    const existing = store.find((r) => r.id === id);
    if (!existing) {
      return HttpResponse.json({ message: 'Código CID não encontrado' }, { status: 404 });
    }
    store = store.filter((r) => r.id !== id);
    logCidEvent(AUDIT_ACTIONS.DELETE, existing);
    return new HttpResponse(null, { status: 204 });
  }),
];

import { http, HttpResponse, delay } from 'msw';
import { ACCIDENT_INDICATORS_FIXTURE, type AccidentIndicatorRecord } from '../fixtures/indicadores';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/constants/audit';
import { recordAuditEvent } from './audit';
import { getLastSessionUser } from './auth';

/**
 * Store mutável em memória — simula um backend real para CRUD dos
 * indicadores mensais de acidentes. Reinicia a cada reload da página (sem persistência).
 */
let store: AccidentIndicatorRecord[] = ACCIDENT_INDICATORS_FIXTURE.map((r) => ({ ...r }));
let nextId = store.length + 1;

function logIndicatorEvent(
  action: (typeof AUDIT_ACTIONS)['CREATE' | 'UPDATE' | 'DELETE'],
  record: Pick<AccidentIndicatorRecord, 'id' | 'year' | 'month'>,
): void {
  const actor = getLastSessionUser();
  recordAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action,
    entityType: AUDIT_ENTITY_TYPES.ACCIDENT_INDICATOR,
    entityId: record.id,
    entityLabel: `${record.month}/${record.year}`,
  });
}

export const indicadoresHandlers = [
  http.get('/api/indicadores', async () => {
    await delay(200);
    return HttpResponse.json(store);
  }),

  http.post('/api/indicadores', async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as Omit<AccidentIndicatorRecord, 'id'>;
    const record: AccidentIndicatorRecord = {
      ...body,
      id: `ind-${String(nextId++).padStart(4, '0')}`,
    };
    store = [...store, record];
    logIndicatorEvent(AUDIT_ACTIONS.CREATE, record);
    return HttpResponse.json(record, { status: 201 });
  }),

  http.patch('/api/indicadores/:id', async ({ request, params }) => {
    await delay(200);
    const { id } = params;
    const patch = (await request.json()) as Partial<AccidentIndicatorRecord>;
    const idx = store.findIndex((r) => r.id === id);
    if (idx === -1) {
      return HttpResponse.json({ message: 'Indicador não encontrado' }, { status: 404 });
    }
    const current = store[idx];
    if (!current) {
      return HttpResponse.json({ message: 'Indicador não encontrado' }, { status: 404 });
    }
    const updated: AccidentIndicatorRecord = { ...current, ...patch, id: current.id };
    store = [...store.slice(0, idx), updated, ...store.slice(idx + 1)];
    logIndicatorEvent(AUDIT_ACTIONS.UPDATE, updated);
    return HttpResponse.json(updated);
  }),

  http.delete('/api/indicadores/:id', async ({ params }) => {
    await delay(200);
    const { id } = params;
    const existing = store.find((r) => r.id === id);
    if (!existing) {
      return HttpResponse.json({ message: 'Indicador não encontrado' }, { status: 404 });
    }
    store = store.filter((r) => r.id !== id);
    logIndicatorEvent(AUDIT_ACTIONS.DELETE, existing);
    return new HttpResponse(null, { status: 204 });
  }),
];

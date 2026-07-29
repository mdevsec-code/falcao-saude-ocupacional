import { http, HttpResponse, delay } from 'msw';
import { EXAM_TYPES_FIXTURE, type ExamTypeRecord } from '../fixtures/exams';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/constants/audit';
import { recordAuditEvent } from './audit';
import { getLastSessionUser } from './auth';

/**
 * Store mutável em memória — simula um backend real para CRUD de
 * tipos de exame. Reinicia a cada reload da página (sem persistência).
 */
let store: ExamTypeRecord[] = EXAM_TYPES_FIXTURE.map((r) => ({ ...r }));
let nextId = store.length + 1;

function logExamEvent(
  action: (typeof AUDIT_ACTIONS)['CREATE' | 'UPDATE' | 'DELETE'],
  record: Pick<ExamTypeRecord, 'id' | 'name'>,
): void {
  const actor = getLastSessionUser();
  recordAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action,
    entityType: AUDIT_ENTITY_TYPES.EXAM_TYPE,
    entityId: record.id,
    entityLabel: record.name,
  });
}

export const examsHandlers = [
  http.get('/api/exams', async () => {
    await delay(150);
    return HttpResponse.json(store);
  }),

  http.post('/api/exams', async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as Omit<ExamTypeRecord, 'id'>;
    const record: ExamTypeRecord = { ...body, id: `exam-${String(nextId++).padStart(3, '0')}` };
    store = [...store, record];
    logExamEvent(AUDIT_ACTIONS.CREATE, record);
    return HttpResponse.json(record, { status: 201 });
  }),

  http.patch('/api/exams/:id', async ({ request, params }) => {
    await delay(200);
    const { id } = params;
    const patch = (await request.json()) as Partial<ExamTypeRecord>;
    const idx = store.findIndex((r) => r.id === id);
    if (idx === -1) {
      return HttpResponse.json({ message: 'Tipo de exame não encontrado' }, { status: 404 });
    }
    const current = store[idx];
    if (!current) {
      return HttpResponse.json({ message: 'Tipo de exame não encontrado' }, { status: 404 });
    }
    const updated: ExamTypeRecord = { ...current, ...patch, id: current.id };
    store = [...store.slice(0, idx), updated, ...store.slice(idx + 1)];
    logExamEvent(AUDIT_ACTIONS.UPDATE, updated);
    return HttpResponse.json(updated);
  }),

  http.delete('/api/exams/:id', async ({ params }) => {
    await delay(200);
    const { id } = params;
    const existing = store.find((r) => r.id === id);
    if (!existing) {
      return HttpResponse.json({ message: 'Tipo de exame não encontrado' }, { status: 404 });
    }
    store = store.filter((r) => r.id !== id);
    logExamEvent(AUDIT_ACTIONS.DELETE, existing);
    return new HttpResponse(null, { status: 204 });
  }),
];

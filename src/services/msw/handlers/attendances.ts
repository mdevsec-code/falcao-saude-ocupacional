import { http, HttpResponse, delay } from 'msw';
import { ATTENDANCES_FIXTURE, type AttendanceRecord } from '../fixtures/attendances';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/constants/audit';
import { recordAuditEvent } from './audit';
import { getLastSessionUser } from './auth';

/**
 * Store mutável em memória — simula um backend real para CRUD de
 * atendimentos. Reinicia a cada reload da página (sem persistência).
 */
let store: AttendanceRecord[] = ATTENDANCES_FIXTURE.map((r) => ({ ...r }));
let nextId = store.length + 1;

function logAttendanceEvent(
  action: (typeof AUDIT_ACTIONS)['CREATE' | 'UPDATE' | 'DELETE'],
  record: Pick<AttendanceRecord, 'id' | 'patientName' | 'examType'>,
): void {
  const actor = getLastSessionUser();
  recordAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action,
    entityType: AUDIT_ENTITY_TYPES.ATTENDANCE,
    entityId: record.id,
    entityLabel: `${record.patientName} — ${record.examType}`,
  });
}

export const attendancesHandlers = [
  http.get('/api/attendances', async () => {
    await delay(200);
    return HttpResponse.json(store);
  }),

  http.post('/api/attendances', async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as Omit<AttendanceRecord, 'id'>;
    const record: AttendanceRecord = { ...body, id: `att-${String(nextId++).padStart(4, '0')}` };
    store = [record, ...store];
    logAttendanceEvent(AUDIT_ACTIONS.CREATE, record);
    return HttpResponse.json(record, { status: 201 });
  }),

  http.patch('/api/attendances/:id', async ({ request, params }) => {
    await delay(200);
    const { id } = params;
    const patch = (await request.json()) as Partial<AttendanceRecord>;
    const idx = store.findIndex((r) => r.id === id);
    if (idx === -1) {
      return HttpResponse.json({ message: 'Atendimento não encontrado' }, { status: 404 });
    }
    const current = store[idx];
    if (!current) {
      return HttpResponse.json({ message: 'Atendimento não encontrado' }, { status: 404 });
    }
    const updated: AttendanceRecord = { ...current, ...patch, id: current.id };
    store = [...store.slice(0, idx), updated, ...store.slice(idx + 1)];
    logAttendanceEvent(AUDIT_ACTIONS.UPDATE, updated);
    return HttpResponse.json(updated);
  }),

  http.delete('/api/attendances/:id', async ({ params }) => {
    await delay(200);
    const { id } = params;
    const existing = store.find((r) => r.id === id);
    if (!existing) {
      return HttpResponse.json({ message: 'Atendimento não encontrado' }, { status: 404 });
    }
    store = store.filter((r) => r.id !== id);
    logAttendanceEvent(AUDIT_ACTIONS.DELETE, existing);
    return new HttpResponse(null, { status: 204 });
  }),
];

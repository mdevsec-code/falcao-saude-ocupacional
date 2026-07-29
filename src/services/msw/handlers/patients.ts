import { http, HttpResponse, delay } from 'msw';
import { PATIENTS_FIXTURE, type PatientRecord } from '../fixtures/patients';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/constants/audit';
import { recordAuditEvent } from './audit';
import { getLastSessionUser } from './auth';

/**
 * Store mutável em memória — simula um backend real para CRUD de
 * pacientes. Reinicia a cada reload da página (sem persistência).
 */
let store: PatientRecord[] = PATIENTS_FIXTURE.map((r) => ({ ...r }));
let nextId = store.length + 1;

function logPatientEvent(
  action: (typeof AUDIT_ACTIONS)['CREATE' | 'UPDATE' | 'DELETE'],
  record: Pick<PatientRecord, 'id' | 'name'>,
): void {
  const actor = getLastSessionUser();
  recordAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action,
    entityType: AUDIT_ENTITY_TYPES.PATIENT,
    entityId: record.id,
    entityLabel: record.name,
  });
}

export const patientsHandlers = [
  http.get('/api/patients', async () => {
    await delay(200);
    return HttpResponse.json(store);
  }),

  http.post('/api/patients', async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as Omit<PatientRecord, 'id'>;
    const record: PatientRecord = { ...body, id: `pat-${String(nextId++).padStart(4, '0')}` };
    store = [...store, record];
    logPatientEvent(AUDIT_ACTIONS.CREATE, record);
    return HttpResponse.json(record, { status: 201 });
  }),

  http.patch('/api/patients/:id', async ({ request, params }) => {
    await delay(200);
    const { id } = params;
    const patch = (await request.json()) as Partial<PatientRecord>;
    const idx = store.findIndex((r) => r.id === id);
    if (idx === -1) {
      return HttpResponse.json({ message: 'Paciente não encontrado' }, { status: 404 });
    }
    const current = store[idx];
    if (!current) {
      return HttpResponse.json({ message: 'Paciente não encontrado' }, { status: 404 });
    }
    const updated: PatientRecord = { ...current, ...patch, id: current.id };
    store = [...store.slice(0, idx), updated, ...store.slice(idx + 1)];
    logPatientEvent(AUDIT_ACTIONS.UPDATE, updated);
    return HttpResponse.json(updated);
  }),

  http.delete('/api/patients/:id', async ({ params }) => {
    await delay(200);
    const { id } = params;
    const existing = store.find((r) => r.id === id);
    if (!existing) {
      return HttpResponse.json({ message: 'Paciente não encontrado' }, { status: 404 });
    }
    store = store.filter((r) => r.id !== id);
    logPatientEvent(AUDIT_ACTIONS.DELETE, existing);
    return new HttpResponse(null, { status: 204 });
  }),
];

import { http, HttpResponse, delay } from 'msw';
import { PATIENTS_FIXTURE, type PatientRecord } from '../fixtures/patients';

/**
 * Store mutável em memória — simula um backend real para CRUD de
 * pacientes. Reinicia a cada reload da página (sem persistência).
 */
let store: PatientRecord[] = PATIENTS_FIXTURE.map((r) => ({ ...r }));
let nextId = store.length + 1;

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
    return HttpResponse.json(updated);
  }),

  http.delete('/api/patients/:id', async ({ params }) => {
    await delay(200);
    const { id } = params;
    const existed = store.some((r) => r.id === id);
    if (!existed) {
      return HttpResponse.json({ message: 'Paciente não encontrado' }, { status: 404 });
    }
    store = store.filter((r) => r.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];

import { http, HttpResponse, delay } from 'msw';
import { ATTENDANCES_FIXTURE, type AttendanceRecord } from '../fixtures/attendances';

/**
 * Store mutável em memória — simula um backend real para CRUD de
 * atendimentos. Reinicia a cada reload da página (sem persistência).
 */
let store: AttendanceRecord[] = ATTENDANCES_FIXTURE.map((r) => ({ ...r }));
let nextId = store.length + 1;

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
    return HttpResponse.json(updated);
  }),

  http.delete('/api/attendances/:id', async ({ params }) => {
    await delay(200);
    const { id } = params;
    const existed = store.some((r) => r.id === id);
    if (!existed) {
      return HttpResponse.json({ message: 'Atendimento não encontrado' }, { status: 404 });
    }
    store = store.filter((r) => r.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];

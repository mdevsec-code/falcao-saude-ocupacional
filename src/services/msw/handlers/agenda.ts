import { http, HttpResponse, delay } from 'msw';
import { AGENDA_FIXTURE, type AppointmentRecord } from '../fixtures/agenda';

/**
 * Store mutável em memória — simula um backend real para CRUD de
 * agendamentos. Reinicia a cada reload da página (sem persistência),
 * o que é aceitável para o ambiente de desenvolvimento local (pré-backend).
 */
let store: AppointmentRecord[] = AGENDA_FIXTURE.map((r) => ({ ...r }));
let nextId = store.length + 1;

export const agendaHandlers = [
  http.get('/api/agenda', async () => {
    await delay(200);
    return HttpResponse.json(store);
  }),

  http.post('/api/agenda', async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as Omit<AppointmentRecord, 'id'>;
    const record: AppointmentRecord = { ...body, id: `apt-${String(nextId++).padStart(4, '0')}` };
    store = [...store, record];
    return HttpResponse.json(record, { status: 201 });
  }),

  http.patch('/api/agenda/:id', async ({ request, params }) => {
    await delay(200);
    const { id } = params;
    const patch = (await request.json()) as Partial<AppointmentRecord>;
    const idx = store.findIndex((r) => r.id === id);
    if (idx === -1) {
      return HttpResponse.json({ message: 'Agendamento não encontrado' }, { status: 404 });
    }
    const current = store[idx];
    if (!current) {
      return HttpResponse.json({ message: 'Agendamento não encontrado' }, { status: 404 });
    }
    const updated: AppointmentRecord = { ...current, ...patch, id: current.id };
    store = [...store.slice(0, idx), updated, ...store.slice(idx + 1)];
    return HttpResponse.json(updated);
  }),

  http.delete('/api/agenda/:id', async ({ params }) => {
    await delay(200);
    const { id } = params;
    const existed = store.some((r) => r.id === id);
    if (!existed) {
      return HttpResponse.json({ message: 'Agendamento não encontrado' }, { status: 404 });
    }
    store = store.filter((r) => r.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];

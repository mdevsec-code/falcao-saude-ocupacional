import { http, HttpResponse, delay } from 'msw';
import { DEMO_USERS, type UserFixture } from '../fixtures/users';

/**
 * Store mutável em memória — simula um backend real para CRUD de
 * usuários. Reinicia a cada reload da página (sem persistência).
 */
let store: UserFixture[] = DEMO_USERS.map((r) => ({ ...r }));
let nextId = store.length + 1;

export const usersHandlers = [
  http.get('/api/users', async () => {
    await delay(200);
    return HttpResponse.json(store);
  }),

  http.post('/api/users', async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as Omit<UserFixture, 'id'>;
    const record: UserFixture = { ...body, id: `u-${String(nextId++).padStart(3, '0')}` };
    store = [...store, record];
    return HttpResponse.json(record, { status: 201 });
  }),

  http.patch('/api/users/:id', async ({ request, params }) => {
    await delay(200);
    const { id } = params;
    const patch = (await request.json()) as Partial<UserFixture>;
    const idx = store.findIndex((r) => r.id === id);
    if (idx === -1) {
      return HttpResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }
    const current = store[idx];
    if (!current) {
      return HttpResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }
    const updated: UserFixture = { ...current, ...patch, id: current.id };
    store = [...store.slice(0, idx), updated, ...store.slice(idx + 1)];
    return HttpResponse.json(updated);
  }),

  http.delete('/api/users/:id', async ({ params }) => {
    await delay(200);
    const { id } = params;
    const existed = store.some((r) => r.id === id);
    if (!existed) {
      return HttpResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }
    store = store.filter((r) => r.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];

import { http, HttpResponse, delay } from 'msw';
import { SEED_USERS, type UserFixture } from '../fixtures/users';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/constants/audit';
import { recordAuditEvent } from './audit';
import { getLastSessionUser } from './auth';

/**
 * Store mutável em memória — simula um backend real para CRUD de
 * usuários. Reinicia a cada reload da página (sem persistência).
 */
let store: UserFixture[] = SEED_USERS.map((r) => ({ ...r }));
let nextId = store.length + 1;

/** Usado por `handlers/auth.ts` para autenticar contas criadas depois do seed inicial. */
export function getUsersStore(): readonly UserFixture[] {
  return store;
}

function logUserEvent(
  action: (typeof AUDIT_ACTIONS)['CREATE' | 'UPDATE' | 'DELETE'],
  record: Pick<UserFixture, 'id' | 'name'>,
): void {
  const actor = getLastSessionUser();
  recordAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action,
    entityType: AUDIT_ENTITY_TYPES.USER,
    entityId: record.id,
    entityLabel: record.name,
  });
}

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
    logUserEvent(AUDIT_ACTIONS.CREATE, record);
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
    logUserEvent(AUDIT_ACTIONS.UPDATE, updated);
    return HttpResponse.json(updated);
  }),

  http.delete('/api/users/:id', async ({ params }) => {
    await delay(200);
    const { id } = params;
    const existing = store.find((r) => r.id === id);
    if (!existing) {
      return HttpResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }
    store = store.filter((r) => r.id !== id);
    logUserEvent(AUDIT_ACTIONS.DELETE, existing);
    return new HttpResponse(null, { status: 204 });
  }),
];

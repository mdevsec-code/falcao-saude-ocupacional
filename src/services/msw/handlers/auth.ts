import { http, HttpResponse, delay } from 'msw';
import { ADMIN_USER, DEMO_USERS, type UserFixture } from '../fixtures/users';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/constants/audit';
import { recordAuditEvent } from './audit';

/**
 * Ambiente de demonstração: todas as contas em `DEMO_USERS` compartilham
 * a mesma senha, para permitir testar RBAC logando com perfis diferentes
 * (médico, enfermeiro, RH, recepção, técnico de segurança) sem precisar
 * memorizar uma senha por conta.
 */
const DEMO_PASSWORD = 'admin123';

interface LoginRequestBody {
  email?: string;
  password?: string;
}

function generateToken(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `mock-${crypto.randomUUID()}`;
  }
  return `mock-${Math.random().toString(36).slice(2)}`;
}

function generateSession(user: UserFixture) {
  return {
    user,
    token: generateToken(),
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
  };
}

// Última sessão emitida — usado por `/auth/me` para refletir quem
// efetivamente logou (em vez de sempre retornar o admin), e pelos demais
// handlers para atribuir a autoria de mutações na trilha de auditoria.
let lastSessionUser: UserFixture = ADMIN_USER;

export function getLastSessionUser(): UserFixture {
  return lastSessionUser;
}

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    await delay(400); // simula latência
    const body = (await request.json().catch(() => ({}))) as LoginRequestBody;
    const email = (body.email ?? '').trim().toLowerCase();
    const password = body.password ?? '';

    const user = DEMO_USERS.find((u) => u.email.toLowerCase() === email);

    if (!user || password !== DEMO_PASSWORD || user.status === 'inactive') {
      recordAuditEvent({
        actorId: user?.id ?? 'desconhecido',
        actorName: user?.name ?? email,
        actorRole: user?.role ?? null,
        action: AUDIT_ACTIONS.LOGIN_FAILED,
        entityType: AUDIT_ENTITY_TYPES.AUTH,
        entityLabel: email,
        detail: user?.status === 'inactive' ? 'Usuário inativo' : 'Credenciais inválidas',
      });
      return HttpResponse.json(
        {
          code: 'INVALID_CREDENTIALS',
          message: user?.status === 'inactive' ? 'Usuário inativo' : 'Credenciais inválidas',
        },
        { status: 401 },
      );
    }

    lastSessionUser = user;
    recordAuditEvent({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: AUDIT_ACTIONS.LOGIN,
      entityType: AUDIT_ENTITY_TYPES.AUTH,
      entityLabel: user.email,
    });
    return HttpResponse.json(generateSession(user), { status: 200 });
  }),

  http.post('/api/auth/logout', async () => {
    await delay(120);
    recordAuditEvent({
      actorId: lastSessionUser.id,
      actorName: lastSessionUser.name,
      actorRole: lastSessionUser.role,
      action: AUDIT_ACTIONS.LOGOUT,
      entityType: AUDIT_ENTITY_TYPES.AUTH,
      entityLabel: lastSessionUser.email,
    });
    return HttpResponse.json({ success: true });
  }),

  http.get('/api/auth/me', async () => {
    await delay(120);
    return HttpResponse.json(generateSession(lastSessionUser));
  }),
];

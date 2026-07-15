import { http, HttpResponse, delay } from 'msw';
import { ADMIN_USER } from '../fixtures/users';

const ADMIN_EMAIL = 'admin@falcao.com';
const ADMIN_PASSWORD = 'admin123';

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

function generateSession(user = ADMIN_USER) {
  return {
    user,
    token: generateToken(),
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
  };
}

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    await delay(400); // simula latência
    const body = (await request.json().catch(() => ({}))) as LoginRequestBody;
    const email = (body.email ?? '').trim().toLowerCase();
    const password = body.password ?? '';

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return HttpResponse.json(
        {
          code: 'INVALID_CREDENTIALS',
          message: 'Credenciais inválidas',
        },
        { status: 401 },
      );
    }

    return HttpResponse.json(generateSession(), { status: 200 });
  }),

  http.post('/api/auth/logout', async () => {
    await delay(120);
    return HttpResponse.json({ success: true });
  }),

  http.get('/api/auth/me', async () => {
    await delay(120);
    return HttpResponse.json(generateSession());
  }),
];

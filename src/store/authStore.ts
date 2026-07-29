import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DEMO_USERS } from '@/services/msw/fixtures/users';
import type { AuthSession, User } from '@/types/auth';

export type SignInResult = { ok: true; session: AuthSession } | { ok: false; error: string };

export interface AuthState {
  session: AuthSession | null;
  isAuthenticated: () => boolean;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
}

// Ambiente de demonstração: todas as contas em `DEMO_USERS` compartilham
// a mesma senha (ver também `services/msw/handlers/auth.ts`, que é quem
// de fato responde no browser — este arquivo só serve de fallback).
// TODO(api-real): substituir `signIn` por chamada real via `authApi`.
const DEMO_PASSWORD = 'admin123';

function findDemoUser(email: string): User | null {
  const match = DEMO_USERS.find((u) => u.email.toLowerCase() === email && u.status === 'active');
  if (!match) return null;
  return { id: match.id, name: match.name, email: match.email, role: match.role };
}

function generateMockToken(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `mock-${crypto.randomUUID()}`;
  }
  return `mock-${Math.random().toString(36).slice(2)}`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      isAuthenticated: (): boolean => get().session !== null,

      signIn: async (email: string, password: string) => {
        const normalizedEmail = email.trim().toLowerCase();
        // Simula latência — quando o MSW estiver habilitado, esta chamada
        // é interceptada e validada pelo handler `POST /api/auth/login`.
        if (typeof window === 'undefined') {
          const demoUser = findDemoUser(normalizedEmail);
          if (demoUser && password === DEMO_PASSWORD) {
            const session: AuthSession = {
              user: demoUser,
              token: generateMockToken(),
              expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
            };
            set({ session });
            return { ok: true, session };
          }
          return { ok: false, error: 'Credenciais inválidas' };
        }

        // No browser, valida contra o endpoint mockado
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: normalizedEmail, password }),
          });
          if (!res.ok) {
            const body = (await res.json().catch(() => ({}))) as { message?: string };
            return { ok: false, error: body.message ?? 'Credenciais inválidas' };
          }
          const session = (await res.json()) as AuthSession;
          set({ session });
          return { ok: true, session };
        } catch {
          // Fallback para as contas de demonstração se MSW não estiver rodando
          const demoUser = findDemoUser(normalizedEmail);
          if (demoUser && password === DEMO_PASSWORD) {
            const session: AuthSession = {
              user: demoUser,
              token: generateMockToken(),
              expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
            };
            set({ session });
            return { ok: true, session };
          }
          return { ok: false, error: 'Não foi possível conectar ao servidor' };
        }
      },

      signOut: async () => {
        if (typeof window !== 'undefined') {
          try {
            await fetch('/api/auth/logout', { method: 'POST' });
          } catch {
            // ignora — sempre removemos a sessão local
          }
        }
        set({ session: null });
      },
    }),
    {
      name: 'falcao-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ session: state.session }),
    },
  ),
);

/**
 * Acesso não-reativo para uso em `httpClient.ts` (interceptors).
 * Não gera re-renderização — use o hook em componentes.
 */
export const authStore = {
  get session() {
    return useAuthStore.getState().session;
  },
  signOut: () => useAuthStore.getState().signOut(),
};

/** Seletores ergonômicos — use em componentes em vez do hook direto. */
export const useAuthSession = () => useAuthStore((s) => s.session);
export const useCurrentUser = () => useAuthStore((s) => s.session?.user ?? null);

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { env } from '@/config/env';
import { SEED_USERS } from '@/services/msw/fixtures/users';
import type { AuthSession, User } from '@/types/auth';

export type SignInResult = { ok: true; session: AuthSession } | { ok: false; error: string };

export interface AuthState {
  session: AuthSession | null;
  isAuthenticated: () => boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<SignInResult>;
  completeSsoLogin: (token: string, expiresAt: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
}

/**
 * "Lembrar de mim" real: quando marcado, a sessão vai para `localStorage`
 * (sobrevive ao fechar o navegador); quando desmarcado, vai para
 * `sessionStorage` (some ao fechar a aba/navegador). A escolha de storage
 * é decidida em tempo real por este flag, também persistido em
 * `localStorage` (ele próprio precisa sobreviver ao reload para sabermos
 * onde procurar a sessão no próximo boot).
 */
const REMEMBER_FLAG_KEY = 'falcao-auth-remember';

function shouldRemember(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(REMEMBER_FLAG_KEY) !== 'false';
}

function setRememberFlag(remember: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REMEMBER_FLAG_KEY, remember ? 'true' : 'false');
}

const dynamicAuthStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    return (shouldRemember() ? localStorage : sessionStorage).getItem(name);
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;
    (shouldRemember() ? localStorage : sessionStorage).setItem(name, value);
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

// Senha de desenvolvimento local — ver `services/msw/handlers/auth.ts`
// (quem de fato responde no browser; este arquivo só serve de fallback
// para quando o MSW não está disponível, ex.: SSR).
// TODO(api-real): substituir `signIn` por chamada real via `authApi`.
const SEED_PASSWORD = 'changeme123';

function findSeedUser(email: string): User | null {
  const match = SEED_USERS.find((u) => u.email.toLowerCase() === email && u.status === 'active');
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

      signIn: async (email: string, password: string, rememberMe = true) => {
        const normalizedEmail = email.trim().toLowerCase();
        setRememberFlag(rememberMe);
        // Simula latência — quando o MSW estiver habilitado, esta chamada
        // é interceptada e validada pelo handler `POST /api/auth/login`.
        if (typeof window === 'undefined') {
          const demoUser = findSeedUser(normalizedEmail);
          if (demoUser && password === SEED_PASSWORD) {
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
          const res = await fetch(`${env.VITE_API_URL}/auth/login`, {
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
          // Fallback de conveniência para desenvolvimento local quando o MSW
          // não está rodando. NUNCA em build de produção — sem isso, o
          // deploy aceitaria a senha fixa (`SEED_PASSWORD`) como login válido
          // até o backend real estar conectado.
          if (import.meta.env.DEV) {
            const demoUser = findSeedUser(normalizedEmail);
            if (demoUser && password === SEED_PASSWORD) {
              const session: AuthSession = {
                user: demoUser,
                token: generateMockToken(),
                expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
              };
              set({ session });
              return { ok: true, session };
            }
          }
          return { ok: false, error: 'Não foi possível conectar ao servidor' };
        }
      },

      completeSsoLogin: async (token: string, expiresAt: string) => {
        setRememberFlag(true);
        try {
          const res = await fetch(`${env.VITE_API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) {
            return { ok: false, error: 'Não foi possível concluir o login com a Microsoft.' };
          }
          const user = (await res.json()) as User;
          const session: AuthSession = { user, token, expiresAt };
          set({ session });
          return { ok: true, session };
        } catch {
          return { ok: false, error: 'Não foi possível conectar ao servidor.' };
        }
      },

      signOut: async () => {
        if (typeof window !== 'undefined') {
          try {
            await fetch(`${env.VITE_API_URL}/auth/logout`, { method: 'POST' });
          } catch {
            // ignora — sempre removemos a sessão local
          }
        }
        set({ session: null });
      },
    }),
    {
      name: 'falcao-auth',
      storage: createJSONStorage(() => dynamicAuthStorage),
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

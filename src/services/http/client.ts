import axios, { type AxiosInstance } from 'axios';
import { env } from '@/config/env';
import { ApiError } from './errors';
import { authStore } from '@/store/authStore';

const TOKEN_KEY = 'falcao-auth';

/**
 * Cliente HTTP central. Adiciona token de autenticação automaticamente
 * e converte `AxiosError` em `ApiError` padronizado.
 *
 * Em desenvolvimento, o MSW intercepta as requisições — não há backend real.
 */
function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      'state' in parsed &&
      parsed.state !== null &&
      typeof parsed.state === 'object' &&
      'session' in parsed.state
    ) {
      const session = (parsed.state as { session: { token?: unknown } }).session;
      return typeof session?.token === 'string' ? session.token : null;
    }
    return null;
  } catch {
    return null;
  }
}

export const httpClient: AxiosInstance = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

httpClient.interceptors.request.use((config) => {
  const token = authStore.session?.token ?? getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const apiError = ApiError.fromAxios(error);
      if (apiError.status === 401) {
        // Token inválido/expirado — encerra sessão e redireciona ao login.
        authStore.signOut();
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.assign('/login');
        }
      }
      return Promise.reject(apiError);
    }
    return Promise.reject(new ApiError({ message: 'Erro desconhecido', code: 'UNKNOWN_ERROR' }));
  },
);

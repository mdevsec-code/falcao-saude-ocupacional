import type { AxiosError, AxiosRequestConfig } from 'axios';

/**
 * Erro normalizado da camada HTTP. Sempre use este tipo ao consumir services,
 * nunca `AxiosError` cru — facilita mocking e troca de cliente HTTP.
 */
export class ApiError extends Error {
  override readonly name = 'ApiError';
  readonly code: string;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor({
    message,
    code = 'UNKNOWN_ERROR',
    status = 0,
    details,
  }: {
    message: string;
    code?: string;
    status?: number;
    details?: Record<string, unknown>;
  }) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }

  static fromAxios(
    error: AxiosError<{ code?: string; message?: string; details?: Record<string, unknown> }>,
  ): ApiError {
    const status = error.response?.status ?? 0;
    const data = error.response?.data;
    return new ApiError({
      message: data?.message ?? error.message ?? 'Erro de rede',
      code: data?.code ?? mapStatusToCode(status),
      status,
      details: data?.details,
    });
  }
}

function mapStatusToCode(status: number): string {
  if (status === 0) return 'NETWORK_ERROR';
  if (status === 401) return 'UNAUTHENTICATED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 409) return 'CONFLICT';
  if (status === 422) return 'VALIDATION_ERROR';
  if (status >= 500) return 'SERVER_ERROR';
  return 'HTTP_ERROR';
}

export type RequestConfig<TResponse> = AxiosRequestConfig & {
  /** Tipo da resposta (apenas para legibilidade de generics em services). */
  __responseType?: TResponse;
};

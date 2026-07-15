/**
 * Tipos utilitários compartilhados pela camada HTTP.
 * Mantém contratos de paginação e resposta consistentes entre features.
 */

export interface Paginated<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
  };
}

export interface ApiSuccess<T> {
  data: T;
}

export interface ApiFailure {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}

# API

A camada HTTP vive em [`src/services/http/`](../src/services/http/). Durante o
desenvolvimento, todas as requisições são interceptadas pelo
[MSW](https://mswjs.io/) (configurado em [`src/services/msw/`](../src/services/msw/)).

> ⚠️ Os endpoints abaixo são **mockados**. Em produção, a baseURL apontará
> para o backend real (Etapa 3).

## Convenções

- **Base path**: `/api`
- **Auth**: header `Authorization: Bearer <token>` (exceto `/auth/login`)
- **Content-Type**: `application/json` (envio); aceita `application/json` (resposta)
- **Erros**: `4xx` (cliente) / `5xx` (servidor) com payload
  `{ code, message, details? }`
- **Datas**: ISO 8601 (`2026-01-15T10:30:00Z`)
- **IDs**: `string` (UUID v4)

## Autenticação

### `POST /api/auth/login`

Realiza login. **Não requer** token.

**Request**
```json
{
  "email": "admin@falcao.com",
  "password": "admin123"
}
```

**Response 200**
```json
{
  "user": {
    "id": "u-1",
    "name": "Administrador Falcão",
    "email": "admin@falcao.com",
    "role": "admin",
    "avatarUrl": null
  },
  "token": "mock-jwt-...",
  "expiresAt": "2026-01-15T18:30:00.000Z"
}
```

**Response 401**
```json
{
  "code": "INVALID_CREDENTIALS",
  "message": "E-mail ou senha inválidos."
}
```

**Exemplo (curl)**
```bash
curl -X POST http://localhost:5173/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@falcao.com","password":"admin123"}'
```

### `POST /api/auth/logout`

Invalida a sessão atual. **Requer** token.

**Response 204** — sem body.

### `GET /api/auth/me`

Retorna o usuário autenticado. **Requer** token.

**Response 200**
```json
{
  "id": "u-1",
  "name": "Administrador Falcão",
  "email": "admin@falcao.com",
  "role": "admin",
  "avatarUrl": null
}
```

## Dashboard

### `GET /api/dashboard/kpis`

Retorna os KPIs da home. **Requer** token.

**Response 200**
```json
{
  "kpis": [
    {
      "id": "appointments-today",
      "label": "Atendimentos hoje",
      "value": 12,
      "delta": 0.08,
      "unit": "number",
      "icon": "calendar"
    },
    {
      "id": "pending-exams",
      "label": "Exames pendentes",
      "value": 3,
      "delta": -0.05,
      "unit": "number",
      "icon": "flask"
    },
    {
      "id": "active-patients",
      "label": "Pacientes ativos",
      "value": 248,
      "delta": 0.12,
      "unit": "number",
      "icon": "users"
    },
    {
      "id": "aso-emitidas",
      "label": "ASOs emitidas (mês)",
      "value": 47,
      "delta": 0.0,
      "unit": "number",
      "icon": "shield-check"
    }
  ]
}
```

> `delta` é a variação percentual em relação ao período anterior. Ex: `0.08`
> = +8%.

## Tipos compartilhados

```ts
// src/services/http/types.ts
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };
```

## Erro normalizado

```ts
// src/services/http/errors.ts
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;
  static fromAxios(err: AxiosError): ApiError;
  static fromUnknown(err: unknown): ApiError;
}
```

Componente `ErrorState` consome o `ApiError` e exibe a `message` localizável
via `errors.json`.

## Próximas etapas

- **Etapa 3** — `GET/POST/PUT/DELETE /patients`, `/appointments`, `/exams`,
  `/aso`, `/reports`.
- **Etapa 4** — `WebSocket` para agenda em tempo real.
- **Etapa 7** — auditoria, rate limiting, SLOs.

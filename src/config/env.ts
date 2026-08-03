import { z } from 'zod';

/**
 * Schema de validação das variáveis de ambiente. Falha em `import.meta.env`
 * ausente ou tipos errados — use `env` em vez de acessar `import.meta.env` direto.
 */
const envSchema = z.object({
  VITE_API_URL: z
    .string()
    .url('VITE_API_URL deve ser uma URL válida')
    .default('http://localhost:5173/api'),
  VITE_ENABLE_MSW: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
  VITE_ENABLE_MICROSOFT_SSO: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
  VITE_DEFAULT_LOCALE: z.string().min(2).max(10).default('pt-BR'),
  VITE_APP_NAME: z.string().min(1).default('Falcão Saúde Ocupacional'),
  VITE_SENTRY_DSN: z.string().url().optional(),
  VITE_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('❌ Variáveis de ambiente inválidas:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables. Verifique o arquivo .env.example.');
}

export const env = Object.freeze(parsed.data);
export type Env = typeof env;

import { z } from 'zod';
import { emailSchema, passwordSchema } from './common';

/** Schema do formulário de login. */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;

/** Schema da resposta `POST /auth/login` (compatível com `AuthSession`). */
export const sessionSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(['ADMIN', 'MEDICO', 'ENFERMEIRO', 'TECNICO_SEGURANCA', 'RH', 'RECEPCAO']),
    avatarUrl: z.string().url().optional(),
    companyId: z.string().optional(),
  }),
  token: z.string().min(1),
  expiresAt: z.string(),
});

export type SessionDto = z.infer<typeof sessionSchema>;

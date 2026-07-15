import { z } from 'zod';
import { emailSchema, passwordSchema } from '@/validators/common';

export { ROLES, ROLE_LABELS, ALL_ROLES, type Role } from '@/constants/roles';
export type { AuthSession, User } from '@/types/auth';

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;

import { z } from 'zod';

import i18n from '@/i18n';
import { emailSchema, nonEmptyString } from '@/validators/common';
import { ROLES } from '@/constants/roles';
import type { UserFixture, UserStatus } from '@/services/msw/fixtures/users';

export type { UserFixture as UserRecord, UserStatus };

export interface UserFilters {
  role?: string;
  status?: UserStatus;
  busca?: string;
}

/** Senha exigida ao criar; na edição é opcional — só é enviada se o admin quiser redefini-la. */
export const USER_PASSWORD_MIN_LENGTH = 8;

export const userFormSchema = z.object({
  name: nonEmptyString.min(3, i18n.t('validation:nameRequired')),
  email: emailSchema,
  role: z.enum([
    ROLES.ADMIN,
    ROLES.MEDICO,
    ROLES.ENFERMEIRO,
    ROLES.TECNICO_SEGURANCA,
    ROLES.RH,
    ROLES.RECEPCAO,
    ROLES.GESTOR_SSO,
  ]),
  status: z.enum(['active', 'inactive']),
  // Na edição fica em branco por padrão (mantém a senha atual); se o admin
  // digitar algo, precisa bater com o mínimo — por isso o refine abaixo em
  // vez de só `.optional()`.
  password: z
    .string()
    .optional()
    .refine((value) => !value || value.length >= USER_PASSWORD_MIN_LENGTH, {
      message: i18n.t('users:validation.passwordMinLength', { count: USER_PASSWORD_MIN_LENGTH }),
    }),
});

export type UserFormInput = z.infer<typeof userFormSchema>;

/** Só na criação a senha é obrigatória; na edição é sempre opcional (reset). */
export function buildUserFormSchema(requirePassword: boolean) {
  if (!requirePassword) return userFormSchema;
  return userFormSchema.extend({
    password: z
      .string()
      .min(
        USER_PASSWORD_MIN_LENGTH,
        i18n.t('users:validation.passwordMinLength', { count: USER_PASSWORD_MIN_LENGTH }),
      ),
  });
}

export function toFormInput(record: UserFixture): UserFormInput {
  return {
    name: record.name,
    email: record.email,
    role: record.role,
    status: record.status,
    password: undefined,
  };
}

export interface CreateUserPayload {
  name: string;
  email: string;
  role: UserFixture['role'];
  status: UserStatus;
  password: string;
}

/** Payload de criação — inclui a senha, exigida pela API. */
export function fromCreateFormInput(input: UserFormInput): CreateUserPayload {
  return {
    name: input.name,
    email: input.email,
    role: input.role,
    status: input.status,
    password: input.password ?? '',
  };
}

export interface UpdateUserPayload extends Omit<UserFixture, 'id'> {
  /** Só vai no PATCH se o admin preencheu — reseta a senha do usuário. */
  password?: string;
}

/** Payload de edição — senha só entra se o admin digitou algo no campo de reset. */
export function fromUpdateFormInput(input: UserFormInput): UpdateUserPayload {
  return {
    name: input.name,
    email: input.email,
    role: input.role,
    status: input.status,
    ...(input.password ? { password: input.password } : {}),
  };
}

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

/** Senha exigida só ao criar (a API não tem endpoint de troca de senha na edição ainda). */
export const USER_PASSWORD_MIN_LENGTH = 12;

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
  ]),
  status: z.enum(['active', 'inactive']),
  password: z.string().optional(),
});

export type UserFormInput = z.infer<typeof userFormSchema>;

/** Usado só ao criar — exige a senha mínima que a API vai checar de qualquer forma. */
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

/** Payload de edição — nunca inclui senha (a API rejeita campos não esperados no PATCH). */
export function fromUpdateFormInput(input: UserFormInput): Omit<UserFixture, 'id'> {
  return {
    name: input.name,
    email: input.email,
    role: input.role,
    status: input.status,
  };
}

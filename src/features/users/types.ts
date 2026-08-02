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
});

export type UserFormInput = z.infer<typeof userFormSchema>;

export function toFormInput(record: UserFixture): UserFormInput {
  return {
    name: record.name,
    email: record.email,
    role: record.role,
    status: record.status,
  };
}

export function fromFormInput(input: UserFormInput): Omit<UserFixture, 'id'> {
  return {
    name: input.name,
    email: input.email,
    role: input.role,
    status: input.status,
  };
}

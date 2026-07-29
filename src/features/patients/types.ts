import { z } from 'zod';

import { cpfSchema, nonEmptyString, phoneSchema } from '@/validators/common';
import { PATIENT_STATUS, type PatientStatus } from '@/constants/status';
import type { PatientRecord } from '@/services/msw/fixtures/patients';

export type { PatientRecord, PatientStatus };
export { SECTORS } from '@/services/msw/fixtures/patients';

export interface PatientFilters {
  sector?: string;
  status?: PatientStatus;
  busca?: string;
}

export const patientFormSchema = z.object({
  name: nonEmptyString.min(3, 'Informe o nome completo'),
  cpf: cpfSchema,
  birthDate: nonEmptyString,
  phone: z
    .string()
    .optional()
    .transform((s) => (s ? s : undefined))
    .refine((s) => s === undefined || phoneSchema.safeParse(s).success, 'Telefone inválido'),
  email: z
    .string()
    .optional()
    .transform((s) => (s ? s : undefined))
    .refine((s) => s === undefined || z.string().email().safeParse(s).success, 'E-mail inválido'),
  sector: nonEmptyString,
  role: nonEmptyString,
  admissionDate: nonEmptyString,
  status: z.enum([PATIENT_STATUS.ATIVO, PATIENT_STATUS.INATIVO, PATIENT_STATUS.AFASTADO]),
  notes: z.string().max(500, 'Tamanho máximo excedido').optional(),
});

export type PatientFormInput = z.infer<typeof patientFormSchema>;

export function toFormInput(record: PatientRecord): PatientFormInput {
  return {
    name: record.name,
    cpf: record.cpf,
    birthDate: record.birthDate,
    phone: record.phone ?? undefined,
    email: record.email ?? undefined,
    sector: record.sector,
    role: record.role,
    admissionDate: record.admissionDate,
    status: record.status,
    notes: record.notes ?? undefined,
  };
}

export function fromFormInput(input: PatientFormInput): Omit<PatientRecord, 'id'> {
  return {
    name: input.name,
    cpf: input.cpf,
    birthDate: input.birthDate,
    phone: input.phone ?? null,
    email: input.email ?? null,
    sector: input.sector,
    role: input.role,
    admissionDate: input.admissionDate,
    status: input.status,
    notes: input.notes ?? null,
  };
}

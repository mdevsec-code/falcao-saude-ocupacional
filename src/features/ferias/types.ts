import { z } from 'zod';

import i18n from '@/i18n';
import { nonEmptyString } from '@/validators/common';
import { VACATION_STATUS, type VacationStatus } from '@/constants/status';
import type { VacationRecord } from '@/services/msw/fixtures/ferias';

export type { VacationRecord, VacationStatus };
export { SECTORS } from '@/services/msw/fixtures/patients';

export interface VacationFilters {
  sector?: string;
  status?: VacationStatus;
  busca?: string;
}

export const vacationFormSchema = z
  .object({
    patientName: nonEmptyString.min(3, i18n.t('validation:nameRequired')),
    sector: nonEmptyString,
    role: nonEmptyString,
    startDate: nonEmptyString,
    endDate: nonEmptyString,
    status: z.enum([
      VACATION_STATUS.AGENDADO,
      VACATION_STATUS.EM_ANDAMENTO,
      VACATION_STATUS.CONCLUIDO,
      VACATION_STATUS.CANCELADO,
    ]),
    notes: z
      .string()
      .max(500, i18n.t('validation:maxLength', { count: 500 }))
      .optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: i18n.t('ferias:validation.dateRangeInvalid'),
    path: ['endDate'],
  });

export type VacationFormInput = z.infer<typeof vacationFormSchema>;

function daysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff + 1;
}

export function toFormInput(record: VacationRecord): VacationFormInput {
  return {
    patientName: record.patientName,
    sector: record.sector,
    role: record.role,
    startDate: record.startDate,
    endDate: record.endDate,
    status: record.status,
    notes: record.notes ?? undefined,
  };
}

export function fromFormInput(input: VacationFormInput): Omit<VacationRecord, 'id'> {
  return {
    patientName: input.patientName,
    sector: input.sector,
    role: input.role,
    startDate: input.startDate,
    endDate: input.endDate,
    days: daysBetween(input.startDate, input.endDate),
    status: input.status,
    notes: input.notes ?? null,
  };
}

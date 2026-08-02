import { z } from 'zod';

import i18n from '@/i18n';
import { nonEmptyString, phoneSchema } from '@/validators/common';
import { APPOINTMENT_STATUS, type AppointmentStatus } from '@/constants/status';
import type { AppointmentRecord } from '@/services/msw/fixtures/agenda';

export type { AppointmentRecord, AppointmentStatus };
export { DOCTORS } from '@/services/msw/fixtures/agenda';

export type AgendaView = 'month' | 'week' | 'day';

export interface AgendaFilters {
  doctor?: string;
  examType?: string;
  status?: AppointmentStatus;
}

export const appointmentFormSchema = z.object({
  patientName: nonEmptyString.min(3, i18n.t('agenda:validation.patientNameRequired')),
  phone: z
    .string()
    .optional()
    .transform((s) => (s ? s : undefined))
    .refine((s) => s === undefined || phoneSchema.safeParse(s).success, i18n.t('validation:phone')),
  examType: nonEmptyString,
  doctor: nonEmptyString,
  status: z.enum([
    APPOINTMENT_STATUS.AGENDADO,
    APPOINTMENT_STATUS.REALIZADO,
    APPOINTMENT_STATUS.CANCELADO,
    APPOINTMENT_STATUS.FALTOU,
  ]),
  date: nonEmptyString,
  time: nonEmptyString,
  durationMin: z.coerce
    .number()
    .int()
    .min(10, i18n.t('validation:minDuration', { count: 10 }))
    .max(240, i18n.t('validation:maxDuration', { count: 240 })),
  notes: z
    .string()
    .max(500, i18n.t('validation:maxLength', { count: 500 }))
    .optional(),
});

export type AppointmentFormInput = z.infer<typeof appointmentFormSchema>;

export function toFormInput(record: AppointmentRecord): AppointmentFormInput {
  const startsAt = new Date(record.startsAt);
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    patientName: record.patientName,
    phone: record.phone ?? undefined,
    examType: record.examType,
    doctor: record.doctor,
    status: record.status,
    date: `${startsAt.getFullYear()}-${pad(startsAt.getMonth() + 1)}-${pad(startsAt.getDate())}`,
    time: `${pad(startsAt.getHours())}:${pad(startsAt.getMinutes())}`,
    durationMin: record.durationMin,
    notes: record.notes ?? undefined,
  };
}

export function fromFormInput(input: AppointmentFormInput): Omit<AppointmentRecord, 'id'> {
  const startsAt = new Date(`${input.date}T${input.time}:00`);
  return {
    patientName: input.patientName,
    phone: input.phone ?? null,
    examType: input.examType,
    doctor: input.doctor,
    status: input.status,
    startsAt: startsAt.toISOString(),
    durationMin: input.durationMin,
    notes: input.notes ?? null,
  };
}

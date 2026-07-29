import { z } from 'zod';

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
  patientName: nonEmptyString.min(3, 'Informe o nome completo do paciente'),
  phone: z
    .string()
    .optional()
    .transform((s) => (s ? s : undefined))
    .refine((s) => s === undefined || phoneSchema.safeParse(s).success, 'Telefone inválido'),
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
  durationMin: z.coerce.number().int().min(10, 'Mínimo 10 minutos').max(240, 'Máximo 240 minutos'),
  notes: z.string().max(500, 'Tamanho máximo excedido').optional(),
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

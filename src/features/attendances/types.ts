import { z } from 'zod';

import { nonEmptyString } from '@/validators/common';
import { APPOINTMENT_CONCLUSION, type AppointmentConclusion } from '@/constants/status';
import { DUTY_TYPES } from '@/constants/duties';
import type { AttendanceRecord, DutyFitness } from '@/services/msw/fixtures/attendances';

export type { AttendanceRecord, AppointmentConclusion, DutyFitness };
export { DOCTORS } from '@/services/msw/fixtures/agenda';

export interface AttendanceFilters {
  patientId?: string;
  doctor?: string;
  examType?: string;
  conclusion?: AppointmentConclusion;
  duty?: string;
  dataInicio?: string;
  dataFim?: string;
}

const dutyTypeEnum = z.enum([
  DUTY_TYPES.ALTURA,
  DUTY_TYPES.ESPACO_CONFINADO,
  DUTY_TYPES.MAQUINAS_PESADAS,
  DUTY_TYPES.ELETRICIDADE,
  DUTY_TYPES.LEVANTAMENTO_PESO,
  DUTY_TYPES.RUIDO,
]);

export const attendanceFormSchema = z.object({
  patientId: nonEmptyString,
  examType: nonEmptyString,
  doctor: nonEmptyString,
  conclusion: z.enum([
    APPOINTMENT_CONCLUSION.APTO,
    APPOINTMENT_CONCLUSION.APTO_COM_RESTRICAO,
    APPOINTMENT_CONCLUSION.INAPTO,
    APPOINTMENT_CONCLUSION.ENCAMINHADO,
  ]),
  attendanceDate: nonEmptyString,
  restrictionNotes: z.string().max(500, 'Tamanho máximo excedido').optional(),
  notes: z.string().max(500, 'Tamanho máximo excedido').optional(),
  dutyFitness: z.array(z.object({ duty: dutyTypeEnum, fit: z.boolean() })).default([]),
});

export type AttendanceFormInput = z.infer<typeof attendanceFormSchema>;

export function toFormInput(record: AttendanceRecord): AttendanceFormInput {
  return {
    patientId: record.patientId,
    examType: record.examType,
    doctor: record.doctor,
    conclusion: record.conclusion,
    attendanceDate: record.attendanceDate,
    restrictionNotes: record.restrictionNotes ?? undefined,
    notes: record.notes ?? undefined,
    dutyFitness: record.dutyFitness,
  };
}

export function fromFormInput(
  input: AttendanceFormInput,
  patientName: string,
): Omit<AttendanceRecord, 'id'> {
  return {
    patientId: input.patientId,
    patientName,
    examType: input.examType,
    doctor: input.doctor,
    conclusion: input.conclusion,
    attendanceDate: input.attendanceDate,
    restrictionNotes:
      input.conclusion === APPOINTMENT_CONCLUSION.APTO_COM_RESTRICAO
        ? (input.restrictionNotes ?? null)
        : null,
    notes: input.notes ?? null,
    dutyFitness: input.dutyFitness,
  };
}

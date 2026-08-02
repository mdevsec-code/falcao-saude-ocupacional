import { createTranslatedLabels } from '@/utils/i18nLabels';

/**
 * Status compartilhados do domínio.
 * Etapas seguintes (agenda, atendimento) reutilizarão estes rótulos.
 */
export const APPOINTMENT_STATUS = {
  AGENDADO: 'agendado',
  REALIZADO: 'realizado',
  CANCELADO: 'cancelado',
  FALTOU: 'faltou',
} as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];

/** Rótulos traduzidos (`enums:appointmentStatus.*`) — acompanham o idioma ativo. */
export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> =
  createTranslatedLabels<AppointmentStatus>('appointmentStatus');

export const APPOINTMENT_CONCLUSION = {
  APTO: 'apto',
  APTO_COM_RESTRICAO: 'apto_restricao',
  INAPTO: 'inapto',
  ENCAMINHADO: 'encaminhado',
} as const;

export type AppointmentConclusion =
  (typeof APPOINTMENT_CONCLUSION)[keyof typeof APPOINTMENT_CONCLUSION];

/** Rótulos traduzidos (`enums:appointmentConclusion.*`) — acompanham o idioma ativo. */
export const APPOINTMENT_CONCLUSION_LABELS: Record<AppointmentConclusion, string> =
  createTranslatedLabels<AppointmentConclusion>('appointmentConclusion');

export const PATIENT_STATUS = {
  ATIVO: 'ativo',
  INATIVO: 'inativo',
  AFASTADO: 'afastado',
} as const;

export type PatientStatus = (typeof PATIENT_STATUS)[keyof typeof PATIENT_STATUS];

/** Rótulos traduzidos (`enums:patientStatus.*`) — acompanham o idioma ativo. */
export const PATIENT_STATUS_LABELS: Record<PatientStatus, string> =
  createTranslatedLabels<PatientStatus>('patientStatus');

export const VACATION_STATUS = {
  AGENDADO: 'agendado',
  EM_ANDAMENTO: 'em_andamento',
  CONCLUIDO: 'concluido',
  CANCELADO: 'cancelado',
} as const;

export type VacationStatus = (typeof VACATION_STATUS)[keyof typeof VACATION_STATUS];

/** Rótulos traduzidos (`enums:vacationStatus.*`) — acompanham o idioma ativo. */
export const VACATION_STATUS_LABELS: Record<VacationStatus, string> =
  createTranslatedLabels<VacationStatus>('vacationStatus');

export const DEVIATION_STATUS = {
  PENDENTE: 'pendente',
  EM_ANDAMENTO: 'em_andamento',
  CONCLUIDO: 'concluido',
} as const;

export type DeviationStatus = (typeof DEVIATION_STATUS)[keyof typeof DEVIATION_STATUS];

/** Rótulos traduzidos (`enums:deviationStatus.*`) — acompanham o idioma ativo. */
export const DEVIATION_STATUS_LABELS: Record<DeviationStatus, string> =
  createTranslatedLabels<DeviationStatus>('deviationStatus');

export const DEVIATION_CLASSIFICATION = {
  ACESSIBILIDADE: 'acessibilidade',
  ORGANIZACAO: 'organizacao',
  COMPORTAMENTAL: 'comportamental',
  EQUIPAMENTO: 'equipamento',
  EPI: 'epi',
  ERGONOMIA: 'ergonomia',
  PROCEDIMENTO: 'procedimento',
  RESIDUOS: 'residuos',
  SINALIZACAO: 'sinalizacao',
  ELETRICIDADE: 'eletricidade',
} as const;

export type DeviationClassification =
  (typeof DEVIATION_CLASSIFICATION)[keyof typeof DEVIATION_CLASSIFICATION];

/** Rótulos traduzidos (`enums:deviationClassification.*`) — acompanham o idioma ativo. */
export const DEVIATION_CLASSIFICATION_LABELS: Record<DeviationClassification, string> =
  createTranslatedLabels<DeviationClassification>('deviationClassification');

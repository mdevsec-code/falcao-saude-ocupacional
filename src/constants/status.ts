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

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  [APPOINTMENT_STATUS.AGENDADO]: 'Agendado',
  [APPOINTMENT_STATUS.REALIZADO]: 'Realizado',
  [APPOINTMENT_STATUS.CANCELADO]: 'Cancelado',
  [APPOINTMENT_STATUS.FALTOU]: 'Faltou',
};

export const APPOINTMENT_CONCLUSION = {
  APTO: 'apto',
  APTO_COM_RESTRICAO: 'apto_restricao',
  INAPTO: 'inapto',
  ENCAMINHADO: 'encaminhado',
} as const;

export type AppointmentConclusion =
  (typeof APPOINTMENT_CONCLUSION)[keyof typeof APPOINTMENT_CONCLUSION];

export const APPOINTMENT_CONCLUSION_LABELS: Record<AppointmentConclusion, string> = {
  [APPOINTMENT_CONCLUSION.APTO]: 'Apto',
  [APPOINTMENT_CONCLUSION.APTO_COM_RESTRICAO]: 'Apto c/ restrição',
  [APPOINTMENT_CONCLUSION.INAPTO]: 'Inapto',
  [APPOINTMENT_CONCLUSION.ENCAMINHADO]: 'Encaminhado',
};

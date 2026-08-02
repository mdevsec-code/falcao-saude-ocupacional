import { type AppointmentStatus } from '@/constants/status';

export interface AppointmentRecord {
  id: string;
  patientName: string;
  phone: string | null;
  examType: string;
  doctor: string;
  status: AppointmentStatus;
  /** Início do horário, ISO 8601. */
  startsAt: string;
  durationMin: number;
  notes: string | null;
}

// TODO(etapa-3): substituir por uma listagem real de médicos vinda do
// módulo `features/users` (perfil MEDICO), em vez de uma lista fixa.
export const DOCTORS = [
  'Dra. Camila Torres — CRM 45213',
  'Dr. Eduardo Nakamura — CRM 38870',
  'Dra. Beatriz Lacerda — CRM 51902',
  'Dr. Rafael Monteiro — CRM 29715',
] as const;

/** Sem consultas pré-cadastradas — a agenda começa vazia após o lançamento. */
export const AGENDA_FIXTURE: AppointmentRecord[] = [];

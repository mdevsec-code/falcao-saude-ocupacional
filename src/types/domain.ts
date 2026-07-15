import type { AppointmentConclusion, AppointmentStatus } from '@/constants/status';

/**
 * Stub de tipos de domínio. Serão expandidos nas Etapas 4 e 5
 * à medida que os módulos forem implementados.
 */

export interface Patient {
  id: string;
  name: string;
  document?: string; // CPF
  birthDate?: string;
  phone?: string;
  email?: string;
  companyId?: string;
}

export interface Employee {
  id: string;
  name: string;
  registration: string;
  sector: string;
  role: string;
  companyId?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  employeeId?: string;
  date: string; // ISO date
  time?: string; // HH:mm
  status: AppointmentStatus;
  cid?: string;
  pathology?: string;
  description?: string;
  restrictedActivity?: boolean;
  restrictionDescription?: string;
  heightWork?: 'sim' | 'nao' | 'nao_avaliado';
  postObservations?: string;
  conclusion?: AppointmentConclusion;
  conclusionDescription?: string;
}

import { type PatientStatus } from '@/constants/status';

export interface PatientRecord {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  phone: string | null;
  email: string | null;
  sector: string;
  role: string;
  admissionDate: string;
  status: PatientStatus;
  notes: string | null;
}

export const SECTORS = [
  'Administrativo',
  'Obras',
  'Manutenção',
  'Logística',
  'Produção',
  'Segurança do Trabalho',
] as const;

/** Sem dados pré-cadastrados — os colaboradores são cadastrados após o lançamento. */
export const PATIENTS_FIXTURE: PatientRecord[] = [];

import { type DeviationClassification, type DeviationStatus } from '@/constants/status';

export interface DeviationRecord {
  id: string;
  date: string;
  location: string;
  classification: DeviationClassification;
  description: string;
  foreman: string | null;
  responsibleTechnician: string | null;
  action: string | null;
  status: DeviationStatus;
}

/** Locais de operação para o registro de desvios (canteiros, fábricas e áreas comuns). */
export const DEVIATION_LOCATIONS = [
  'Estacionamento',
  'Fábrica 1',
  'Fábrica 2',
  'Fábrica 4',
  'Fábrica 5',
  'Fábrica 6',
  'Fábrica 7',
  'Fábrica 9',
  'Fábrica 10',
  'Fábrica 11',
  'Fábrica 14',
  'Fábrica 25',
  'Fábrica 28',
  'Fábrica 29',
  'Fábrica 34',
  'Área de Vivência',
  'Central de Concreto',
  'Área Externa',
  'Carpintaria',
  'Usina de Concreto',
] as const;

/** Sem desvios pré-cadastrados — o registro começa a ser preenchido após o lançamento. */
export const DEVIATIONS_FIXTURE: DeviationRecord[] = [];

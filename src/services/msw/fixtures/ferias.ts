import { type VacationStatus } from '@/constants/status';

export interface VacationRecord {
  id: string;
  patientName: string;
  sector: string;
  role: string;
  startDate: string;
  endDate: string;
  days: number;
  status: VacationStatus;
  notes: string | null;
}

/** Sem férias pré-cadastradas — os períodos são lançados após o lançamento. */
export const FERIAS_FIXTURE: VacationRecord[] = [];

import { type AppointmentConclusion } from '@/constants/status';
import { type DutyType } from '@/constants/duties';

export interface DutyFitness {
  duty: DutyType;
  fit: boolean;
}

export interface AttendanceRecord {
  id: string;
  patientId: string;
  patientName: string;
  examType: string;
  doctor: string;
  conclusion: AppointmentConclusion;
  attendanceDate: string;
  restrictionNotes: string | null;
  notes: string | null;
  dutyFitness: DutyFitness[];
}

/** Sem atendimentos pré-cadastrados — o histórico começa a ser construído após o lançamento. */
export const ATTENDANCES_FIXTURE: AttendanceRecord[] = [];

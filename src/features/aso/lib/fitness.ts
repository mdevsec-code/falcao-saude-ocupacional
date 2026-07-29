import { ALL_DUTY_TYPES, type DutyType } from '@/constants/duties';
import type { AttendanceRecord } from '@/features/attendances/types';

export type FitnessByDuty = Partial<Record<DutyType, boolean>>;

/**
 * Para um paciente, retorna a aptidão mais recente conhecida para cada
 * atividade de risco — cada atividade pode ter sido avaliada em exames
 * diferentes, então olhamos o atendimento mais recente QUE avaliou
 * aquela atividade especificamente, não apenas o atendimento mais
 * recente em geral.
 */
export function getLatestFitnessByDuty(
  records: readonly AttendanceRecord[],
  patientId: string,
): FitnessByDuty {
  const patientRecords = records
    .filter((r) => r.patientId === patientId)
    .slice()
    .sort((a, b) => b.attendanceDate.localeCompare(a.attendanceDate));

  const result: FitnessByDuty = {};
  for (const duty of ALL_DUTY_TYPES) {
    const latest = patientRecords.find((r) => r.dutyFitness.some((d) => d.duty === duty));
    const entry = latest?.dutyFitness.find((d) => d.duty === duty);
    if (entry) result[duty] = entry.fit;
  }
  return result;
}

/** true se pelo menos uma atividade avaliada estiver como inapto. */
export function hasAnyUnfitDuty(fitness: FitnessByDuty): boolean {
  return Object.values(fitness).some((fit) => fit === false);
}

import { APPOINTMENT_CONCLUSION, type AppointmentConclusion } from '@/constants/status';
import { ALL_DUTY_TYPES, ROLE_DEFAULT_DUTIES, type DutyType } from '@/constants/duties';
import { DOCTORS } from './agenda';
import { EXAM_TYPES_FIXTURE } from './exams';
import { PATIENTS_FIXTURE } from './patients';

const SEED_EXAM_NAMES = EXAM_TYPES_FIXTURE.map((e) => e.name);

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

/** PRNG determinístico (mulberry32) — fixture estável entre reloads. */
function createRng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  const item = arr[Math.floor(rng() * arr.length)];
  if (item === undefined) throw new Error('pick: array vazio');
  return item;
}

const CONCLUSION_POOL: readonly AppointmentConclusion[] = [
  APPOINTMENT_CONCLUSION.APTO,
  APPOINTMENT_CONCLUSION.APTO,
  APPOINTMENT_CONCLUSION.APTO,
  APPOINTMENT_CONCLUSION.APTO,
  APPOINTMENT_CONCLUSION.APTO,
  APPOINTMENT_CONCLUSION.APTO_COM_RESTRICAO,
  APPOINTMENT_CONCLUSION.INAPTO,
  APPOINTMENT_CONCLUSION.ENCAMINHADO,
];

const RESTRICTION_NOTES = [
  'Restrição para trabalho em altura por 30 dias.',
  'Uso obrigatório de protetor auricular tipo concha.',
  'Restrição para levantamento de peso acima de 10kg.',
  'Reavaliação em 60 dias.',
] as const;

function randomDateBetween(rng: () => number, start: Date, end: Date): string {
  const t = start.getTime() + rng() * (end.getTime() - start.getTime());
  return new Date(t).toISOString().slice(0, 10);
}

/**
 * Gera a aptidão por atividade avaliada no exame. Usa as atividades
 * padrão da função do colaborador (`ROLE_DEFAULT_DUTIES`) como base —
 * se a função não tiver atividades de risco mapeadas, sorteia 1-2 do
 * conjunto geral para não deixar o exame "vazio".
 */
function generateDutyFitness(
  rng: () => number,
  role: string,
  conclusion: AppointmentConclusion,
): DutyFitness[] {
  let duties = ROLE_DEFAULT_DUTIES[role] ?? [];
  if (duties.length === 0 && rng() > 0.5) {
    duties = [pick(rng, ALL_DUTY_TYPES)];
  }

  return duties.map((duty, idx) => {
    // Quando o resultado geral é inapto/encaminhado, a primeira atividade
    // avaliada reflete essa restrição; as demais seguem aptas.
    const isRestricted =
      (conclusion === APPOINTMENT_CONCLUSION.INAPTO ||
        conclusion === APPOINTMENT_CONCLUSION.APTO_COM_RESTRICAO) &&
      idx === 0;
    return { duty, fit: !isRestricted };
  });
}

function generateAttendances(count: number): AttendanceRecord[] {
  const rng = createRng(20260729);
  const today = new Date();
  const rangeStart = new Date(today);
  rangeStart.setMonth(rangeStart.getMonth() - 6);

  const records: AttendanceRecord[] = [];

  for (let i = 1; i <= count; i++) {
    const patient = pick(rng, PATIENTS_FIXTURE);
    const conclusion = pick(rng, CONCLUSION_POOL);

    records.push({
      id: `att-${String(i).padStart(4, '0')}`,
      patientId: patient.id,
      patientName: patient.name,
      examType: pick(rng, SEED_EXAM_NAMES),
      doctor: pick(rng, DOCTORS),
      conclusion,
      attendanceDate: randomDateBetween(rng, rangeStart, today),
      restrictionNotes:
        conclusion === APPOINTMENT_CONCLUSION.APTO_COM_RESTRICAO ? pick(rng, RESTRICTION_NOTES) : null,
      notes: null,
      dutyFitness: generateDutyFitness(rng, patient.role, conclusion),
    });
  }

  return records.sort((a, b) => b.attendanceDate.localeCompare(a.attendanceDate));
}

export const ATTENDANCES_FIXTURE: AttendanceRecord[] = generateAttendances(90);

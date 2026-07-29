import { APPOINTMENT_STATUS, type AppointmentStatus } from '@/constants/status';
import { EXAM_TYPES_FIXTURE } from './exams';

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

/** Nomes usados apenas para semear a agenda de demonstração — a lista
 * gerenciável de verdade é `EXAM_TYPES_FIXTURE` (`features/exams`). */
const SEED_EXAM_NAMES = EXAM_TYPES_FIXTURE.map((e) => e.name);

export const DOCTORS = [
  'Dra. Camila Torres — CRM 45213',
  'Dr. Eduardo Nakamura — CRM 38870',
  'Dra. Beatriz Lacerda — CRM 51902',
  'Dr. Rafael Monteiro — CRM 29715',
] as const;

const PATIENT_NAMES = [
  'Maria Silva Santos',
  'João Pedro Almeida',
  'Ana Carolina Souza',
  'Carlos Eduardo Pereira',
  'Patrícia Mendes',
  'Bruno Costa Lima',
  'Fernanda Ribeiro',
  'Lucas Gabriel Farias',
  'Juliana Barbosa',
  'Rodrigo Teixeira',
  'Camila Nogueira',
  'Thiago Andrade',
  'Larissa Cardoso',
  'Diego Fonseca',
  'Vanessa Rocha',
] as const;

const STATUS_POOL: readonly AppointmentStatus[] = [
  APPOINTMENT_STATUS.REALIZADO,
  APPOINTMENT_STATUS.REALIZADO,
  APPOINTMENT_STATUS.REALIZADO,
  APPOINTMENT_STATUS.CANCELADO,
  APPOINTMENT_STATUS.FALTOU,
];

const HOUR_SLOTS = [8, 9, 10, 11, 13, 14, 15, 16] as const;

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

/**
 * Gera uma agenda de demonstração ancorada em "hoje", cobrindo 2 semanas
 * para trás (com status finalizados) e 3 para frente (agendado), pulando
 * fins de semana. Determinística (seed fixo) para não gerar dados
 * diferentes a cada reload/teste.
 */
function generateAppointments(): AppointmentRecord[] {
  const rng = createRng(20260729);
  const records: AppointmentRecord[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let id = 1;
  for (let dayOffset = -14; dayOffset <= 21; dayOffset++) {
    const day = new Date(today);
    day.setDate(day.getDate() + dayOffset);
    const weekday = day.getDay();
    if (weekday === 0 || weekday === 6) continue; // fins de semana sem agenda

    // 2 a 5 consultas por dia útil.
    const count = 2 + Math.floor(rng() * 4);
    const usedHours = new Set<number>();

    for (let i = 0; i < count; i++) {
      let hour = pick(rng, HOUR_SLOTS);
      let attempts = 0;
      while (usedHours.has(hour) && attempts < HOUR_SLOTS.length) {
        hour = pick(rng, HOUR_SLOTS);
        attempts++;
      }
      if (usedHours.has(hour)) continue;
      usedHours.add(hour);

      const minute = pick(rng, [0, 30] as const);
      const startsAt = new Date(day);
      startsAt.setHours(hour, minute, 0, 0);

      const status: AppointmentStatus =
        dayOffset < 0 ? pick(rng, STATUS_POOL) : APPOINTMENT_STATUS.AGENDADO;

      records.push({
        id: `apt-${String(id).padStart(4, '0')}`,
        patientName: pick(rng, PATIENT_NAMES),
        phone: rng() > 0.15 ? `1191234${String(1000 + id).slice(-4)}` : null,
        examType: pick(rng, SEED_EXAM_NAMES),
        doctor: pick(rng, DOCTORS),
        status,
        startsAt: startsAt.toISOString(),
        durationMin: pick(rng, [30, 45, 60] as const),
        notes: null,
      });
      id++;
    }
  }

  return records.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export const AGENDA_FIXTURE: AppointmentRecord[] = generateAppointments();

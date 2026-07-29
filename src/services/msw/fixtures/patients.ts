import { PATIENT_STATUS, type PatientStatus } from '@/constants/status';

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

const ROLES = [
  'Auxiliar Administrativo',
  'Pedreiro',
  'Eletricista',
  'Motorista',
  'Técnico de Segurança',
  'Operador de Máquinas',
  'Soldador',
  'Almoxarife',
  'Encarregado de Obras',
  'Engenheiro Civil',
] as const;

const FIRST_NAMES = [
  'Maria',
  'João',
  'Ana',
  'Carlos',
  'Patrícia',
  'Bruno',
  'Fernanda',
  'Lucas',
  'Juliana',
  'Rodrigo',
  'Camila',
  'Thiago',
  'Larissa',
  'Diego',
  'Vanessa',
  'Marcos',
  'Renata',
  'Felipe',
  'Débora',
  'André',
] as const;

const LAST_NAMES = [
  'Silva',
  'Santos',
  'Almeida',
  'Souza',
  'Pereira',
  'Mendes',
  'Costa Lima',
  'Ribeiro',
  'Farias',
  'Barbosa',
  'Teixeira',
  'Nogueira',
  'Andrade',
  'Cardoso',
  'Fonseca',
  'Rocha',
] as const;

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

function cpfCheckDigit(digits: number[]): number {
  let sum = 0;
  let weight = digits.length + 1;
  for (const d of digits) sum += d * weight--;
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

/** Gera um CPF com dígitos verificadores válidos (algoritmo módulo 11). */
function generateCpf(rng: () => number): string {
  const base = Array.from({ length: 9 }, () => Math.floor(rng() * 10));
  const d1 = cpfCheckDigit(base);
  const d2 = cpfCheckDigit([...base, d1]);
  return [...base, d1, d2].join('');
}

function randomDateBetween(rng: () => number, start: Date, end: Date): string {
  const t = start.getTime() + rng() * (end.getTime() - start.getTime());
  return new Date(t).toISOString().slice(0, 10);
}

const STATUS_POOL: readonly PatientStatus[] = [
  PATIENT_STATUS.ATIVO,
  PATIENT_STATUS.ATIVO,
  PATIENT_STATUS.ATIVO,
  PATIENT_STATUS.ATIVO,
  PATIENT_STATUS.AFASTADO,
  PATIENT_STATUS.INATIVO,
];

function generatePatients(count: number): PatientRecord[] {
  const rng = createRng(20260729);
  const today = new Date();
  const birthRangeStart = new Date(today.getFullYear() - 60, 0, 1);
  const birthRangeEnd = new Date(today.getFullYear() - 18, 11, 31);
  const admissionRangeStart = new Date(today.getFullYear() - 10, 0, 1);

  const usedNames = new Set<string>();
  const records: PatientRecord[] = [];

  for (let i = 1; i <= count; i++) {
    let name = `${pick(rng, FIRST_NAMES)} ${pick(rng, LAST_NAMES)} ${pick(rng, LAST_NAMES)}`;
    while (usedNames.has(name)) {
      name = `${pick(rng, FIRST_NAMES)} ${pick(rng, LAST_NAMES)} ${pick(rng, LAST_NAMES)}`;
    }
    usedNames.add(name);

    const hasEmail = rng() > 0.2;
    const hasPhone = rng() > 0.1;
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '.');

    records.push({
      id: `pat-${String(i).padStart(4, '0')}`,
      name,
      cpf: generateCpf(rng),
      birthDate: randomDateBetween(rng, birthRangeStart, birthRangeEnd),
      phone: hasPhone ? `1191${String(1000000 + i).slice(-7)}` : null,
      email: hasEmail ? `${slug}@falcao.com` : null,
      sector: pick(rng, SECTORS),
      role: pick(rng, ROLES),
      admissionDate: randomDateBetween(rng, admissionRangeStart, today),
      status: pick(rng, STATUS_POOL),
      notes: null,
    });
  }

  return records.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

export const PATIENTS_FIXTURE: PatientRecord[] = generatePatients(48);

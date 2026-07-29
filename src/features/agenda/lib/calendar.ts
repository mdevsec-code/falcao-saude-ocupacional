import type { AppointmentRecord } from '../types';

/** Primeiras/últimas horas exibidas nas grades de semana/dia. */
export const DAY_START_HOUR = 7;
export const DAY_END_HOUR = 19;

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function addDays(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

export function addMonths(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + amount);
  return d;
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Início da semana (domingo) que contém `date`. */
export function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export interface MonthCell {
  date: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
}

/**
 * Grade fixa de 6 semanas (42 dias) começando no domingo da semana que
 * contém o 1º dia do mês — layout de calendário mensal padrão.
 */
export function getMonthGrid(monthAnchor: Date, today: Date = new Date()): MonthCell[] {
  const firstOfMonth = startOfMonth(monthAnchor);
  const gridStart = startOfWeek(firstOfMonth);
  return Array.from({ length: 42 }, (_, i) => {
    const date = addDays(gridStart, i);
    return {
      date,
      inCurrentMonth: date.getMonth() === monthAnchor.getMonth(),
      isToday: isSameDay(date, today),
    };
  });
}

/** Os 7 dias (dom-sáb) da semana que contém `date`. */
export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

const DAY_KEY_FMT = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Agrupa agendamentos por dia (chave `yyyy-MM-dd`, no fuso local). */
export function groupByDay(
  records: readonly AppointmentRecord[],
): Map<string, AppointmentRecord[]> {
  const map = new Map<string, AppointmentRecord[]>();
  for (const record of records) {
    const key = DAY_KEY_FMT(new Date(record.startsAt));
    const bucket = map.get(key);
    if (bucket) bucket.push(record);
    else map.set(key, [record]);
  }
  return map;
}

export function recordsOnDay(
  records: readonly AppointmentRecord[],
  day: Date,
): AppointmentRecord[] {
  return records
    .filter((r) => isSameDay(new Date(r.startsAt), day))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

/** Retorna o intervalo [início, fim) em minutos-desde-meia-noite de um agendamento. */
function toMinuteRange(record: Pick<AppointmentRecord, 'startsAt' | 'durationMin'>): {
  day: string;
  start: number;
  end: number;
} {
  const start = new Date(record.startsAt);
  const minutes = start.getHours() * 60 + start.getMinutes();
  return { day: DAY_KEY_FMT(start), start: minutes, end: minutes + record.durationMin };
}

/**
 * Verifica se `candidate` colide com algum agendamento existente do MESMO
 * médico, no mesmo dia, com sobreposição de horário. `excludeId` evita que
 * um registro colida consigo mesmo ao editar.
 */
export function hasConflict(
  records: readonly AppointmentRecord[],
  candidate: Pick<AppointmentRecord, 'doctor' | 'startsAt' | 'durationMin'>,
  excludeId?: string,
): boolean {
  const candidateRange = toMinuteRange(candidate);
  return records.some((r) => {
    if (excludeId && r.id === excludeId) return false;
    if (r.doctor !== candidate.doctor) return false;
    if (r.status === 'cancelado') return false;
    const range = toMinuteRange(r);
    if (range.day !== candidateRange.day) return false;
    return range.start < candidateRange.end && candidateRange.start < range.end;
  });
}

export const MONTH_LABEL_FMT = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
export const WEEKDAY_SHORT_FMT = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });
export const DAY_LABEL_FMT = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
});

export function formatWeekRangeLabel(days: readonly Date[]): string {
  const first = days[0];
  const last = days[days.length - 1];
  if (!first || !last) return '';
  const fmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' });
  return `${fmt.format(first)} – ${fmt.format(last)}`;
}

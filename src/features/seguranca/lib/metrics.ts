import type { AccidentIndicatorRecord } from '../indicatorTypes';

/** Horas trabalhadas assumidas por empregado no mês (jornada padrão), conforme a planilha de origem. */
const HOURS_PER_EMPLOYEE_MONTH = 220;

export function manHours(record: Pick<AccidentIndicatorRecord, 'employees'>): number {
  return record.employees * HOURS_PER_EMPLOYEE_MONTH;
}

export function totalAccidents(
  record: Pick<AccidentIndicatorRecord, 'accidentsWithLeave' | 'accidentsWithoutLeave'>,
): number {
  return record.accidentsWithLeave + record.accidentsWithoutLeave;
}

export function totalDaysLost(
  record: Pick<AccidentIndicatorRecord, 'daysLostAccidents' | 'daysDebited'>,
): number {
  return record.daysLostAccidents + record.daysDebited;
}

/** Taxa de Frequência — acidentes por milhão de horas-homem trabalhadas (NBR 14280). */
export function frequencyRate(record: AccidentIndicatorRecord): number | null {
  const hours = manHours(record);
  if (hours === 0) return null;
  return (totalAccidents(record) * 1_000_000) / hours;
}

/** Taxa de Gravidade — dias perdidos por milhão de horas-homem trabalhadas (NBR 14280). */
export function severityRate(record: AccidentIndicatorRecord): number | null {
  const hours = manHours(record);
  if (hours === 0) return null;
  return (totalDaysLost(record) * 1_000_000) / hours;
}

/** Índice Relativo de Acidentes — acidentes a cada 100 empregados. */
export function relativeAccidentIndex(record: AccidentIndicatorRecord): number | null {
  if (record.employees === 0) return null;
  return (totalAccidents(record) / record.employees) * 100;
}

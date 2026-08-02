import { describe, expect, it } from 'vitest';
import {
  getMonthGrid,
  getWeekDays,
  groupByDay,
  hasConflict,
  isSameDay,
  recordsOnDay,
  startOfWeek,
} from '../calendar';
import type { AppointmentRecord } from '../../types';

function makeRecord(overrides: Partial<AppointmentRecord>): AppointmentRecord {
  return {
    id: 'apt-0001',
    patientName: 'Fulano de Tal',
    phone: null,
    examType: 'ASO Periódico',
    doctor: 'Dra. Camila Torres — CRM 45213',
    status: 'agendado',
    startsAt: '2026-07-29T09:00:00',
    durationMin: 30,
    notes: null,
    ...overrides,
  };
}

describe('isSameDay', () => {
  it('compara apenas ano/mês/dia, ignorando hora', () => {
    expect(isSameDay(new Date('2026-07-29T08:00:00'), new Date('2026-07-29T23:00:00'))).toBe(true);
    expect(isSameDay(new Date('2026-07-29T08:00:00'), new Date('2026-07-30T08:00:00'))).toBe(false);
  });
});

describe('getMonthGrid', () => {
  it('gera 42 células (6 semanas) começando no domingo', () => {
    const grid = getMonthGrid(new Date('2026-07-15T00:00:00'));
    expect(grid).toHaveLength(42);
    expect(grid[0]?.date.getDay()).toBe(0);
  });

  it('marca corretamente dias dentro/fora do mês âncora', () => {
    const grid = getMonthGrid(new Date('2026-07-15T00:00:00'));
    const julyDays = grid.filter((c) => c.inCurrentMonth);
    expect(julyDays).toHaveLength(31);
  });

  it('marca isToday quando a data bate com o "hoje" informado', () => {
    const today = new Date('2026-07-10T12:00:00');
    const grid = getMonthGrid(new Date('2026-07-15T00:00:00'), today);
    const todayCell = grid.find((c) => c.isToday);
    expect(todayCell?.date.getDate()).toBe(10);
  });
});

describe('getWeekDays', () => {
  it('retorna 7 dias começando no domingo da semana', () => {
    const days = getWeekDays(new Date('2026-07-29T00:00:00')); // quarta-feira
    expect(days).toHaveLength(7);
    expect(days[0]?.getDay()).toBe(0);
    expect(days[6]?.getDay()).toBe(6);
  });
});

describe('startOfWeek', () => {
  it('retorna o domingo da semana contendo a data', () => {
    const start = startOfWeek(new Date('2026-07-29T15:30:00')); // quarta
    expect(start.getDay()).toBe(0);
    expect(start.getDate()).toBe(26);
    expect(start.getHours()).toBe(0);
  });
});

describe('groupByDay / recordsOnDay', () => {
  it('agrupa registros pela chave yyyy-MM-dd local', () => {
    const records = [
      makeRecord({ id: 'a', startsAt: '2026-07-29T09:00:00' }),
      makeRecord({ id: 'b', startsAt: '2026-07-29T14:00:00' }),
      makeRecord({ id: 'c', startsAt: '2026-07-30T09:00:00' }),
    ];
    const grouped = groupByDay(records);
    expect(grouped.get('2026-07-29')).toHaveLength(2);
    expect(grouped.get('2026-07-30')).toHaveLength(1);
  });

  it('recordsOnDay filtra e ordena por horário', () => {
    const records = [
      makeRecord({ id: 'a', startsAt: '2026-07-29T14:00:00' }),
      makeRecord({ id: 'b', startsAt: '2026-07-29T09:00:00' }),
      makeRecord({ id: 'c', startsAt: '2026-07-30T09:00:00' }),
    ];
    const result = recordsOnDay(records, new Date('2026-07-29T00:00:00'));
    expect(result.map((r) => r.id)).toEqual(['b', 'a']);
  });
});

describe('hasConflict', () => {
  const existing = [
    makeRecord({ id: 'a', doctor: 'Dr. X', startsAt: '2026-07-29T09:00:00', durationMin: 60 }),
  ];

  it('detecta sobreposição de horário com o mesmo médico', () => {
    const candidate = { doctor: 'Dr. X', startsAt: '2026-07-29T09:30:00', durationMin: 30 };
    expect(hasConflict(existing, candidate)).toBe(true);
  });

  it('não considera conflito quando os horários não se sobrepõem', () => {
    const candidate = { doctor: 'Dr. X', startsAt: '2026-07-29T10:00:00', durationMin: 30 };
    expect(hasConflict(existing, candidate)).toBe(false);
  });

  it('não considera conflito com médico diferente', () => {
    const candidate = { doctor: 'Dr. Y', startsAt: '2026-07-29T09:00:00', durationMin: 60 };
    expect(hasConflict(existing, candidate)).toBe(false);
  });

  it('ignora o próprio registro ao editar (excludeId)', () => {
    const candidate = { doctor: 'Dr. X', startsAt: '2026-07-29T09:00:00', durationMin: 60 };
    expect(hasConflict(existing, candidate, 'a')).toBe(false);
  });

  it('ignora agendamentos cancelados', () => {
    const cancelled = [
      makeRecord({
        id: 'a',
        doctor: 'Dr. X',
        startsAt: '2026-07-29T09:00:00',
        durationMin: 60,
        status: 'cancelado',
      }),
    ];
    const candidate = { doctor: 'Dr. X', startsAt: '2026-07-29T09:30:00', durationMin: 30 };
    expect(hasConflict(cancelled, candidate)).toBe(false);
  });
});

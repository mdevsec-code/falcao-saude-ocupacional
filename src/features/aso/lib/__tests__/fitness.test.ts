import { describe, expect, it } from 'vitest';
import { getLatestFitnessByDuty, hasAnyUnfitDuty } from '../fitness';
import type { AttendanceRecord } from '@/features/attendances/types';

function makeRecord(overrides: Partial<AttendanceRecord>): AttendanceRecord {
  return {
    id: 'att-0001',
    patientId: 'pat-0001',
    patientName: 'Fulano de Tal',
    examType: 'ASO Periódico',
    doctor: 'Dra. Camila Torres — CRM 45213',
    conclusion: 'apto',
    attendanceDate: '2026-01-01',
    restrictionNotes: null,
    notes: null,
    dutyFitness: [],
    ...overrides,
  };
}

describe('getLatestFitnessByDuty', () => {
  it('usa o exame mais recente que avaliou cada atividade especificamente', () => {
    const records = [
      makeRecord({
        id: 'a',
        attendanceDate: '2026-01-01',
        dutyFitness: [{ duty: 'altura', fit: false }],
      }),
      makeRecord({
        id: 'b',
        attendanceDate: '2026-06-01',
        dutyFitness: [{ duty: 'altura', fit: true }],
      }),
      makeRecord({
        id: 'c',
        attendanceDate: '2026-03-01',
        dutyFitness: [{ duty: 'eletricidade', fit: false }],
      }),
    ];

    const fitness = getLatestFitnessByDuty(records, 'pat-0001');

    expect(fitness.altura).toBe(true); // exame de junho é mais recente que o de janeiro
    expect(fitness.eletricidade).toBe(false);
    expect(fitness.ruido).toBeUndefined(); // nunca avaliado
  });

  it('ignora atendimentos de outros pacientes', () => {
    const records = [
      makeRecord({ id: 'a', patientId: 'pat-9999', dutyFitness: [{ duty: 'altura', fit: true }] }),
    ];
    expect(getLatestFitnessByDuty(records, 'pat-0001')).toEqual({});
  });
});

describe('hasAnyUnfitDuty', () => {
  it('retorna true quando alguma atividade está inapta', () => {
    expect(hasAnyUnfitDuty({ altura: true, eletricidade: false })).toBe(true);
  });

  it('retorna false quando todas as atividades avaliadas estão aptas', () => {
    expect(hasAnyUnfitDuty({ altura: true, eletricidade: true })).toBe(false);
  });

  it('retorna false quando nenhuma atividade foi avaliada', () => {
    expect(hasAnyUnfitDuty({})).toBe(false);
  });
});

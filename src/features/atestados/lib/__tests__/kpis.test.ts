import { describe, expect, it } from 'vitest';
import { computeAtestadoKpis, sortCompetenciasChronologically, topN } from '../kpis';
import type { AtestadoRecord } from '../../types';

function makeRecord(overrides: Partial<AtestadoRecord>): AtestadoRecord {
  return {
    id: 1,
    ponto: 'OK',
    nome: 'FULANO DE TAL',
    funcao: 'CARPINTEIRO',
    setor: 'CIVIL',
    qntDias: 1,
    cid: 'A09',
    inicioAtestado: '2026-05-01',
    terminoAtestado: '2026-05-01',
    dataLancamento: '2026-05-02',
    competencia: 'MAIO',
    liderancaDireta: 'LIDER A',
    observacao: null,
    medico: 'DR. FULANO',
    crmCro: '12345',
    localAtendimento: 'SEMED',
    slaLancamentoDias: 1,
    ...overrides,
  };
}

describe('computeAtestadoKpis', () => {
  it('calcula totais, dias e colaboradores únicos', () => {
    const records = [
      makeRecord({ id: 1, nome: 'A', qntDias: 2, competencia: 'MAIO' }),
      makeRecord({ id: 2, nome: 'A', qntDias: 3, competencia: 'MAIO' }),
      makeRecord({ id: 3, nome: 'B', qntDias: 1, competencia: 'JUNHO' }),
    ];

    const kpis = computeAtestadoKpis(records);

    expect(kpis.total).toBe(3);
    expect(kpis.totalDias).toBe(6);
    expect(kpis.mediaDias).toBeCloseTo(2);
    expect(kpis.colaboradoresUnicos).toBe(2);
    expect(kpis.taxaRecorrencia).toBeCloseTo(50); // "A" tem 2 atestados de 2 colaboradores
  });

  it('identifica o setor mais afetado', () => {
    const records = [
      makeRecord({ id: 1, setor: 'CIVIL' }),
      makeRecord({ id: 2, setor: 'CIVIL' }),
      makeRecord({ id: 3, setor: 'INSTALAÇÕES' }),
    ];

    const kpis = computeAtestadoKpis(records);

    expect(kpis.setorTopEntry).toEqual(['CIVIL', 2]);
  });

  it('calcula variação entre as duas últimas competências', () => {
    const records = [
      makeRecord({ id: 1, competencia: 'MAIO' }),
      makeRecord({ id: 2, competencia: 'MAIO' }),
      makeRecord({ id: 3, competencia: 'JUNHO' }),
    ];

    const kpis = computeAtestadoKpis(records);

    expect(kpis.compareLabel).toBe('JUNHO vs MAIO');
    expect(kpis.variation).toBeCloseTo(-50); // 1 em junho vs 2 em maio
  });

  it('retorna null de variação quando há apenas uma competência', () => {
    const kpis = computeAtestadoKpis([makeRecord({ competencia: 'MAIO' })]);
    expect(kpis.variation).toBeNull();
  });
});

describe('sortCompetenciasChronologically', () => {
  it('ordena competências pela ordem dos meses do ano', () => {
    const records = [
      makeRecord({ id: 1, competencia: 'JULHO' }),
      makeRecord({ id: 2, competencia: 'MAIO' }),
      makeRecord({ id: 3, competencia: 'JUNHO' }),
    ];

    const groups = sortCompetenciasChronologically(records);

    expect(groups.map((g) => g.key)).toEqual(['MAIO', 'JUNHO', 'JULHO']);
  });
});

describe('topN', () => {
  it('retorna os N valores mais frequentes em ordem decrescente', () => {
    const records = [
      makeRecord({ id: 1, setor: 'CIVIL' }),
      makeRecord({ id: 2, setor: 'CIVIL' }),
      makeRecord({ id: 3, setor: 'INSTALAÇÕES' }),
      makeRecord({ id: 4, setor: 'LIMPEZA' }),
    ];

    expect(topN(records, 'setor', 2)).toEqual([
      ['CIVIL', 2],
      ['INSTALAÇÕES', 1],
    ]);
  });
});

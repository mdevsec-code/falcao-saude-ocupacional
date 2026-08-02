import type { AtestadoKpis, AtestadoRecord, CompetenciaGroup } from '../types';

const MONTH_ORDER_HINT = [
  'JANEIRO',
  'FEVEREIRO',
  'MARÇO',
  'ABRIL',
  'MAIO',
  'JUNHO',
  'JULHO',
  'AGOSTO',
  'SETEMBRO',
  'OUTUBRO',
  'NOVEMBRO',
  'DEZEMBRO',
];

export function sortCompetenciasChronologically(
  records: readonly AtestadoRecord[],
): CompetenciaGroup[] {
  const groups: Record<string, AtestadoRecord[]> = {};
  records.forEach((r) => {
    if (!r.competencia) return;
    (groups[r.competencia] ??= []).push(r);
  });
  return Object.keys(groups)
    .sort((a, b) => {
      const ia = MONTH_ORDER_HINT.indexOf(a);
      const ib = MONTH_ORDER_HINT.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      const da =
        groups[a]!.map((r) => r.inicioAtestado)
          .filter(Boolean)
          .sort()[0] ?? '';
      const db =
        groups[b]!.map((r) => r.inicioAtestado)
          .filter(Boolean)
          .sort()[0] ?? '';
      return da.localeCompare(db);
    })
    .map((key) => ({ key, records: groups[key]! }));
}

export function computeAtestadoKpis(records: readonly AtestadoRecord[]): AtestadoKpis {
  const total = records.length;
  const totalDias = records.reduce((s, r) => s + (r.qntDias ?? 0), 0);
  const mediaDias = total ? totalDias / total : 0;
  const colaboradoresUnicos = new Set(records.map((r) => r.nome).filter(Boolean)).size;

  const bySetor: Record<string, number> = {};
  records.forEach((r) => {
    if (r.setor) bySetor[r.setor] = (bySetor[r.setor] ?? 0) + 1;
  });
  const setorTopEntry = (Object.entries(bySetor).sort((a, b) => b[1] - a[1])[0] ?? null) as
    [string, number] | null;

  // Um único dígito de ano trocado na origem (ex.: 2026 -> 2028 ou 2006) ainda
  // passa como data "válida", mas gera um SLA de centenas/milhares de dias que
  // distorceria a média. Tratamos esses outliers implausíveis como ruído.
  const slaValues = records
    .map((r) => r.slaLancamentoDias)
    .filter((v): v is number => v !== null && v !== undefined && v >= 0 && v <= 180);
  const mediaSla = slaValues.length
    ? slaValues.reduce((s, v) => s + v, 0) / slaValues.length
    : null;

  const porColaborador: Record<string, number> = {};
  records.forEach((r) => {
    if (r.nome) porColaborador[r.nome] = (porColaborador[r.nome] ?? 0) + 1;
  });
  const recorrentes = Object.values(porColaborador).filter((c) => c > 1).length;
  const taxaRecorrencia = colaboradoresUnicos ? (recorrentes / colaboradoresUnicos) * 100 : 0;

  const chron = sortCompetenciasChronologically(records);
  let variation: number | null = null;
  let compareLabel = 'Sem período anterior para comparar';
  if (chron.length >= 2) {
    const atual = chron[chron.length - 1]!;
    const anterior = chron[chron.length - 2]!;
    const atualCount = atual.records.length;
    const anteriorCount = anterior.records.length;
    variation = anteriorCount ? ((atualCount - anteriorCount) / anteriorCount) * 100 : null;
    compareLabel = `${atual.key} vs ${anterior.key}`;
  }

  return {
    total,
    totalDias,
    mediaDias,
    colaboradoresUnicos,
    setorTopEntry,
    mediaSla,
    taxaRecorrencia,
    variation,
    compareLabel,
  };
}

export function topN(
  records: readonly AtestadoRecord[],
  key: keyof AtestadoRecord,
  n = 8,
): [string, number][] {
  const counts: Record<string, number> = {};
  records.forEach((r) => {
    const v = r[key];
    if (v) counts[String(v)] = (counts[String(v)] ?? 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

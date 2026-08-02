import type { AtestadoFilters, AtestadoRecord } from '../types';

export const PRIMARY_FILTER_FIELDS = [
  { key: 'competencia', label: 'Competência' },
  { key: 'setor', label: 'Setor' },
  { key: 'funcao', label: 'Função' },
  { key: 'liderancaDireta', label: 'Liderança Direta' },
  { key: 'localAtendimento', label: 'Local de Atendimento' },
] as const satisfies readonly { key: keyof AtestadoFilters; label: string }[];

export function uniqueSorted(
  records: readonly AtestadoRecord[],
  key: keyof AtestadoRecord,
): string[] {
  const set = new Set<string>();
  records.forEach((r) => {
    const value = r[key];
    if (value) set.add(String(value));
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export function dateRange(
  records: readonly AtestadoRecord[],
  key: keyof AtestadoRecord,
): [string | null, string | null] {
  const dates = records
    .map((r) => r[key])
    .filter((v): v is string => typeof v === 'string' && v.length > 0)
    .sort();
  if (dates.length === 0) return [null, null];
  return [dates[0]!, dates[dates.length - 1]!];
}

export function applyAtestadoFilters(
  records: readonly AtestadoRecord[],
  filters: AtestadoFilters,
): AtestadoRecord[] {
  return records.filter((rec) => {
    for (const f of PRIMARY_FILTER_FIELDS) {
      const val = filters[f.key];
      if (val && rec[f.key] !== val) return false;
    }
    if (filters.dataInicio && rec.inicioAtestado && rec.inicioAtestado < filters.dataInicio)
      return false;
    if (filters.dataFim && rec.inicioAtestado && rec.inicioAtestado > filters.dataFim) return false;

    if (filters.busca) {
      const q = filters.busca.toLowerCase();
      const haystack = [rec.nome, rec.funcao, rec.setor, rec.cid, rec.medico, rec.liderancaDireta]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

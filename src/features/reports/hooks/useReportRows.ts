import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { REPORT_FIXTURES } from '../fixtures';
import type { ReportFilters, ReportKind, ReportRecord } from '../types';

const ALL_KINDS: ReportKind[] = [
  'agendamentos',
  'atendimentos',
  'aso',
  'aso_a_ptos',
  'aso_periodicos',
];

/**
 * Hook que devolve os registros de relatório aplicando filtros simples.
 * No futuro, será substituído por uma `useQuery` apontando para a API.
 */
export function useReportRows(filters: ReportFilters): readonly ReportRecord[] {
  return useMemo(() => {
    return REPORT_FIXTURES.filter((r) => {
      if (filters.company && r.company !== filters.company) return false;
      if (filters.from && r.date < filters.from) return false;
      if (filters.to && r.date > filters.to) return false;
      return matchesKind(r);
    });
  }, [filters]);
}

export function useReportKinds() {
  const { t } = useTranslation('reports');
  return useMemo(
    () => ALL_KINDS.map((kind) => ({ value: kind, label: t(`reports:kinds.${kind}`) })),
    [t],
  );
}

export function reportKindLabel(t: (key: string) => string, kind: ReportKind): string {
  return t(`reports:kinds.${kind}`);
}

export function reportDateLabel(t: (key: string) => string, kind: ReportKind): string {
  return t(`reports:kindDates.${kind}`);
}

function matchesKind(_record: ReportRecord): boolean {
  // O dataset é único; cada relatório usa o mesmo pool com semântica diferente
  // (a futura API já retornará o conjunto correto). Mantemos o filtro aberto.
  return true;
}

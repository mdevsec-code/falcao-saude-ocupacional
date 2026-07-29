import { useMemo } from 'react';

import { REPORT_FIXTURES } from '../fixtures';
import type { ReportFilters, ReportKind, ReportRecord } from '../types';

const KIND_LABELS: Record<ReportKind, string> = {
  agendamentos: 'Agendamentos',
  atendimentos: 'Atendimentos',
  aso: 'ASO Geral',
  aso_a_ptos: 'ASO Admissional',
  aso_periodicos: 'ASO Periódicos',
};

const DATE_LABELS: Record<ReportKind, string> = {
  agendamentos: 'Período de agendamento',
  atendimentos: 'Período de atendimento',
  aso: 'Período de emissão do ASO',
  aso_a_ptos: 'Período de admissão',
  aso_periodicos: 'Período do exame periódico',
};

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
  return useMemo(
    () =>
      (Object.keys(KIND_LABELS) as ReportKind[]).map((kind) => ({
        value: kind,
        label: KIND_LABELS[kind]!,
      })),
    [],
  );
}

export function reportKindLabel(kind: ReportKind): string {
  return KIND_LABELS[kind]!;
}

export function reportDateLabel(kind: ReportKind): string {
  return DATE_LABELS[kind]!;
}

function matchesKind(_record: ReportRecord): boolean {
  // O dataset é único; cada relatório usa o mesmo pool com semântica diferente
  // (a futura API já retornará o conjunto correto). Mantemos o filtro aberto.
  return true;
}

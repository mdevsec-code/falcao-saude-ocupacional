import { useMemo } from 'react';
import { computeAtestadoKpis, sortCompetenciasChronologically } from '../lib/kpis';
import type { AtestadoKpis, AtestadoRecord, CompetenciaGroup } from '../types';

export function useAtestadoKpis(records: readonly AtestadoRecord[]): AtestadoKpis {
  return useMemo(() => computeAtestadoKpis(records), [records]);
}

export function useCompetenciaGroups(records: readonly AtestadoRecord[]): CompetenciaGroup[] {
  return useMemo(() => sortCompetenciasChronologically(records), [records]);
}

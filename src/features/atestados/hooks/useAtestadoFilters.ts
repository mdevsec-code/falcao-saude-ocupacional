import { useMemo } from 'react';
import {
  applyAtestadoFilters,
  dateRange,
  PRIMARY_FILTER_FIELDS,
  uniqueSorted,
} from '../lib/filters';
import type { AtestadoFilters, AtestadoRecord } from '../types';

export interface FilterDefinition {
  key: (typeof PRIMARY_FILTER_FIELDS)[number]['key'];
  label: string;
  options: string[];
}

export function useFilteredAtestados(
  records: readonly AtestadoRecord[],
  filters: AtestadoFilters,
): AtestadoRecord[] {
  return useMemo(() => applyAtestadoFilters(records, filters), [records, filters]);
}

export function useFilterDefinitions(records: readonly AtestadoRecord[]): FilterDefinition[] {
  return useMemo(
    () =>
      PRIMARY_FILTER_FIELDS.map((f) => ({ ...f, options: uniqueSorted(records, f.key) })).filter(
        (f) => f.options.length > 0,
      ),
    [records],
  );
}

export function useAtestadoDateRange(
  records: readonly AtestadoRecord[],
): [string | null, string | null] {
  return useMemo(() => dateRange(records, 'inicioAtestado'), [records]);
}

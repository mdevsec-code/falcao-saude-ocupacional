import { useMemo } from 'react';
import type { DeviationFilters, DeviationRecord } from '../types';

export function useFilteredDesvios(
  records: readonly DeviationRecord[],
  filters: DeviationFilters,
): DeviationRecord[] {
  return useMemo(() => {
    const q = filters.busca?.trim().toLowerCase();
    return records.filter((r) => {
      if (filters.location && r.location !== filters.location) return false;
      if (filters.classification && r.classification !== filters.classification) return false;
      if (filters.status && r.status !== filters.status) return false;
      if (q) {
        const haystack =
          `${r.description} ${r.foreman ?? ''} ${r.responsibleTechnician ?? ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [records, filters]);
}

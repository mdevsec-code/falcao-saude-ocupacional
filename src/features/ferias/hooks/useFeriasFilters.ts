import { useMemo } from 'react';
import type { VacationFilters, VacationRecord } from '../types';

export function useFilteredFerias(
  records: readonly VacationRecord[],
  filters: VacationFilters,
): VacationRecord[] {
  return useMemo(() => {
    const q = filters.busca?.trim().toLowerCase();
    return records.filter((r) => {
      if (filters.sector && r.sector !== filters.sector) return false;
      if (filters.status && r.status !== filters.status) return false;
      if (q) {
        const haystack = `${r.patientName} ${r.role}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [records, filters]);
}

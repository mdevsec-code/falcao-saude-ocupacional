import { useMemo } from 'react';
import type { PatientFilters, PatientRecord } from '../types';

export function useFilteredPatients(
  records: readonly PatientRecord[],
  filters: PatientFilters,
): PatientRecord[] {
  return useMemo(() => {
    const q = filters.busca?.trim().toLowerCase();
    return records.filter((r) => {
      if (filters.sector && r.sector !== filters.sector) return false;
      if (filters.status && r.status !== filters.status) return false;
      if (q) {
        const haystack = `${r.name} ${r.cpf} ${r.role}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [records, filters]);
}

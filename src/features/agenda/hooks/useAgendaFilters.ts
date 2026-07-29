import { useMemo } from 'react';
import type { AgendaFilters, AppointmentRecord } from '../types';

export function useFilteredAppointments(
  records: readonly AppointmentRecord[],
  filters: AgendaFilters,
): AppointmentRecord[] {
  return useMemo(() => {
    return records.filter((r) => {
      if (filters.doctor && r.doctor !== filters.doctor) return false;
      if (filters.examType && r.examType !== filters.examType) return false;
      if (filters.status && r.status !== filters.status) return false;
      return true;
    });
  }, [records, filters]);
}

import { useMemo } from 'react';
import type { AttendanceFilters, AttendanceRecord } from '../types';

export function useFilteredAttendances(
  records: readonly AttendanceRecord[],
  filters: AttendanceFilters,
): AttendanceRecord[] {
  return useMemo(() => {
    return records.filter((r) => {
      if (filters.patientId && r.patientId !== filters.patientId) return false;
      if (filters.doctor && r.doctor !== filters.doctor) return false;
      if (filters.examType && r.examType !== filters.examType) return false;
      if (filters.conclusion && r.conclusion !== filters.conclusion) return false;
      if (filters.dataInicio && r.attendanceDate < filters.dataInicio) return false;
      if (filters.dataFim && r.attendanceDate > filters.dataFim) return false;
      return true;
    });
  }, [records, filters]);
}

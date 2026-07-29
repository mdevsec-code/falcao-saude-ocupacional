import { useQuery } from '@tanstack/react-query';
import { attendancesApi } from '../services/attendances.api';
import type { AttendanceRecord } from '../types';

export const attendancesKeys = {
  all: ['attendances'] as const,
  list: () => [...attendancesKeys.all, 'list'] as const,
};

export function useAttendances() {
  return useQuery<AttendanceRecord[], Error>({
    queryKey: attendancesKeys.list(),
    queryFn: attendancesApi.getAll,
    staleTime: 1000 * 30,
  });
}

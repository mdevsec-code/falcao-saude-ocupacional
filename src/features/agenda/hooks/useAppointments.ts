import { useQuery } from '@tanstack/react-query';
import { agendaApi } from '../services/agenda.api';
import type { AppointmentRecord } from '../types';

export const agendaKeys = {
  all: ['agenda'] as const,
  list: () => [...agendaKeys.all, 'list'] as const,
};

export function useAppointments() {
  return useQuery<AppointmentRecord[], Error>({
    queryKey: agendaKeys.list(),
    queryFn: agendaApi.getAll,
    staleTime: 1000 * 30,
  });
}

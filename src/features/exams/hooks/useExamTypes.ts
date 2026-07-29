import { useQuery } from '@tanstack/react-query';
import { examsApi } from '../services/exams.api';
import type { ExamTypeRecord } from '../types';

export const examsKeys = {
  all: ['exams'] as const,
  list: () => [...examsKeys.all, 'list'] as const,
};

export function useExamTypes() {
  return useQuery<ExamTypeRecord[], Error>({
    queryKey: examsKeys.list(),
    queryFn: examsApi.getAll,
    staleTime: 1000 * 60 * 10,
  });
}

/** Nomes dos tipos de exame ativos — usado para popular Selects em Agenda/Atendimentos. */
export function useActiveExamNames(): string[] {
  const { data } = useExamTypes();
  return (data ?? []).filter((e) => e.active).map((e) => e.name);
}

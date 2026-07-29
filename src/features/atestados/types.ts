import type { AtestadoRecord } from '@/services/msw/fixtures/atestados';

export type { AtestadoRecord };

export interface AtestadoFilters {
  competencia?: string;
  setor?: string;
  funcao?: string;
  liderancaDireta?: string;
  localAtendimento?: string;
  dataInicio?: string;
  dataFim?: string;
  busca?: string;
}

export interface CompetenciaGroup {
  key: string;
  records: AtestadoRecord[];
}

export interface AtestadoKpis {
  total: number;
  totalDias: number;
  mediaDias: number;
  colaboradoresUnicos: number;
  setorTopEntry: [string, number] | null;
  mediaSla: number | null;
  taxaRecorrencia: number;
  variation: number | null;
  compareLabel: string;
}

import raw from './atestados.json';

export interface AtestadoRecord {
  id: number;
  ponto: string | null;
  nome: string;
  funcao: string | null;
  setor: string | null;
  qntDias: number | null;
  cid: string | null;
  inicioAtestado: string | null;
  terminoAtestado: string | null;
  dataLancamento: string | null;
  competencia: string | null;
  liderancaDireta: string | null;
  observacao: string | null;
  medico: string | null;
  crmCro: string | null;
  localAtendimento: string | null;
  slaLancamentoDias: number | null;
}

export interface AtestadosMeta {
  geradoEm: string;
  totalRegistros: number;
  fonteArquivo: string;
  colunas: string[];
}

export const ATESTADOS_META: AtestadosMeta = raw.meta;
export const ATESTADOS_FIXTURE: AtestadoRecord[] = raw.registros;

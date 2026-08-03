import { z } from 'zod';

import i18n from '@/i18n';
import { nonEmptyString } from '@/validators/common';
import type { AtestadoRecord } from '@/services/msw/fixtures/atestados';
import { competenciaFromDate } from './lib/kpis';

export type { AtestadoRecord };
export { SECTORS } from '@/services/msw/fixtures/patients';

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

const optionalText = (max: number) =>
  z
    .string()
    .max(max, i18n.t('validation:maxLength', { count: max }))
    .optional();

export const atestadoFormSchema = z
  .object({
    nome: nonEmptyString.min(3, i18n.t('validation:nameRequired')),
    ponto: optionalText(20),
    setor: nonEmptyString,
    funcao: optionalText(80),
    cid: optionalText(20),
    inicioAtestado: nonEmptyString,
    terminoAtestado: nonEmptyString,
    dataLancamento: nonEmptyString,
    liderancaDireta: optionalText(120),
    medico: optionalText(120),
    crmCro: optionalText(30),
    localAtendimento: optionalText(120),
    observacao: optionalText(500),
  })
  .refine((data) => data.terminoAtestado >= data.inicioAtestado, {
    message: i18n.t('atestados:validation.dateRangeInvalid'),
    path: ['terminoAtestado'],
  });

export type AtestadoFormInput = z.infer<typeof atestadoFormSchema>;

function daysBetweenInclusive(startDate: string, endDate: string): number {
  const diff = Math.round(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24),
  );
  return diff + 1;
}

function daysDiff(fromDate: string, toDate: string): number {
  return Math.round(
    (new Date(toDate).getTime() - new Date(fromDate).getTime()) / (1000 * 60 * 60 * 24),
  );
}

export function toFormInput(record: AtestadoRecord): AtestadoFormInput {
  return {
    nome: record.nome,
    ponto: record.ponto ?? undefined,
    setor: record.setor ?? '',
    funcao: record.funcao ?? undefined,
    cid: record.cid ?? undefined,
    inicioAtestado: record.inicioAtestado ?? '',
    terminoAtestado: record.terminoAtestado ?? '',
    dataLancamento: record.dataLancamento ?? '',
    liderancaDireta: record.liderancaDireta ?? undefined,
    medico: record.medico ?? undefined,
    crmCro: record.crmCro ?? undefined,
    localAtendimento: record.localAtendimento ?? undefined,
    observacao: record.observacao ?? undefined,
  };
}

export function fromFormInput(input: AtestadoFormInput): Omit<AtestadoRecord, 'id'> {
  return {
    ponto: input.ponto?.trim() || null,
    nome: input.nome,
    funcao: input.funcao?.trim() || null,
    setor: input.setor,
    qntDias: daysBetweenInclusive(input.inicioAtestado, input.terminoAtestado),
    cid: input.cid?.trim() || null,
    inicioAtestado: input.inicioAtestado,
    terminoAtestado: input.terminoAtestado,
    dataLancamento: input.dataLancamento,
    competencia: competenciaFromDate(input.inicioAtestado),
    liderancaDireta: input.liderancaDireta?.trim() || null,
    observacao: input.observacao?.trim() || null,
    medico: input.medico?.trim() || null,
    crmCro: input.crmCro?.trim() || null,
    localAtendimento: input.localAtendimento?.trim() || null,
    slaLancamentoDias: Math.max(0, daysDiff(input.inicioAtestado, input.dataLancamento)),
  };
}

import { z } from 'zod';

import i18n from '@/i18n';
import { nonEmptyString } from '@/validators/common';
import { DEVIATION_CLASSIFICATION, DEVIATION_STATUS } from '@/constants/status';
import type { DeviationClassification, DeviationStatus } from '@/constants/status';
import type { DeviationRecord } from '@/services/msw/fixtures/desvios';

export type { DeviationRecord, DeviationClassification, DeviationStatus };
export { DEVIATION_LOCATIONS } from '@/services/msw/fixtures/desvios';

export interface DeviationFilters {
  location?: string;
  classification?: DeviationClassification;
  status?: DeviationStatus;
  busca?: string;
}

export const deviationFormSchema = z.object({
  date: nonEmptyString,
  location: nonEmptyString,
  classification: z.enum([
    DEVIATION_CLASSIFICATION.ACESSIBILIDADE,
    DEVIATION_CLASSIFICATION.ORGANIZACAO,
    DEVIATION_CLASSIFICATION.COMPORTAMENTAL,
    DEVIATION_CLASSIFICATION.EQUIPAMENTO,
    DEVIATION_CLASSIFICATION.EPI,
    DEVIATION_CLASSIFICATION.ERGONOMIA,
    DEVIATION_CLASSIFICATION.PROCEDIMENTO,
    DEVIATION_CLASSIFICATION.RESIDUOS,
    DEVIATION_CLASSIFICATION.SINALIZACAO,
    DEVIATION_CLASSIFICATION.ELETRICIDADE,
  ]),
  description: nonEmptyString.min(5, i18n.t('seguranca:validation.descriptionRequired')),
  foreman: z.string().optional(),
  responsibleTechnician: z.string().optional(),
  action: z.string().optional(),
  status: z.enum([
    DEVIATION_STATUS.PENDENTE,
    DEVIATION_STATUS.EM_ANDAMENTO,
    DEVIATION_STATUS.CONCLUIDO,
  ]),
});

export type DeviationFormInput = z.infer<typeof deviationFormSchema>;

export function toFormInput(record: DeviationRecord): DeviationFormInput {
  return {
    date: record.date,
    location: record.location,
    classification: record.classification,
    description: record.description,
    foreman: record.foreman ?? undefined,
    responsibleTechnician: record.responsibleTechnician ?? undefined,
    action: record.action ?? undefined,
    status: record.status,
  };
}

export function fromFormInput(input: DeviationFormInput): Omit<DeviationRecord, 'id'> {
  return {
    date: input.date,
    location: input.location,
    classification: input.classification,
    description: input.description,
    foreman: input.foreman ?? null,
    responsibleTechnician: input.responsibleTechnician ?? null,
    action: input.action ?? null,
    status: input.status,
  };
}

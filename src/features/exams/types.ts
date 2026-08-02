import { z } from 'zod';

import i18n from '@/i18n';
import { nonEmptyString } from '@/validators/common';
import type { ExamCategory, ExamTypeRecord } from '@/services/msw/fixtures/exams';

export type { ExamTypeRecord, ExamCategory };

export const EXAM_CATEGORIES: ExamCategory[] = [
  'Admissional',
  'Periódico',
  'Demissional',
  'Mudança de Função',
  'Retorno ao Trabalho',
  'Complementar',
];

export interface ExamTypeFilters {
  category?: ExamCategory;
  onlyActive?: boolean;
  busca?: string;
}

export const examTypeFormSchema = z.object({
  name: nonEmptyString.min(3, i18n.t('exams:validation.nameRequired')),
  category: z.enum([
    'Admissional',
    'Periódico',
    'Demissional',
    'Mudança de Função',
    'Retorno ao Trabalho',
    'Complementar',
  ]),
  defaultDurationMin: z.coerce
    .number()
    .int()
    .min(5, i18n.t('validation:minDuration', { count: 5 }))
    .max(240, i18n.t('validation:maxDuration', { count: 240 })),
  periodicityMonths: z.coerce.number().int().min(1).max(60).optional(),
  active: z.boolean(),
  description: z
    .string()
    .max(500, i18n.t('validation:maxLength', { count: 500 }))
    .optional(),
});

export type ExamTypeFormInput = z.infer<typeof examTypeFormSchema>;

export function toFormInput(record: ExamTypeRecord): ExamTypeFormInput {
  return {
    name: record.name,
    category: record.category,
    defaultDurationMin: record.defaultDurationMin,
    periodicityMonths: record.periodicityMonths ?? undefined,
    active: record.active,
    description: record.description ?? undefined,
  };
}

export function fromFormInput(input: ExamTypeFormInput): Omit<ExamTypeRecord, 'id'> {
  return {
    name: input.name,
    category: input.category,
    defaultDurationMin: input.defaultDurationMin,
    periodicityMonths: input.periodicityMonths ?? null,
    active: input.active,
    description: input.description ?? null,
  };
}

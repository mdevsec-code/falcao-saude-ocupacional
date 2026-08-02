import { z } from 'zod';

import i18n from '@/i18n';
import { nonEmptyString } from '@/validators/common';
import type { CidCategory } from '@/constants/cid';
import type { CidCustomEntry } from '@/services/msw/fixtures/cid';

export type { CidCustomEntry, CidCategory };

const CID_CODE_PATTERN = /^[A-Z]\d{2}(\.\d)?$/;

export const cidFormSchema = z.object({
  code: nonEmptyString
    .transform((s) => s.toUpperCase())
    .refine((s) => CID_CODE_PATTERN.test(s), i18n.t('cid:validation.codeFormat')),
  description: nonEmptyString.min(3, i18n.t('cid:validation.descriptionRequired')),
  category: z.enum([
    'Osteomuscular',
    'Auditivo',
    'Respiratório',
    'Saúde Mental',
    'Dermatológico',
    'Traumatismos e Acidentes',
    'Exposição Ocupacional',
  ]),
});

export type CidFormInput = z.infer<typeof cidFormSchema>;

export function toFormInput(record: CidCustomEntry): CidFormInput {
  return {
    code: record.code,
    description: record.description,
    category: record.category,
  };
}

export function fromFormInput(input: CidFormInput): Omit<CidCustomEntry, 'id'> {
  return {
    code: input.code,
    description: input.description,
    category: input.category as CidCategory,
  };
}

import { z } from 'zod';

import type { AccidentIndicatorRecord } from '@/services/msw/fixtures/indicadores';

export type { AccidentIndicatorRecord };

export const indicatorFormSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
  employees: z.coerce.number().int().min(0),
  accidentsWithLeave: z.coerce.number().int().min(0),
  accidentsWithoutLeave: z.coerce.number().int().min(0),
  daysLostAccidents: z.coerce.number().int().min(0),
  daysDebited: z.coerce.number().int().min(0),
});

export type IndicatorFormInput = z.infer<typeof indicatorFormSchema>;

export function toFormInput(record: AccidentIndicatorRecord): IndicatorFormInput {
  return {
    year: record.year,
    month: record.month,
    employees: record.employees,
    accidentsWithLeave: record.accidentsWithLeave,
    accidentsWithoutLeave: record.accidentsWithoutLeave,
    daysLostAccidents: record.daysLostAccidents,
    daysDebited: record.daysDebited,
  };
}

export function fromFormInput(input: IndicatorFormInput): Omit<AccidentIndicatorRecord, 'id'> {
  return { ...input };
}

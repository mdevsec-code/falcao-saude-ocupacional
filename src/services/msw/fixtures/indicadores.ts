export interface AccidentIndicatorRecord {
  id: string;
  year: number;
  /** 1 (Jan) a 12 (Dez). */
  month: number;
  employees: number;
  accidentsWithLeave: number;
  accidentsWithoutLeave: number;
  daysLostAccidents: number;
  daysDebited: number;
}

/** Sem indicadores pré-cadastrados — o lançamento mensal começa após o lançamento do sistema. */
export const ACCIDENT_INDICATORS_FIXTURE: AccidentIndicatorRecord[] = [];

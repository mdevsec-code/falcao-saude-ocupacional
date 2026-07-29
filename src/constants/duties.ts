/**
 * Atividades/riscos ocupacionais avaliados no ASO — específicos de uma
 * construtora/engenharia (NRs aplicáveis ao canteiro de obras). Cada
 * atendimento pode avaliar aptidão para uma ou mais dessas atividades,
 * já que um mesmo colaborador pode precisar de aptidão para múltiplas
 * frentes de trabalho.
 */
export const DUTY_TYPES = {
  ALTURA: 'altura',
  ESPACO_CONFINADO: 'espaco_confinado',
  MAQUINAS_PESADAS: 'maquinas_pesadas',
  ELETRICIDADE: 'eletricidade',
  LEVANTAMENTO_PESO: 'levantamento_peso',
  RUIDO: 'ruido',
} as const;

export type DutyType = (typeof DUTY_TYPES)[keyof typeof DUTY_TYPES];

export const ALL_DUTY_TYPES: DutyType[] = Object.values(DUTY_TYPES);

export const DUTY_TYPE_LABELS: Record<DutyType, string> = {
  [DUTY_TYPES.ALTURA]: 'Trabalho em Altura (NR-35)',
  [DUTY_TYPES.ESPACO_CONFINADO]: 'Espaço Confinado (NR-33)',
  [DUTY_TYPES.MAQUINAS_PESADAS]: 'Máquinas e Equipamentos Pesados (NR-12)',
  [DUTY_TYPES.ELETRICIDADE]: 'Eletricidade (NR-10)',
  [DUTY_TYPES.LEVANTAMENTO_PESO]: 'Levantamento de Peso / Esforço Físico',
  [DUTY_TYPES.RUIDO]: 'Exposição a Ruído',
};

export const DUTY_TYPE_SHORT_LABELS: Record<DutyType, string> = {
  [DUTY_TYPES.ALTURA]: 'Altura',
  [DUTY_TYPES.ESPACO_CONFINADO]: 'Esp. Confinado',
  [DUTY_TYPES.MAQUINAS_PESADAS]: 'Máquinas',
  [DUTY_TYPES.ELETRICIDADE]: 'Eletricidade',
  [DUTY_TYPES.LEVANTAMENTO_PESO]: 'Peso/Esforço',
  [DUTY_TYPES.RUIDO]: 'Ruído',
};

/** Sugestão de atividades relevantes por função — usado para pré-marcar o formulário. */
export const ROLE_DEFAULT_DUTIES: Record<string, DutyType[]> = {
  Pedreiro: [DUTY_TYPES.ALTURA, DUTY_TYPES.LEVANTAMENTO_PESO],
  Eletricista: [DUTY_TYPES.ELETRICIDADE, DUTY_TYPES.ALTURA],
  'Encarregado de Obras': [DUTY_TYPES.ALTURA, DUTY_TYPES.MAQUINAS_PESADAS],
  'Operador de Máquinas': [DUTY_TYPES.MAQUINAS_PESADAS, DUTY_TYPES.RUIDO],
  Soldador: [DUTY_TYPES.ALTURA, DUTY_TYPES.ESPACO_CONFINADO, DUTY_TYPES.RUIDO],
  Motorista: [DUTY_TYPES.MAQUINAS_PESADAS],
  Almoxarife: [DUTY_TYPES.LEVANTAMENTO_PESO],
  'Técnico de Segurança': [DUTY_TYPES.ALTURA, DUTY_TYPES.ESPACO_CONFINADO],
  'Engenheiro Civil': [DUTY_TYPES.ALTURA],
  'Auxiliar Administrativo': [],
};

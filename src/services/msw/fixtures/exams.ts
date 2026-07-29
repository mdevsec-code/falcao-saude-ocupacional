export type ExamCategory =
  | 'Admissional'
  | 'Periódico'
  | 'Demissional'
  | 'Mudança de Função'
  | 'Retorno ao Trabalho'
  | 'Complementar';

export interface ExamTypeRecord {
  id: string;
  name: string;
  category: ExamCategory;
  defaultDurationMin: number;
  /** Periodicidade em meses (NR-7). `null` = não periódico (evento único). */
  periodicityMonths: number | null;
  active: boolean;
  description: string | null;
}

/**
 * Catálogo de tipos de exame — fonte única consumida por Agenda e
 * Atendimentos (antes duplicado como array estático em cada feature).
 */
export const EXAM_TYPES_FIXTURE: ExamTypeRecord[] = [
  {
    id: 'exam-001',
    name: 'ASO Admissional',
    category: 'Admissional',
    defaultDurationMin: 30,
    periodicityMonths: null,
    active: true,
    description: 'Exame realizado antes do início das atividades do colaborador.',
  },
  {
    id: 'exam-002',
    name: 'ASO Periódico',
    category: 'Periódico',
    defaultDurationMin: 30,
    periodicityMonths: 12,
    active: true,
    description: 'Reavaliação periódica de saúde ocupacional (NR-7).',
  },
  {
    id: 'exam-003',
    name: 'ASO Demissional',
    category: 'Demissional',
    defaultDurationMin: 30,
    periodicityMonths: null,
    active: true,
    description: 'Exame realizado no desligamento do colaborador.',
  },
  {
    id: 'exam-004',
    name: 'ASO Mudança de Função',
    category: 'Mudança de Função',
    defaultDurationMin: 30,
    periodicityMonths: null,
    active: true,
    description: 'Reavaliação por mudança de função ou de risco ocupacional.',
  },
  {
    id: 'exam-005',
    name: 'Retorno ao Trabalho',
    category: 'Retorno ao Trabalho',
    defaultDurationMin: 30,
    periodicityMonths: null,
    active: true,
    description: 'Exame após afastamento por doença ou acidente.',
  },
  {
    id: 'exam-006',
    name: 'Audiometria',
    category: 'Complementar',
    defaultDurationMin: 20,
    periodicityMonths: 12,
    active: true,
    description: 'Exame complementar para colaboradores expostos a ruído.',
  },
  {
    id: 'exam-007',
    name: 'Acuidade Visual',
    category: 'Complementar',
    defaultDurationMin: 15,
    periodicityMonths: 12,
    active: true,
    description: 'Triagem visual complementar.',
  },
  {
    id: 'exam-008',
    name: 'Espirometria',
    category: 'Complementar',
    defaultDurationMin: 20,
    periodicityMonths: 12,
    active: true,
    description: 'Exame complementar para colaboradores expostos a poeiras/agentes respiratórios.',
  },
];

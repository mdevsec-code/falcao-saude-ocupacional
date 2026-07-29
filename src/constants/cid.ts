/**
 * Catálogo de referência CID-10 — não é uma lista exaustiva (a CID-10
 * completa tem milhares de códigos), e sim um recorte curado dos
 * códigos mais relevantes para saúde ocupacional em construção civil
 * e engenharia: osteomusculares, auditivos, respiratórios, dermatoses,
 * saúde mental e acidentes/traumatismos típicos de canteiro de obras.
 */
export type CidCategory =
  | 'Osteomuscular'
  | 'Auditivo'
  | 'Respiratório'
  | 'Saúde Mental'
  | 'Dermatológico'
  | 'Traumatismos e Acidentes'
  | 'Exposição Ocupacional';

export interface CidEntry {
  code: string;
  description: string;
  category: CidCategory;
}

export const CID_CATALOG: CidEntry[] = [
  // Osteomuscular
  { code: 'M54', description: 'Dorsalgia', category: 'Osteomuscular' },
  { code: 'M51', description: 'Outros transtornos de discos intervertebrais', category: 'Osteomuscular' },
  { code: 'M75', description: 'Lesões do ombro', category: 'Osteomuscular' },
  { code: 'M65', description: 'Sinovite e tenossinovite', category: 'Osteomuscular' },
  { code: 'M77', description: 'Outras entesopatias (ex.: epicondilite)', category: 'Osteomuscular' },
  { code: 'M79', description: 'Outros transtornos dos tecidos moles não classificados', category: 'Osteomuscular' },
  { code: 'M25', description: 'Outros transtornos articulares não classificados', category: 'Osteomuscular' },

  // Auditivo
  { code: 'H90', description: 'Perda de audição neurossensorial e mista', category: 'Auditivo' },
  { code: 'H83', description: 'Outras doenças do ouvido interno', category: 'Auditivo' },

  // Respiratório
  { code: 'J45', description: 'Asma', category: 'Respiratório' },
  { code: 'J62', description: 'Pneumoconiose devida a poeira contendo sílica', category: 'Respiratório' },
  { code: 'J63', description: 'Pneumoconiose devida a outras poeiras inorgânicas', category: 'Respiratório' },
  { code: 'J66', description: 'Doença das vias respiratórias devida a poeiras orgânicas específicas', category: 'Respiratório' },

  // Saúde mental
  { code: 'F43', description: 'Reações ao estresse grave e transtornos de adaptação', category: 'Saúde Mental' },
  { code: 'F41', description: 'Outros transtornos ansiosos', category: 'Saúde Mental' },
  { code: 'F32', description: 'Episódios depressivos', category: 'Saúde Mental' },
  { code: 'Z73', description: 'Problemas relacionados com dificuldade em controlar o modo de vida (burnout)', category: 'Saúde Mental' },

  // Dermatológico
  { code: 'L23', description: 'Dermatite alérgica de contato', category: 'Dermatológico' },
  { code: 'L24', description: 'Dermatite de contato por irritantes', category: 'Dermatológico' },
  { code: 'L59', description: 'Outros transtornos da pele relacionados com radiação (ex.: exposição solar)', category: 'Dermatológico' },

  // Traumatismos e acidentes (típicos de canteiro de obras)
  { code: 'S06', description: 'Traumatismo intracraniano', category: 'Traumatismos e Acidentes' },
  { code: 'S42', description: 'Fratura do ombro e do braço', category: 'Traumatismos e Acidentes' },
  { code: 'S52', description: 'Fratura do antebraço', category: 'Traumatismos e Acidentes' },
  { code: 'S82', description: 'Fratura da perna, incluindo do tornozelo', category: 'Traumatismos e Acidentes' },
  { code: 'S93', description: 'Luxação, entorse e distensão das articulações do tornozelo e do pé', category: 'Traumatismos e Acidentes' },
  { code: 'T14', description: 'Traumatismo não especificado de região não especificada do corpo', category: 'Traumatismos e Acidentes' },
  { code: 'W11', description: 'Queda envolvendo andaime', category: 'Traumatismos e Acidentes' },
  { code: 'W13', description: 'Queda de, ou através de, edifício ou estrutura', category: 'Traumatismos e Acidentes' },
  { code: 'W20', description: 'Atingido por objeto lançado, projetado ou que caiu', category: 'Traumatismos e Acidentes' },

  // Exposição ocupacional
  { code: 'T65', description: 'Efeito tóxico de outras substâncias e das não especificadas', category: 'Exposição Ocupacional' },
  { code: 'Z57', description: 'Exposição ocupacional a fatores de risco', category: 'Exposição Ocupacional' },
];

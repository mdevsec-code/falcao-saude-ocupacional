/**
 * Perfis de acesso da plataforma Falcão Saúde Ocupacional.
 */
export const ROLES = {
  ADMIN: 'ADMIN',
  MEDICO: 'MEDICO',
  ENFERMEIRO: 'ENFERMEIRO',
  TECNICO_SEGURANCA: 'TECNICO_SEGURANCA',
  RH: 'RH',
  RECEPCAO: 'RECEPCAO',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Administrador',
  MEDICO: 'Médico',
  ENFERMEIRO: 'Enfermeiro',
  TECNICO_SEGURANCA: 'Técnico de Segurança',
  RH: 'Recursos Humanos',
  RECEPCAO: 'Recepção',
};

export const ALL_ROLES: Role[] = Object.values(ROLES);

import { createTranslatedLabels } from '@/utils/i18nLabels';

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
  GESTOR_SSO: 'GESTOR_SSO',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/** Rótulos traduzidos (`enums:roles.*`) — acompanham o idioma ativo. */
export const ROLE_LABELS: Record<Role, string> = createTranslatedLabels<Role>('roles');

export const ALL_ROLES: Role[] = Object.values(ROLES);

import { ROLES, type Role } from '@/constants/roles';

export type UserStatus = 'active' | 'inactive';

export interface UserFixture {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  avatarUrl?: string;
  companyId?: string;
}

/**
 * Conta administrativa inicial (bootstrap). Não é uma conta de demonstração —
 * é o único acesso que existe até que o próprio administrador cadastre o
 * restante da equipe pela tela de Usuários, já no ambiente real.
 * Senha de desenvolvimento local em `services/msw/handlers/auth.ts`
 * (`SEED_PASSWORD`) — trocar por credenciais reais antes do lançamento.
 */
export const ADMIN_USER: UserFixture = {
  id: 'u-admin-001',
  name: 'Administrador Falcão',
  email: 'admin@falcao.com',
  role: ROLES.ADMIN,
  status: 'active',
};

/** Base de usuários — começa com apenas a conta administrativa inicial. */
export const SEED_USERS: UserFixture[] = [ADMIN_USER];

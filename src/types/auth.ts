import type { Role } from '@/constants/roles';

/**
 * Representa um usuário autenticado no sistema.
 * Será expandido na Etapa 3 (Autenticação).
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  companyId?: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

import { ROLES, type Role } from '@/constants/roles';

export interface UserFixture {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  companyId?: string;
}

export const ADMIN_USER: UserFixture = {
  id: 'u-admin-001',
  name: 'Administrador Falcão',
  email: 'admin@falcao.com',
  role: ROLES.ADMIN,
};

export const DEMO_USERS: UserFixture[] = [
  ADMIN_USER,
  {
    id: 'u-medico-001',
    name: 'Dra. Helena Costa',
    email: 'helena@falcao.com',
    role: ROLES.MEDICO,
  },
  {
    id: 'u-rh-001',
    name: 'Roberto Almeida',
    email: 'roberto@falcao.com',
    role: ROLES.RH,
  },
];

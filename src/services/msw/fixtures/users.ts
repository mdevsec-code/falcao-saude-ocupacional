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

export const ADMIN_USER: UserFixture = {
  id: 'u-admin-001',
  name: 'Administrador Falcão',
  email: 'admin@falcao.com',
  role: ROLES.ADMIN,
  status: 'active',
};

export const DEMO_USERS: UserFixture[] = [
  ADMIN_USER,
  { id: 'u-medico-001', name: 'Dra. Helena Costa', email: 'helena@falcao.com', role: ROLES.MEDICO, status: 'active' },
  { id: 'u-medico-002', name: 'Dr. Ricardo Nunes', email: 'ricardo@falcao.com', role: ROLES.MEDICO, status: 'active' },
  {
    id: 'u-enf-001',
    name: 'Simone Cavalcanti',
    email: 'simone@falcao.com',
    role: ROLES.ENFERMEIRO,
    status: 'active',
  },
  {
    id: 'u-seg-001',
    name: 'Paulo Henrique Lima',
    email: 'paulo@falcao.com',
    role: ROLES.TECNICO_SEGURANCA,
    status: 'active',
  },
  { id: 'u-rh-001', name: 'Roberto Almeida', email: 'roberto@falcao.com', role: ROLES.RH, status: 'active' },
  {
    id: 'u-rh-002',
    name: 'Fernanda Ribeiro',
    email: 'fernanda.rh@falcao.com',
    role: ROLES.RH,
    status: 'inactive',
  },
  {
    id: 'u-rec-001',
    name: 'Juliana Martins',
    email: 'juliana@falcao.com',
    role: ROLES.RECEPCAO,
    status: 'active',
  },
  {
    id: 'u-rec-002',
    name: 'Camila Duarte',
    email: 'camila@falcao.com',
    role: ROLES.RECEPCAO,
    status: 'active',
  },
];

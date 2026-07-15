/**
 * Caminhos de rota centralizados.
 * Importar de `routes/paths` em produção, mas mantemos o símbolo
 * para que o roteador e a sidebar consumam o mesmo lugar.
 */
export const ROUTE_PATHS = {
  ROOT: '/',
  LOGIN: '/login',
  DASHBOARD: '/',
  AGENDA: '/agenda',
  AGENDAMENTOS: '/agendamentos',
  PACIENTES: '/pacientes',
  COLABORADORES: '/colaboradores',
  EMPRESAS: '/empresas',
  ATENDIMENTOS: '/atendimentos',
  PRONTUARIOS: '/prontuarios',
  CID: '/cid',
  EXAMES: '/exames',
  ASO: '/aso',
  RELATORIOS: '/relatorios',
  USUARIOS: '/usuarios',
  PERMISSOES: '/permissoes',
  CONFIGURACOES: '/configuracoes',
  PERFIL: '/perfil',
  AUDITORIA: '/auditoria',
  PLACEHOLDER: '/em-construcao',
  NOT_FOUND: '/404',
} as const;

export type RoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];

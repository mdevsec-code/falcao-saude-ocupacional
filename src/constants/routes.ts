/**
 * Caminhos de rota centralizados.
 * Importar de `routes/paths` em produção, mas mantemos o símbolo
 * para que o roteador e a sidebar consumam o mesmo lugar.
 */
export const ROUTE_PATHS = {
  ROOT: '/',
  LOGIN: '/login',
  AUTH_CALLBACK: '/auth/callback',
  DASHBOARD: '/',
  AGENDA: '/agenda',
  AGENDAMENTOS: '/agendamentos',
  PACIENTES: '/pacientes',
  ATENDIMENTOS: '/atendimentos',
  PRONTUARIOS: '/prontuarios',
  CID: '/cid',
  EXAMES: '/exames',
  ASO: '/aso',
  RELATORIOS: '/relatorios',
  ATESTADOS: '/atestados',
  FERIAS: '/ferias',
  SEGURANCA: '/seguranca',
  USUARIOS: '/usuarios',
  PERMISSOES: '/permissoes',
  CONFIGURACOES: '/configuracoes',
  PERFIL: '/perfil',
  AUDITORIA: '/auditoria',
  PLACEHOLDER: '/em-construcao',
  NOT_FOUND: '/404',
} as const;

export type RoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];

/**
 * Mapa de rota → chave de tradução (`common:nav.<chave>`). Existe porque a
 * URL usa slugs em português (`/agendamentos`) enquanto as chaves do i18n
 * usam nomes semânticos em inglês (`nav.appointments`) — sem este mapa, a
 * trilha de navegação (breadcrumb) da Topbar não encontra a tradução e cai
 * no fallback de mostrar a URL crua.
 */
export const ROUTE_NAV_KEYS: Partial<Record<RoutePath, string>> = {
  [ROUTE_PATHS.DASHBOARD]: 'dashboard',
  [ROUTE_PATHS.AGENDA]: 'agenda',
  [ROUTE_PATHS.AGENDAMENTOS]: 'appointments',
  [ROUTE_PATHS.PACIENTES]: 'patients',
  [ROUTE_PATHS.ATENDIMENTOS]: 'attendances',
  [ROUTE_PATHS.PRONTUARIOS]: 'records',
  [ROUTE_PATHS.CID]: 'cid',
  [ROUTE_PATHS.EXAMES]: 'exams',
  [ROUTE_PATHS.ASO]: 'aso',
  [ROUTE_PATHS.RELATORIOS]: 'reports',
  [ROUTE_PATHS.ATESTADOS]: 'atestados',
  [ROUTE_PATHS.FERIAS]: 'vacation',
  [ROUTE_PATHS.SEGURANCA]: 'safety',
  [ROUTE_PATHS.USUARIOS]: 'users',
  [ROUTE_PATHS.PERMISSOES]: 'permissions',
  [ROUTE_PATHS.CONFIGURACOES]: 'settings',
  [ROUTE_PATHS.PERFIL]: 'profile',
  [ROUTE_PATHS.AUDITORIA]: 'audit',
};

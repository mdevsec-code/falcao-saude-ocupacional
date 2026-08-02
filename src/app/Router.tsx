import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppShell } from '@/components/layout/AppShell';
import { ROUTE_PATHS } from '@/constants/routes';
import { LoadingState } from '@/components/feedback/LoadingState';
import { PlaceholderPage } from '@/components/common/PlaceholderPage';
import { NotFoundPage } from '@/components/error/NotFoundPage';
import { RequireAuth } from '@/features/auth/components/RequireAuth';
import { RequirePermission } from '@/features/auth/components/RequirePermission';
import { PERMISSIONS } from '@/constants/permissions';
import { RootBoundary } from './RootBoundary';

const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
);

const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);

const ReportsPage = lazy(() =>
  import('@/features/reports/pages/ReportsPage').then((m) => ({ default: m.ReportsPage })),
);

const AtestadosPage = lazy(() =>
  import('@/features/atestados/pages/AtestadosPage').then((m) => ({ default: m.AtestadosPage })),
);

const AppointmentsPage = lazy(() =>
  import('@/features/appointments/pages/AppointmentsPage').then((m) => ({
    default: m.AppointmentsPage,
  })),
);

const AgendaPage = lazy(() =>
  import('@/features/agenda/pages/AgendaPage').then((m) => ({ default: m.AgendaPage })),
);

const PatientsPage = lazy(() =>
  import('@/features/patients/pages/PatientsPage').then((m) => ({ default: m.PatientsPage })),
);

const AttendancesPage = lazy(() =>
  import('@/features/attendances/pages/AttendancesPage').then((m) => ({
    default: m.AttendancesPage,
  })),
);

const FeriasPage = lazy(() =>
  import('@/features/ferias/pages/FeriasPage').then((m) => ({ default: m.FeriasPage })),
);

const SegurancaPage = lazy(() =>
  import('@/features/seguranca/pages/SegurancaPage').then((m) => ({ default: m.SegurancaPage })),
);

const RecordsPage = lazy(() =>
  import('@/features/records/pages/RecordsPage').then((m) => ({ default: m.RecordsPage })),
);

const AsoPage = lazy(() =>
  import('@/features/aso/pages/AsoPage').then((m) => ({ default: m.AsoPage })),
);

const UsersPage = lazy(() =>
  import('@/features/users/pages/UsersPage').then((m) => ({ default: m.UsersPage })),
);

const PermissionsPage = lazy(() =>
  import('@/features/permissions/pages/PermissionsPage').then((m) => ({
    default: m.PermissionsPage,
  })),
);

const ExamTypesPage = lazy(() =>
  import('@/features/exams/pages/ExamTypesPage').then((m) => ({ default: m.ExamTypesPage })),
);

const CidPage = lazy(() =>
  import('@/features/cid/pages/CidPage').then((m) => ({ default: m.CidPage })),
);

const ProfilePage = lazy(() =>
  import('@/features/profile/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);

const SettingsPage = lazy(() =>
  import('@/features/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);

const AuditPage = lazy(() =>
  import('@/features/audit/pages/AuditPage').then((m) => ({ default: m.AuditPage })),
);

const withSuspense = (element: ReactNode) => (
  <Suspense fallback={<LoadingState />}>{element}</Suspense>
);

/**
 * Rotas com link condicional na Sidebar (via `requires: Permission`) também
 * precisam de guarda no roteador — senão um usuário autenticado sem a
 * permissão consegue acessar a página só digitando a URL diretamente.
 */
const withPermission = (
  permission: (typeof PERMISSIONS)[keyof typeof PERMISSIONS],
  element: ReactNode,
) => <RequirePermission permission={permission}>{withSuspense(element)}</RequirePermission>;

function ComingSoonPlaceholder(): ReactNode {
  const { t } = useTranslation('common');
  return <PlaceholderPage title={t('placeholder.comingSoon.title')} />;
}

const protectedRoutes: RouteObject[] = [
  { path: ROUTE_PATHS.AGENDA, element: withSuspense(<AgendaPage />) },
  { path: ROUTE_PATHS.AGENDAMENTOS, element: withSuspense(<AppointmentsPage />) },
  { path: ROUTE_PATHS.PACIENTES, element: withSuspense(<PatientsPage />) },
  { path: ROUTE_PATHS.ATENDIMENTOS, element: withSuspense(<AttendancesPage />) },
  { path: ROUTE_PATHS.PRONTUARIOS, element: withSuspense(<RecordsPage />) },
  { path: ROUTE_PATHS.CID, element: withSuspense(<CidPage />) },
  { path: ROUTE_PATHS.EXAMES, element: withSuspense(<ExamTypesPage />) },
  { path: ROUTE_PATHS.ASO, element: withSuspense(<AsoPage />) },
  { path: ROUTE_PATHS.RELATORIOS, element: withSuspense(<ReportsPage />) },
  { path: ROUTE_PATHS.ATESTADOS, element: withSuspense(<AtestadosPage />) },
  {
    path: ROUTE_PATHS.FERIAS,
    element: withPermission(PERMISSIONS.EMPLOYEE_READ, <FeriasPage />),
  },
  {
    path: ROUTE_PATHS.SEGURANCA,
    element: withPermission(PERMISSIONS.DEVIATION_READ, <SegurancaPage />),
  },
  {
    path: ROUTE_PATHS.USUARIOS,
    element: withPermission(PERMISSIONS.USERS_MANAGE, <UsersPage />),
  },
  {
    path: ROUTE_PATHS.PERMISSOES,
    element: withPermission(PERMISSIONS.USERS_MANAGE, <PermissionsPage />),
  },
  {
    path: ROUTE_PATHS.CONFIGURACOES,
    element: withPermission(PERMISSIONS.SETTINGS_MANAGE, <SettingsPage />),
  },
  { path: ROUTE_PATHS.PERFIL, element: withSuspense(<ProfilePage />) },
  {
    path: ROUTE_PATHS.AUDITORIA,
    element: withPermission(PERMISSIONS.AUDIT_READ, <AuditPage />),
  },
];

const routes: RouteObject[] = [
  {
    path: ROUTE_PATHS.LOGIN,
    element: withSuspense(<LoginPage />),
    errorElement: <RootBoundary />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    errorElement: <RootBoundary />,
    children: [{ index: true, element: withSuspense(<DashboardPage />) }, ...protectedRoutes],
  },
  {
    path: ROUTE_PATHS.PLACEHOLDER,
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [{ index: true, element: <ComingSoonPlaceholder /> }],
  },
  { path: ROUTE_PATHS.NOT_FOUND, element: <NotFoundPage /> },
  // URLs desconhecidas mostram a página 404 de verdade, em vez de mandar
  // silenciosamente para o Dashboard (o usuário precisa saber que a rota
  // não existe, não achar que clicou em algo errado).
  { path: '*', element: <NotFoundPage /> },
];

export const router = createBrowserRouter(routes);

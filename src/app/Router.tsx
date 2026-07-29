import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ROUTE_PATHS } from '@/constants/routes';
import { LoadingState } from '@/components/feedback/LoadingState';
import { PlaceholderPage } from '@/components/common/PlaceholderPage';
import { NotFoundPage } from '@/components/error/NotFoundPage';
import { RequireAuth } from '@/features/auth/components/RequireAuth';
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
  { path: ROUTE_PATHS.USUARIOS, element: withSuspense(<UsersPage />) },
  { path: ROUTE_PATHS.PERMISSOES, element: withSuspense(<PermissionsPage />) },
  { path: ROUTE_PATHS.CONFIGURACOES, element: withSuspense(<SettingsPage />) },
  { path: ROUTE_PATHS.PERFIL, element: withSuspense(<ProfilePage />) },
  { path: ROUTE_PATHS.AUDITORIA, element: withSuspense(<AuditPage />) },
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
    element: <AppShell />,
    children: [{ index: true, element: <PlaceholderPage title="Novidade a caminho" /> }],
  },
  { path: ROUTE_PATHS.NOT_FOUND, element: <NotFoundPage /> },
  { path: '*', element: <Navigate to={ROUTE_PATHS.DASHBOARD} replace /> },
];

export const router = createBrowserRouter(routes);

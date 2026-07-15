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

const withSuspense = (element: ReactNode) => (
  <Suspense fallback={<LoadingState />}>{element}</Suspense>
);

const protectedRoutes: RouteObject[] = [
  { path: ROUTE_PATHS.AGENDA, element: <PlaceholderPage title="Agenda" /> },
  { path: ROUTE_PATHS.AGENDAMENTOS, element: <PlaceholderPage title="Agendamentos" /> },
  { path: ROUTE_PATHS.PACIENTES, element: <PlaceholderPage title="Pacientes" /> },
  { path: ROUTE_PATHS.COLABORADORES, element: <PlaceholderPage title="Colaboradores" /> },
  { path: ROUTE_PATHS.EMPRESAS, element: <PlaceholderPage title="Empresas" /> },
  { path: ROUTE_PATHS.ATENDIMENTOS, element: <PlaceholderPage title="Atendimentos" /> },
  { path: ROUTE_PATHS.PRONTUARIOS, element: <PlaceholderPage title="Prontuários" /> },
  { path: ROUTE_PATHS.CID, element: <PlaceholderPage title="CID" /> },
  { path: ROUTE_PATHS.EXAMES, element: <PlaceholderPage title="Exames" /> },
  { path: ROUTE_PATHS.ASO, element: <PlaceholderPage title="ASO" /> },
  { path: ROUTE_PATHS.RELATORIOS, element: <PlaceholderPage title="Relatórios" /> },
  { path: ROUTE_PATHS.USUARIOS, element: <PlaceholderPage title="Usuários" /> },
  { path: ROUTE_PATHS.PERMISSOES, element: <PlaceholderPage title="Permissões" /> },
  { path: ROUTE_PATHS.CONFIGURACOES, element: <PlaceholderPage title="Configurações" /> },
  { path: ROUTE_PATHS.PERFIL, element: <PlaceholderPage title="Perfil" /> },
  { path: ROUTE_PATHS.AUDITORIA, element: <PlaceholderPage title="Auditoria" /> },
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
    children: [{ index: true, element: <PlaceholderPage title="Em construção" /> }],
  },
  { path: ROUTE_PATHS.NOT_FOUND, element: <NotFoundPage /> },
  { path: '*', element: <Navigate to={ROUTE_PATHS.DASHBOARD} replace /> },
];

export const router = createBrowserRouter(routes);

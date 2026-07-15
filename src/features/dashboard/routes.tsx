import { lazy, type ReactNode } from 'react';
import { type RouteObject } from 'react-router-dom';

const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);

export const dashboardRoutes: RouteObject[] = [
  {
    index: true,
    element: <DashboardPage />,
  },
];

// ReactNode export mantido para testes futuros
export type DashboardRouteElement = ReactNode;

import { lazy } from 'react';
import { type RouteObject } from 'react-router-dom';

const AtestadosPage = lazy(() =>
  import('./pages/AtestadosPage').then((m) => ({ default: m.AtestadosPage })),
);

export const atestadosRoutes: RouteObject[] = [
  {
    index: true,
    element: <AtestadosPage />,
  },
];

import { lazy } from 'react';
import { type RouteObject } from 'react-router-dom';
import { ROUTE_PATHS } from '@/constants/routes';

const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));

export const authRoutes: RouteObject[] = [{ path: ROUTE_PATHS.LOGIN, element: <LoginPage /> }];

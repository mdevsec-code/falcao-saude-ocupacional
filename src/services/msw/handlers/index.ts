import { authHandlers } from './auth';
import { dashboardHandlers } from './dashboard';

export const handlers = [...authHandlers, ...dashboardHandlers];

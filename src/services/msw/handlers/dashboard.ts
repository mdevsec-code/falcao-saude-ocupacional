import { http, HttpResponse, delay } from 'msw';
import { DASHBOARD_KPIS } from '../fixtures/dashboard';

export const dashboardHandlers = [
  http.get('/api/dashboard/kpis', async () => {
    await delay(200);
    return HttpResponse.json(DASHBOARD_KPIS);
  }),
];

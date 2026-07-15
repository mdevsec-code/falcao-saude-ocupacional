import { httpClient } from '@/services/http/client';
import type { DashboardKpi } from '@/services/msw/fixtures/dashboard';

export const dashboardApi = {
  async getKpis(): Promise<DashboardKpi[]> {
    const { data } = await httpClient.get<DashboardKpi[]>('/dashboard/kpis');
    return data;
  },
};

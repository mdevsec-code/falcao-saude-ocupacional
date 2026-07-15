import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/dashboard.api';
import type { DashboardKpi } from '../types';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  kpis: () => [...dashboardKeys.all, 'kpis'] as const,
};

export function useDashboardKpis() {
  return useQuery<DashboardKpi[], Error>({
    queryKey: dashboardKeys.kpis(),
    queryFn: dashboardApi.getKpis,
    staleTime: 1000 * 60, // 1 min
  });
}

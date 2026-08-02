export interface DashboardKpi {
  id: 'appointmentsToday' | 'waiting' | 'attendances' | 'pending';
  value: number;
  trend: { direction: 'up' | 'down' | 'flat'; value: string };
}

/** Sem histórico pré-cadastrado — os indicadores começam zerados após o lançamento. */
export const DASHBOARD_KPIS: DashboardKpi[] = [
  { id: 'appointmentsToday', value: 0, trend: { direction: 'flat', value: '0' } },
  { id: 'waiting', value: 0, trend: { direction: 'flat', value: '0' } },
  { id: 'attendances', value: 0, trend: { direction: 'flat', value: '0' } },
  { id: 'pending', value: 0, trend: { direction: 'flat', value: '0' } },
];

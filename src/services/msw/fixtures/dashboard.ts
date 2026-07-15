export interface DashboardKpi {
  id: 'appointmentsToday' | 'waiting' | 'attendances' | 'pending';
  label: string;
  value: number;
  trend: { direction: 'up' | 'down' | 'flat'; value: string };
}

export const DASHBOARD_KPIS: DashboardKpi[] = [
  {
    id: 'appointmentsToday',
    label: 'Consultas hoje',
    value: 12,
    trend: { direction: 'up', value: '+2' },
  },
  {
    id: 'waiting',
    label: 'Aguardando',
    value: 3,
    trend: { direction: 'flat', value: '0' },
  },
  {
    id: 'attendances',
    label: 'Atendimentos',
    value: 8,
    trend: { direction: 'up', value: '+18%' },
  },
  {
    id: 'pending',
    label: 'Pendências',
    value: 2,
    trend: { direction: 'down', value: '-1' },
  },
];

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type DashboardKpiId = 'appointmentsToday' | 'waiting' | 'attendances' | 'pending';

export interface DashboardKpi {
  id: DashboardKpiId;
  value: number;
  trend: { direction: 'up' | 'down' | 'flat'; value: string };
}

/**
 * Sem histórico de snapshots diários ainda, então não há base pra calcular
 * uma variação real (ex.: "+12% vs ontem") — todo KPI reporta `flat`/"0"
 * até existir esse histórico.
 */
const NO_TREND: DashboardKpi['trend'] = { direction: 'flat', value: '0' };

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getKpis(): Promise<DashboardKpi[]> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60_000);

    const [appointmentsToday, waiting, attendances, pending] = await Promise.all([
      // Consultas de hoje, exceto as canceladas.
      this.prisma.appointment.count({
        where: { startsAt: { gte: startOfDay, lt: endOfDay }, status: { not: 'cancelado' } },
      }),
      // Consultas de hoje ainda não atendidas.
      this.prisma.appointment.count({
        where: { startsAt: { gte: startOfDay, lt: endOfDay }, status: 'agendado' },
      }),
      // Atendimentos realizados hoje.
      this.prisma.attendance.count({
        where: { attendanceDate: { gte: startOfDay, lt: endOfDay } },
      }),
      // Consultas agendadas cujo horário já passou sem confirmação de status.
      this.prisma.appointment.count({
        where: { status: 'agendado', startsAt: { lt: now } },
      }),
    ]);

    return [
      { id: 'appointmentsToday', value: appointmentsToday, trend: NO_TREND },
      { id: 'waiting', value: waiting, trend: NO_TREND },
      { id: 'attendances', value: attendances, trend: NO_TREND },
      { id: 'pending', value: pending, trend: NO_TREND },
    ];
  }
}

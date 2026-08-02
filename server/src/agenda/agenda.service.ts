import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { Appointment } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit.service';
import type { CreateAppointmentDto } from './dto/create-appointment.dto';
import type { UpdateAppointmentDto } from './dto/update-appointment.dto';
import type { RequestUser } from '../auth/jwt.strategy';

@Injectable()
export class AgendaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  findAll(): Promise<Appointment[]> {
    return this.prisma.appointment.findMany({ orderBy: { startsAt: 'asc' } });
  }

  /** Mesmo médico, mesmo horário sobreposto, e nenhum dos dois cancelado. */
  private async assertNoConflict(
    doctor: string,
    startsAt: Date,
    durationMin: number,
    excludeId?: string,
  ): Promise<void> {
    const endsAt = new Date(startsAt.getTime() + durationMin * 60_000);
    const conflict = await this.prisma.appointment.findFirst({
      where: {
        id: excludeId ? { not: excludeId } : undefined,
        doctor,
        status: { not: 'cancelado' },
        startsAt: { lt: endsAt },
        AND: [{ startsAt: { gte: new Date(startsAt.getTime() - 4 * 60 * 60_000) } }],
      },
    });
    // Segunda checagem em memória: o filtro acima só reduz candidatos (não
    // dá para expressar `startsAt + durationMin > X` direto no Prisma sem
    // coluna computada); confirma a sobreposição real aqui.
    if (conflict) {
      const conflictEnd = new Date(conflict.startsAt.getTime() + conflict.durationMin * 60_000);
      if (conflict.startsAt < endsAt && startsAt < conflictEnd) {
        throw new ConflictException(
          `${doctor} já tem um agendamento nesse horário (${conflict.startsAt.toLocaleTimeString('pt-BR')}).`,
        );
      }
    }
  }

  async create(dto: CreateAppointmentDto, actor: RequestUser): Promise<Appointment> {
    const startsAt = new Date(dto.startsAt);
    await this.assertNoConflict(dto.doctor, startsAt, dto.durationMin);

    const record = await this.prisma.appointment.create({
      data: {
        patientName: dto.patientName,
        phone: dto.phone,
        examType: dto.examType,
        doctor: dto.doctor,
        status: dto.status,
        startsAt,
        durationMin: dto.durationMin,
        notes: dto.notes,
      },
    });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'create',
      entityType: 'attendance',
      entityId: record.id,
      entityLabel: `${record.patientName} — ${record.examType}`,
    });

    return record;
  }

  async update(id: string, dto: UpdateAppointmentDto, actor: RequestUser): Promise<Appointment> {
    const existing = await this.prisma.appointment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Agendamento não encontrado.');

    if (dto.doctor || dto.startsAt || dto.durationMin) {
      await this.assertNoConflict(
        dto.doctor ?? existing.doctor,
        dto.startsAt ? new Date(dto.startsAt) : existing.startsAt,
        dto.durationMin ?? existing.durationMin,
        id,
      );
    }

    const record = await this.prisma.appointment.update({
      where: { id },
      data: {
        patientName: dto.patientName,
        phone: dto.phone,
        examType: dto.examType,
        doctor: dto.doctor,
        status: dto.status,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        durationMin: dto.durationMin,
        notes: dto.notes,
      },
    });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'update',
      entityType: 'attendance',
      entityId: record.id,
      entityLabel: `${record.patientName} — ${record.examType}`,
    });

    return record;
  }

  async remove(id: string, actor: RequestUser): Promise<void> {
    const existing = await this.prisma.appointment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Agendamento não encontrado.');

    await this.prisma.appointment.delete({ where: { id } });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'delete',
      entityType: 'attendance',
      entityId: existing.id,
      entityLabel: `${existing.patientName} — ${existing.examType}`,
    });
  }
}

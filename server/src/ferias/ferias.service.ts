import { Injectable, NotFoundException } from '@nestjs/common';
import type { Vacation } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit.service';
import type { CreateVacationDto } from './dto/create-vacation.dto';
import type { UpdateVacationDto } from './dto/update-vacation.dto';
import type { RequestUser } from '../auth/jwt.strategy';

@Injectable()
export class FeriasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  findAll(): Promise<Vacation[]> {
    return this.prisma.vacation.findMany({ orderBy: { startDate: 'desc' } });
  }

  async create(dto: CreateVacationDto, actor: RequestUser): Promise<Vacation> {
    const record = await this.prisma.vacation.create({
      data: {
        patientName: dto.patientName,
        sector: dto.sector,
        role: dto.role,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        days: dto.days,
        status: dto.status,
        notes: dto.notes,
      },
    });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'create',
      entityType: 'vacation',
      entityId: record.id,
      entityLabel: record.patientName,
    });

    return record;
  }

  async update(id: string, dto: UpdateVacationDto, actor: RequestUser): Promise<Vacation> {
    const existing = await this.prisma.vacation.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Férias não encontradas.');

    const record = await this.prisma.vacation.update({
      where: { id },
      data: {
        patientName: dto.patientName,
        sector: dto.sector,
        role: dto.role,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        days: dto.days,
        status: dto.status,
        notes: dto.notes,
      },
    });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'update',
      entityType: 'vacation',
      entityId: record.id,
      entityLabel: record.patientName,
    });

    return record;
  }

  async remove(id: string, actor: RequestUser): Promise<void> {
    const existing = await this.prisma.vacation.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Férias não encontradas.');

    await this.prisma.vacation.delete({ where: { id } });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'delete',
      entityType: 'vacation',
      entityId: existing.id,
      entityLabel: existing.patientName,
    });
  }
}

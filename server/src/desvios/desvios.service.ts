import { Injectable, NotFoundException } from '@nestjs/common';
import type { Deviation } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit.service';
import type { CreateDeviationDto } from './dto/create-deviation.dto';
import type { UpdateDeviationDto } from './dto/update-deviation.dto';
import type { RequestUser } from '../auth/jwt.strategy';

@Injectable()
export class DesviosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  findAll(): Promise<Deviation[]> {
    return this.prisma.deviation.findMany({ orderBy: { date: 'desc' } });
  }

  async create(dto: CreateDeviationDto, actor: RequestUser): Promise<Deviation> {
    const record = await this.prisma.deviation.create({
      data: {
        date: new Date(dto.date),
        location: dto.location,
        classification: dto.classification,
        description: dto.description,
        foreman: dto.foreman,
        responsibleTechnician: dto.responsibleTechnician,
        action: dto.action,
        status: dto.status,
      },
    });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'create',
      entityType: 'deviation',
      entityId: record.id,
      entityLabel: record.description,
    });

    return record;
  }

  async update(id: string, dto: UpdateDeviationDto, actor: RequestUser): Promise<Deviation> {
    const existing = await this.prisma.deviation.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Desvio não encontrado.');

    const record = await this.prisma.deviation.update({
      where: { id },
      data: {
        date: dto.date ? new Date(dto.date) : undefined,
        location: dto.location,
        classification: dto.classification,
        description: dto.description,
        foreman: dto.foreman,
        responsibleTechnician: dto.responsibleTechnician,
        action: dto.action,
        status: dto.status,
      },
    });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'update',
      entityType: 'deviation',
      entityId: record.id,
      entityLabel: record.description,
    });

    return record;
  }

  async remove(id: string, actor: RequestUser): Promise<void> {
    const existing = await this.prisma.deviation.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Desvio não encontrado.');

    await this.prisma.deviation.delete({ where: { id } });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'delete',
      entityType: 'deviation',
      entityId: existing.id,
      entityLabel: existing.description,
    });
  }
}

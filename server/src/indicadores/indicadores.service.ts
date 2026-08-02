import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { AccidentIndicator } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit.service';
import type { CreateAccidentIndicatorDto } from './dto/create-accident-indicator.dto';
import type { UpdateAccidentIndicatorDto } from './dto/update-accident-indicator.dto';
import type { RequestUser } from '../auth/jwt.strategy';

@Injectable()
export class IndicadoresService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  findAll(): Promise<AccidentIndicator[]> {
    return this.prisma.accidentIndicator.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  async create(dto: CreateAccidentIndicatorDto, actor: RequestUser): Promise<AccidentIndicator> {
    const existing = await this.prisma.accidentIndicator.findUnique({
      where: { year_month: { year: dto.year, month: dto.month } },
    });
    if (existing) throw new ConflictException('Já existe um lançamento para este mês/ano.');

    const record = await this.prisma.accidentIndicator.create({
      data: {
        year: dto.year,
        month: dto.month,
        employees: dto.employees,
        accidentsWithLeave: dto.accidentsWithLeave,
        accidentsWithoutLeave: dto.accidentsWithoutLeave,
        daysLostAccidents: dto.daysLostAccidents,
        daysDebited: dto.daysDebited,
      },
    });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'create',
      entityType: 'accident_indicator',
      entityId: record.id,
      entityLabel: `${record.month}/${record.year}`,
    });

    return record;
  }

  async update(
    id: string,
    dto: UpdateAccidentIndicatorDto,
    actor: RequestUser,
  ): Promise<AccidentIndicator> {
    const existing = await this.prisma.accidentIndicator.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Indicador não encontrado.');

    const record = await this.prisma.accidentIndicator.update({
      where: { id },
      data: {
        year: dto.year,
        month: dto.month,
        employees: dto.employees,
        accidentsWithLeave: dto.accidentsWithLeave,
        accidentsWithoutLeave: dto.accidentsWithoutLeave,
        daysLostAccidents: dto.daysLostAccidents,
        daysDebited: dto.daysDebited,
      },
    });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'update',
      entityType: 'accident_indicator',
      entityId: record.id,
      entityLabel: `${record.month}/${record.year}`,
    });

    return record;
  }

  async remove(id: string, actor: RequestUser): Promise<void> {
    const existing = await this.prisma.accidentIndicator.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Indicador não encontrado.');

    await this.prisma.accidentIndicator.delete({ where: { id } });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'delete',
      entityType: 'accident_indicator',
      entityId: existing.id,
      entityLabel: `${existing.month}/${existing.year}`,
    });
  }
}

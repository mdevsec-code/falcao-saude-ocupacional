import { Injectable, NotFoundException } from '@nestjs/common';
import type { ExamType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit.service';
import type { CreateExamTypeDto } from './dto/create-exam-type.dto';
import type { UpdateExamTypeDto } from './dto/update-exam-type.dto';
import type { RequestUser } from '../auth/jwt.strategy';

@Injectable()
export class ExamTypesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  findAll(): Promise<ExamType[]> {
    return this.prisma.examType.findMany({ orderBy: { name: 'asc' } });
  }

  async create(dto: CreateExamTypeDto, actor: RequestUser): Promise<ExamType> {
    const record = await this.prisma.examType.create({ data: dto });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'create',
      entityType: 'exam_type',
      entityId: record.id,
      entityLabel: record.name,
    });

    return record;
  }

  async update(id: string, dto: UpdateExamTypeDto, actor: RequestUser): Promise<ExamType> {
    const existing = await this.prisma.examType.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Tipo de exame não encontrado.');

    const record = await this.prisma.examType.update({ where: { id }, data: dto });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'update',
      entityType: 'exam_type',
      entityId: record.id,
      entityLabel: record.name,
    });

    return record;
  }

  async remove(id: string, actor: RequestUser): Promise<void> {
    const existing = await this.prisma.examType.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Tipo de exame não encontrado.');

    await this.prisma.examType.delete({ where: { id } });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'delete',
      entityType: 'exam_type',
      entityId: existing.id,
      entityLabel: existing.name,
    });
  }
}

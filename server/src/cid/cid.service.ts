import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { CidCustomEntry } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit.service';
import type { CreateCidDto } from './dto/create-cid.dto';
import type { UpdateCidDto } from './dto/update-cid.dto';
import type { RequestUser } from '../auth/jwt.strategy';

@Injectable()
export class CidService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  findAll(): Promise<CidCustomEntry[]> {
    return this.prisma.cidCustomEntry.findMany({ orderBy: { code: 'asc' } });
  }

  async create(dto: CreateCidDto, actor: RequestUser): Promise<CidCustomEntry> {
    const existing = await this.prisma.cidCustomEntry.findUnique({ where: { code: dto.code } });
    if (existing) throw new ConflictException('Este código CID já está cadastrado.');

    const record = await this.prisma.cidCustomEntry.create({
      data: { code: dto.code, description: dto.description, category: dto.category },
    });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'create',
      entityType: 'cid',
      entityId: record.id,
      entityLabel: record.code,
    });

    return record;
  }

  async update(id: string, dto: UpdateCidDto, actor: RequestUser): Promise<CidCustomEntry> {
    const existing = await this.prisma.cidCustomEntry.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Código CID não encontrado.');

    const record = await this.prisma.cidCustomEntry.update({
      where: { id },
      data: { code: dto.code, description: dto.description, category: dto.category },
    });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'update',
      entityType: 'cid',
      entityId: record.id,
      entityLabel: record.code,
    });

    return record;
  }

  async remove(id: string, actor: RequestUser): Promise<void> {
    const existing = await this.prisma.cidCustomEntry.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Código CID não encontrado.');

    await this.prisma.cidCustomEntry.delete({ where: { id } });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'delete',
      entityType: 'cid',
      entityId: existing.id,
      entityLabel: existing.code,
    });
  }
}

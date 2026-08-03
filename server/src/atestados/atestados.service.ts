import { Injectable, NotFoundException } from '@nestjs/common';
import type { Atestado } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit.service';
import type { CreateAtestadoDto } from './dto/create-atestado.dto';
import type { UpdateAtestadoDto } from './dto/update-atestado.dto';
import type { RequestUser } from '../auth/jwt.strategy';

@Injectable()
export class AtestadosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  findAll(): Promise<Atestado[]> {
    return this.prisma.atestado.findMany({ orderBy: { inicioAtestado: 'desc' } });
  }

  async create(dto: CreateAtestadoDto, actor: RequestUser): Promise<Atestado> {
    const record = await this.prisma.atestado.create({
      data: {
        ponto: dto.ponto,
        nome: dto.nome,
        funcao: dto.funcao,
        setor: dto.setor,
        qntDias: dto.qntDias,
        cid: dto.cid,
        inicioAtestado: dto.inicioAtestado ? new Date(dto.inicioAtestado) : undefined,
        terminoAtestado: dto.terminoAtestado ? new Date(dto.terminoAtestado) : undefined,
        dataLancamento: dto.dataLancamento ? new Date(dto.dataLancamento) : undefined,
        competencia: dto.competencia,
        liderancaDireta: dto.liderancaDireta,
        observacao: dto.observacao,
        medico: dto.medico,
        crmCro: dto.crmCro,
        localAtendimento: dto.localAtendimento,
        slaLancamentoDias: dto.slaLancamentoDias,
      },
    });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'create',
      entityType: 'atestado',
      entityId: String(record.id),
      entityLabel: record.nome,
    });

    return record;
  }

  async update(id: number, dto: UpdateAtestadoDto, actor: RequestUser): Promise<Atestado> {
    const existing = await this.prisma.atestado.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Atestado não encontrado.');

    const record = await this.prisma.atestado.update({
      where: { id },
      data: {
        ponto: dto.ponto,
        nome: dto.nome,
        funcao: dto.funcao,
        setor: dto.setor,
        qntDias: dto.qntDias,
        cid: dto.cid,
        inicioAtestado: dto.inicioAtestado ? new Date(dto.inicioAtestado) : undefined,
        terminoAtestado: dto.terminoAtestado ? new Date(dto.terminoAtestado) : undefined,
        dataLancamento: dto.dataLancamento ? new Date(dto.dataLancamento) : undefined,
        competencia: dto.competencia,
        liderancaDireta: dto.liderancaDireta,
        observacao: dto.observacao,
        medico: dto.medico,
        crmCro: dto.crmCro,
        localAtendimento: dto.localAtendimento,
        slaLancamentoDias: dto.slaLancamentoDias,
      },
    });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'update',
      entityType: 'atestado',
      entityId: String(record.id),
      entityLabel: record.nome,
    });

    return record;
  }

  async remove(id: number, actor: RequestUser): Promise<void> {
    const existing = await this.prisma.atestado.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Atestado não encontrado.');

    await this.prisma.atestado.delete({ where: { id } });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'delete',
      entityType: 'atestado',
      entityId: String(existing.id),
      entityLabel: existing.nome,
    });
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import type { Atestado } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Somente leitura — atestados/afastamentos hoje entram por importação de
 * planilha (ver `docs/database.md` do frontend), não por cadastro manual.
 * Se isso mudar, adicionar POST/PATCH aqui seguindo o padrão dos outros
 * módulos (`exam-types`, `patients`).
 */
@Controller('atestados')
@UseGuards(JwtAuthGuard)
export class AtestadosController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  findAll(): Promise<Atestado[]> {
    return this.prisma.atestado.findMany({ orderBy: { inicioAtestado: 'desc' } });
  }
}

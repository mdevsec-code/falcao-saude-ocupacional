import { Controller, Get, UseGuards } from '@nestjs/common';
import type { AuditLog } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';

/** Somente leitura — a gravação acontece via `AuditService.record()`,
 * chamado pelos outros módulos a cada mutação. Restrito a ADMIN, como no
 * frontend (`PERMISSIONS.AUDIT_READ`). */
@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AuditController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  findAll(): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({ orderBy: { timestamp: 'desc' }, take: 500 });
  }
}

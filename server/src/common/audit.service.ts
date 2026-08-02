import { Injectable } from '@nestjs/common';
import type { AuditAction, AuditEntityType, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface RecordAuditEventInput {
  actorId?: string | null;
  actorName: string;
  actorRole?: Role | null;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: string;
  entityLabel?: string;
  detail?: string;
  ip?: string;
}

/**
 * Grava a trilha de auditoria LGPD. Espelha `recordAuditEvent` do mock MSW
 * do frontend (`src/services/msw/handlers/audit.ts`) — mesmo formato de
 * evento, agora persistido de verdade em vez de em memória.
 */
@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async record(input: RecordAuditEventInput): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorId: input.actorId ?? undefined,
        actorName: input.actorName,
        actorRole: input.actorRole ?? undefined,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        entityLabel: input.entityLabel,
        detail: input.detail,
        ip: input.ip,
      },
    });
  }
}

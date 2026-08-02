import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit.service';
import type { LoginDto } from './dto/login.dto';

export interface SessionResponse {
  user: { id: string; name: string; email: string; role: string };
  token: string;
  expiresAt: string;
}

const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8h — mesma duração usada no mock MSW

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly audit: AuditService,
  ) {}

  async login(dto: LoginDto, ip?: string): Promise<SessionResponse> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });

    const valid = user ? await bcrypt.compare(dto.password, user.passwordHash) : false;

    if (!user || !valid || user.status !== 'active') {
      await this.audit.record({
        actorId: user?.id ?? null,
        actorName: user?.name ?? email,
        actorRole: user?.role ?? null,
        action: 'login_failed',
        entityType: 'auth',
        entityLabel: email,
        detail: user && user.status !== 'active' ? 'Usuário inativo' : 'Credenciais inválidas',
        ip,
      });
      throw new UnauthorizedException(
        user && user.status !== 'active' ? 'Usuário inativo' : 'Credenciais inválidas',
      );
    }

    await this.audit.record({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'login',
      entityType: 'auth',
      entityLabel: user.email,
      ip,
    });

    return this.issueSession(user);
  }

  async logout(userId: string, userName: string, userEmail: string): Promise<void> {
    await this.audit.record({
      actorId: userId,
      actorName: userName,
      action: 'logout',
      entityType: 'auth',
      entityLabel: userEmail,
    });
  }

  private issueSession(user: {
    id: string;
    name: string;
    email: string;
    role: string;
  }): SessionResponse {
    const token = this.jwt.sign({ sub: user.id, role: user.role });
    return {
      user,
      token,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    };
  }
}

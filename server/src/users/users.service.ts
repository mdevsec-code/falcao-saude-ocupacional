import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import type { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { RequestUser } from '../auth/jwt.strategy';

export type SafeUser = Omit<User, 'passwordHash'>;

function toSafeUser(user: User): SafeUser {
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async findAll(): Promise<SafeUser[]> {
    const users = await this.prisma.user.findMany({ orderBy: { name: 'asc' } });
    return users.map(toSafeUser);
  }

  async create(dto: CreateUserDto, actor: RequestUser): Promise<SafeUser> {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Já existe um usuário com este e-mail.');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: { name: dto.name, email, role: dto.role, status: dto.status, passwordHash },
    });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'create',
      entityType: 'user',
      entityId: user.id,
      entityLabel: user.name,
    });

    return toSafeUser(user);
  }

  async update(id: string, dto: UpdateUserDto, actor: RequestUser): Promise<SafeUser> {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Usuário não encontrado.');

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name,
        email: dto.email?.trim().toLowerCase(),
        role: dto.role,
        status: dto.status,
      },
    });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'update',
      entityType: 'user',
      entityId: user.id,
      entityLabel: user.name,
    });

    return toSafeUser(user);
  }

  async remove(id: string, actor: RequestUser): Promise<void> {
    if (id === actor.id) {
      throw new ConflictException('Você não pode remover seu próprio usuário.');
    }
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Usuário não encontrado.');

    await this.prisma.user.delete({ where: { id } });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'delete',
      entityType: 'user',
      entityId: existing.id,
      entityLabel: existing.name,
    });
  }
}

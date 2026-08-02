import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { Patient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit.service';
import type { CreatePatientDto } from './dto/create-patient.dto';
import type { UpdatePatientDto } from './dto/update-patient.dto';
import type { RequestUser } from '../auth/jwt.strategy';

@Injectable()
export class PatientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  findAll(): Promise<Patient[]> {
    return this.prisma.patient.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreatePatientDto, actor: RequestUser): Promise<Patient> {
    const existing = await this.prisma.patient.findUnique({ where: { cpf: dto.cpf } });
    if (existing) throw new ConflictException('Já existe um paciente com este CPF.');

    const patient = await this.prisma.patient.create({
      data: {
        name: dto.name,
        cpf: dto.cpf,
        birthDate: new Date(dto.birthDate),
        phone: dto.phone,
        email: dto.email,
        sector: dto.sector,
        role: dto.role,
        admissionDate: new Date(dto.admissionDate),
        status: dto.status,
        notes: dto.notes,
      },
    });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'create',
      entityType: 'patient',
      entityId: patient.id,
      entityLabel: patient.name,
    });

    return patient;
  }

  async update(id: string, dto: UpdatePatientDto, actor: RequestUser): Promise<Patient> {
    const existing = await this.prisma.patient.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Paciente não encontrado.');

    const patient = await this.prisma.patient.update({
      where: { id },
      data: {
        name: dto.name,
        cpf: dto.cpf,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        phone: dto.phone,
        email: dto.email,
        sector: dto.sector,
        role: dto.role,
        admissionDate: dto.admissionDate ? new Date(dto.admissionDate) : undefined,
        status: dto.status,
        notes: dto.notes,
      },
    });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'update',
      entityType: 'patient',
      entityId: patient.id,
      entityLabel: patient.name,
    });

    return patient;
  }

  /** Soft delete (LGPD) — nunca apaga o registro fisicamente. */
  async remove(id: string, actor: RequestUser): Promise<void> {
    const existing = await this.prisma.patient.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Paciente não encontrado.');

    await this.prisma.patient.update({ where: { id }, data: { deletedAt: new Date() } });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'delete',
      entityType: 'patient',
      entityId: existing.id,
      entityLabel: existing.name,
    });
  }
}

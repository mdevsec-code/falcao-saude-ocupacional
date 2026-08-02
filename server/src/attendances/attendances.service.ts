import { Injectable, NotFoundException } from '@nestjs/common';
import type { Attendance, DutyFitness, Patient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit.service';
import type { CreateAttendanceDto } from './dto/create-attendance.dto';
import type { UpdateAttendanceDto } from './dto/update-attendance.dto';
import type { RequestUser } from '../auth/jwt.strategy';

type AttendanceWithRelations = Attendance & { patient: Patient; dutyFitness: DutyFitness[] };

/** Achata a relação com `Patient` em `patientName`, no formato que o
 * frontend já consome (`AttendanceRecord` do mock MSW). */
function toAttendanceRecord(record: AttendanceWithRelations) {
  const { patient, ...rest } = record;
  return { ...rest, patientName: patient.name };
}

@Injectable()
export class AttendancesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async findAll() {
    const records = await this.prisma.attendance.findMany({
      include: { patient: true, dutyFitness: true },
      orderBy: { attendanceDate: 'desc' },
    });
    return records.map(toAttendanceRecord);
  }

  async create(dto: CreateAttendanceDto, actor: RequestUser) {
    const patient = await this.prisma.patient.findFirst({
      where: { id: dto.patientId, deletedAt: null },
    });
    if (!patient) throw new NotFoundException('Paciente não encontrado.');

    const record = await this.prisma.attendance.create({
      data: {
        patientId: dto.patientId,
        examType: dto.examType,
        doctor: dto.doctor,
        conclusion: dto.conclusion,
        attendanceDate: new Date(dto.attendanceDate),
        restrictionNotes: dto.restrictionNotes,
        notes: dto.notes,
        dutyFitness: { create: dto.dutyFitness.map((d) => ({ duty: d.duty, fit: d.fit })) },
      },
      include: { patient: true, dutyFitness: true },
    });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'create',
      entityType: 'attendance',
      entityId: record.id,
      entityLabel: `${patient.name} — ${dto.examType}`,
    });

    return toAttendanceRecord(record);
  }

  async update(id: string, dto: UpdateAttendanceDto, actor: RequestUser) {
    const existing = await this.prisma.attendance.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Atendimento não encontrado.');

    const record = await this.prisma.attendance.update({
      where: { id },
      data: {
        patientId: dto.patientId,
        examType: dto.examType,
        doctor: dto.doctor,
        conclusion: dto.conclusion,
        attendanceDate: dto.attendanceDate ? new Date(dto.attendanceDate) : undefined,
        restrictionNotes: dto.restrictionNotes,
        notes: dto.notes,
        dutyFitness: dto.dutyFitness
          ? {
              deleteMany: {},
              create: dto.dutyFitness.map((d) => ({ duty: d.duty, fit: d.fit })),
            }
          : undefined,
      },
      include: { patient: true, dutyFitness: true },
    });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'update',
      entityType: 'attendance',
      entityId: record.id,
      entityLabel: `${record.patient.name} — ${record.examType}`,
    });

    return toAttendanceRecord(record);
  }

  async remove(id: string, actor: RequestUser): Promise<void> {
    const existing = await this.prisma.attendance.findUnique({
      where: { id },
      include: { patient: true },
    });
    if (!existing) throw new NotFoundException('Atendimento não encontrado.');

    await this.prisma.attendance.delete({ where: { id } });

    await this.audit.record({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'delete',
      entityType: 'attendance',
      entityId: existing.id,
      entityLabel: `${existing.patient.name} — ${existing.examType}`,
    });
  }
}

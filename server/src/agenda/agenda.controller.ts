import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Appointment } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import type { AuthenticatedRequest } from '../auth/jwt.strategy';
import { AgendaService } from './agenda.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('agenda')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  @Get()
  findAll(): Promise<Appointment[]> {
    return this.agendaService.findAll();
  }

  @Post()
  @Roles('ADMIN', 'MEDICO', 'ENFERMEIRO', 'RECEPCAO')
  create(
    @Body() dto: CreateAppointmentDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Appointment> {
    return this.agendaService.create(dto, req.user);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MEDICO', 'ENFERMEIRO', 'RECEPCAO')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Appointment> {
    return this.agendaService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MEDICO', 'ENFERMEIRO', 'RECEPCAO')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest): Promise<void> {
    return this.agendaService.remove(id, req.user);
  }
}

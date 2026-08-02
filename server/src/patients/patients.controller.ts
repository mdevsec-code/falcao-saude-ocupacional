import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Patient } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import type { AuthenticatedRequest } from '../auth/jwt.strategy';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  findAll(): Promise<Patient[]> {
    return this.patientsService.findAll();
  }

  @Post()
  @Roles('ADMIN', 'MEDICO', 'RECEPCAO')
  create(@Body() dto: CreatePatientDto, @Req() req: AuthenticatedRequest): Promise<Patient> {
    return this.patientsService.create(dto, req.user);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MEDICO', 'RECEPCAO')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Patient> {
    return this.patientsService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MEDICO', 'RECEPCAO')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest): Promise<void> {
    return this.patientsService.remove(id, req.user);
  }
}

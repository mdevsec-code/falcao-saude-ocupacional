import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import type { AuthenticatedRequest } from '../auth/jwt.strategy';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendances')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Get()
  findAll() {
    return this.attendancesService.findAll();
  }

  @Post()
  @Roles('ADMIN', 'MEDICO', 'ENFERMEIRO')
  create(@Body() dto: CreateAttendanceDto, @Req() req: AuthenticatedRequest) {
    return this.attendancesService.create(dto, req.user);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MEDICO', 'ENFERMEIRO')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAttendanceDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.attendancesService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MEDICO')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest): Promise<void> {
    return this.attendancesService.remove(id, req.user);
  }
}

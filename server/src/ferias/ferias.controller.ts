import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Vacation } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import type { AuthenticatedRequest } from '../auth/jwt.strategy';
import { FeriasService } from './ferias.service';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';

@Controller('ferias')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeriasController {
  constructor(private readonly feriasService: FeriasService) {}

  @Get()
  findAll(): Promise<Vacation[]> {
    return this.feriasService.findAll();
  }

  @Post()
  @Roles('ADMIN', 'RH')
  create(@Body() dto: CreateVacationDto, @Req() req: AuthenticatedRequest): Promise<Vacation> {
    return this.feriasService.create(dto, req.user);
  }

  @Patch(':id')
  @Roles('ADMIN', 'RH')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVacationDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Vacation> {
    return this.feriasService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles('ADMIN', 'RH')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest): Promise<void> {
    return this.feriasService.remove(id, req.user);
  }
}

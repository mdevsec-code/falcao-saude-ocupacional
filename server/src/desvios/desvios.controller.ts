import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Deviation } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import type { AuthenticatedRequest } from '../auth/jwt.strategy';
import { DesviosService } from './desvios.service';
import { CreateDeviationDto } from './dto/create-deviation.dto';
import { UpdateDeviationDto } from './dto/update-deviation.dto';

@Controller('desvios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DesviosController {
  constructor(private readonly desviosService: DesviosService) {}

  @Get()
  findAll(): Promise<Deviation[]> {
    return this.desviosService.findAll();
  }

  @Post()
  @Roles('ADMIN', 'TECNICO_SEGURANCA', 'GESTOR_SSO')
  create(@Body() dto: CreateDeviationDto, @Req() req: AuthenticatedRequest): Promise<Deviation> {
    return this.desviosService.create(dto, req.user);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TECNICO_SEGURANCA', 'GESTOR_SSO')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDeviationDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Deviation> {
    return this.desviosService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles('ADMIN', 'TECNICO_SEGURANCA', 'GESTOR_SSO')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest): Promise<void> {
    return this.desviosService.remove(id, req.user);
  }
}

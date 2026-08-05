import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { AccidentIndicator } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import type { AuthenticatedRequest } from '../auth/jwt.strategy';
import { IndicadoresService } from './indicadores.service';
import { CreateAccidentIndicatorDto } from './dto/create-accident-indicator.dto';
import { UpdateAccidentIndicatorDto } from './dto/update-accident-indicator.dto';

@Controller('indicadores')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IndicadoresController {
  constructor(private readonly indicadoresService: IndicadoresService) {}

  @Get()
  findAll(): Promise<AccidentIndicator[]> {
    return this.indicadoresService.findAll();
  }

  @Post()
  @Roles('ADMIN', 'TECNICO_SEGURANCA', 'GESTOR_SSO')
  create(
    @Body() dto: CreateAccidentIndicatorDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<AccidentIndicator> {
    return this.indicadoresService.create(dto, req.user);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TECNICO_SEGURANCA', 'GESTOR_SSO')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAccidentIndicatorDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<AccidentIndicator> {
    return this.indicadoresService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles('ADMIN', 'TECNICO_SEGURANCA', 'GESTOR_SSO')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest): Promise<void> {
    return this.indicadoresService.remove(id, req.user);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Atestado } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import type { AuthenticatedRequest } from '../auth/jwt.strategy';
import { AtestadosService } from './atestados.service';
import { CreateAtestadoDto } from './dto/create-atestado.dto';
import { UpdateAtestadoDto } from './dto/update-atestado.dto';

@Controller('atestados')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AtestadosController {
  constructor(private readonly atestadosService: AtestadosService) {}

  @Get()
  findAll(): Promise<Atestado[]> {
    return this.atestadosService.findAll();
  }

  @Post()
  @Roles('ADMIN', 'RH', 'RECEPCAO')
  create(@Body() dto: CreateAtestadoDto, @Req() req: AuthenticatedRequest): Promise<Atestado> {
    return this.atestadosService.create(dto, req.user);
  }

  @Patch(':id')
  @Roles('ADMIN', 'RH', 'RECEPCAO')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAtestadoDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Atestado> {
    return this.atestadosService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles('ADMIN', 'RH', 'RECEPCAO')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest): Promise<void> {
    return this.atestadosService.remove(id, req.user);
  }
}

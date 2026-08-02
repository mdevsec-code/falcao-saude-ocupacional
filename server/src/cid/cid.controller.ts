import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { CidCustomEntry } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/jwt.strategy';
import { CidService } from './cid.service';
import { CreateCidDto } from './dto/create-cid.dto';
import { UpdateCidDto } from './dto/update-cid.dto';

/**
 * Sem `@Roles(...)` nas mutações de propósito: o catálogo curado
 * (`constants/cid.ts` no frontend) permanece estático e não editável por
 * aqui; este recurso só cobre códigos adicionados manualmente, e o
 * frontend não restringe quem pode cadastrá-los (é uma referência clínica
 * compartilhada, não um dado sensível por paciente).
 */
@Controller('cid')
@UseGuards(JwtAuthGuard)
export class CidController {
  constructor(private readonly cidService: CidService) {}

  @Get()
  findAll(): Promise<CidCustomEntry[]> {
    return this.cidService.findAll();
  }

  @Post()
  create(@Body() dto: CreateCidDto, @Req() req: AuthenticatedRequest): Promise<CidCustomEntry> {
    return this.cidService.create(dto, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCidDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CidCustomEntry> {
    return this.cidService.update(id, dto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest): Promise<void> {
    return this.cidService.remove(id, req.user);
  }
}

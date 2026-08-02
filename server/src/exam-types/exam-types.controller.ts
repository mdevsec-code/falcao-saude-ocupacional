import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { ExamType } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import type { AuthenticatedRequest } from '../auth/jwt.strategy';
import { ExamTypesService } from './exam-types.service';
import { CreateExamTypeDto } from './dto/create-exam-type.dto';
import { UpdateExamTypeDto } from './dto/update-exam-type.dto';

@Controller('exam-types')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamTypesController {
  constructor(private readonly examTypesService: ExamTypesService) {}

  @Get()
  findAll(): Promise<ExamType[]> {
    return this.examTypesService.findAll();
  }

  @Post()
  @Roles('ADMIN', 'ENFERMEIRO')
  create(@Body() dto: CreateExamTypeDto, @Req() req: AuthenticatedRequest): Promise<ExamType> {
    return this.examTypesService.create(dto, req.user);
  }

  @Patch(':id')
  @Roles('ADMIN', 'ENFERMEIRO')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateExamTypeDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ExamType> {
    return this.examTypesService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest): Promise<void> {
    return this.examTypesService.remove(id, req.user);
  }
}

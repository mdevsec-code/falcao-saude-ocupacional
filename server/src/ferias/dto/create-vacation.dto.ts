import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { VacationStatus } from '@prisma/client';

export class CreateVacationDto {
  @IsString()
  @MinLength(3)
  patientName!: string;

  @IsString()
  sector!: string;

  @IsString()
  role!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsInt()
  @Min(1)
  days!: number;

  @IsEnum(VacationStatus)
  status!: VacationStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

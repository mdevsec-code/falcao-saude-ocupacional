import { IsDateString, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { DeviationClassification, DeviationStatus } from '@prisma/client';

export class CreateDeviationDto {
  @IsDateString()
  date!: string;

  @IsString()
  location!: string;

  @IsEnum(DeviationClassification)
  classification!: DeviationClassification;

  @IsString()
  @MinLength(5)
  description!: string;

  @IsOptional()
  @IsString()
  foreman?: string;

  @IsOptional()
  @IsString()
  responsibleTechnician?: string;

  @IsOptional()
  @IsString()
  action?: string;

  @IsEnum(DeviationStatus)
  status!: DeviationStatus;
}

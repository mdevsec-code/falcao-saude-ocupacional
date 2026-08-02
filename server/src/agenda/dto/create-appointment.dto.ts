import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
  @IsString()
  @MinLength(3)
  patientName!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  examType!: string;

  @IsString()
  doctor!: string;

  @IsEnum(AppointmentStatus)
  status!: AppointmentStatus;

  @IsDateString()
  startsAt!: string;

  @IsInt()
  @Min(10)
  @Max(240)
  durationMin!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

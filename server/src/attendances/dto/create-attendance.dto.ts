import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AppointmentConclusion } from '@prisma/client';
import { DutyFitnessDto } from './duty-fitness.dto';

export class CreateAttendanceDto {
  @IsString()
  patientId!: string;

  @IsString()
  examType!: string;

  @IsString()
  doctor!: string;

  @IsEnum(AppointmentConclusion)
  conclusion!: AppointmentConclusion;

  @IsDateString()
  attendanceDate!: string;

  @IsOptional()
  @IsString()
  restrictionNotes?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DutyFitnessDto)
  dutyFitness!: DutyFitnessDto[];
}

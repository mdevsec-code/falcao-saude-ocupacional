import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { PatientStatus } from '@prisma/client';

export class CreatePatientDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsString()
  @MinLength(11)
  cpf!: string;

  @IsDateString()
  birthDate!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  sector!: string;

  @IsString()
  role!: string;

  @IsDateString()
  admissionDate!: string;

  @IsEnum(PatientStatus)
  status!: PatientStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

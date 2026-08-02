import { IsBoolean, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateExamTypeDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  category!: string;

  @IsInt()
  @Min(5)
  defaultDurationMin!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  periodicityMonths?: number;

  @IsBoolean()
  active!: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}

import { IsDateString, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateAtestadoDto {
  @IsOptional()
  @IsString()
  ponto?: string;

  @IsString()
  @MinLength(3)
  nome!: string;

  @IsOptional()
  @IsString()
  funcao?: string;

  @IsOptional()
  @IsString()
  setor?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  qntDias?: number;

  @IsOptional()
  @IsString()
  cid?: string;

  @IsOptional()
  @IsDateString()
  inicioAtestado?: string;

  @IsOptional()
  @IsDateString()
  terminoAtestado?: string;

  @IsOptional()
  @IsDateString()
  dataLancamento?: string;

  @IsOptional()
  @IsString()
  competencia?: string;

  @IsOptional()
  @IsString()
  liderancaDireta?: string;

  @IsOptional()
  @IsString()
  observacao?: string;

  @IsOptional()
  @IsString()
  medico?: string;

  @IsOptional()
  @IsString()
  crmCro?: string;

  @IsOptional()
  @IsString()
  localAtendimento?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  slaLancamentoDias?: number;
}

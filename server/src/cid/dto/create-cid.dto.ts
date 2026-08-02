import { IsString, Matches, MinLength } from 'class-validator';

export class CreateCidDto {
  @IsString()
  @Matches(/^[A-Z]\d{2}(\.\d)?$/, { message: 'Use o formato CID-10, ex.: M54.5' })
  code!: string;

  @IsString()
  @MinLength(3)
  description!: string;

  @IsString()
  category!: string;
}

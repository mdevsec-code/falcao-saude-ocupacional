import { IsBoolean, IsString } from 'class-validator';

export class DutyFitnessDto {
  @IsString()
  duty!: string;

  @IsBoolean()
  fit!: boolean;
}

import { IsInt, Max, Min } from 'class-validator';

export class CreateAccidentIndicatorDto {
  @IsInt()
  @Min(2000)
  @Max(2100)
  year!: number;

  @IsInt()
  @Min(1)
  @Max(12)
  month!: number;

  @IsInt()
  @Min(0)
  employees!: number;

  @IsInt()
  @Min(0)
  accidentsWithLeave!: number;

  @IsInt()
  @Min(0)
  accidentsWithoutLeave!: number;

  @IsInt()
  @Min(0)
  daysLostAccidents!: number;

  @IsInt()
  @Min(0)
  daysDebited!: number;
}

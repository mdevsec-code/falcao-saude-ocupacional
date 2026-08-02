import { PartialType } from '@nestjs/mapped-types';
import { CreateDeviationDto } from './create-deviation.dto';

export class UpdateDeviationDto extends PartialType(CreateDeviationDto) {}

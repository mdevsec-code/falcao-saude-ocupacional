import { PartialType } from '@nestjs/mapped-types';
import { CreateAccidentIndicatorDto } from './create-accident-indicator.dto';

export class UpdateAccidentIndicatorDto extends PartialType(CreateAccidentIndicatorDto) {}

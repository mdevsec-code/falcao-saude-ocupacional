import { PartialType } from '@nestjs/mapped-types';
import { CreateAtestadoDto } from './create-atestado.dto';

export class UpdateAtestadoDto extends PartialType(CreateAtestadoDto) {}

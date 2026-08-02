import { PartialType } from '@nestjs/mapped-types';
import { CreateCidDto } from './create-cid.dto';

export class UpdateCidDto extends PartialType(CreateCidDto) {}

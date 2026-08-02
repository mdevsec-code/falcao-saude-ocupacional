import { PartialType } from '@nestjs/mapped-types';
import { CreateExamTypeDto } from './create-exam-type.dto';

export class UpdateExamTypeDto extends PartialType(CreateExamTypeDto) {}

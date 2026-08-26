import { IsOptional, IsString, MinLength } from 'class-validator';
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'] as const)) {
  /** Opcional — só enviar quando um admin estiver resetando a senha do usuário. */
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}

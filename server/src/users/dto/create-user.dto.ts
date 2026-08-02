import { IsEmail, IsEnum, IsIn, IsString, MinLength } from 'class-validator';
import { Role, UserStatus } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsEmail()
  email!: string;

  @IsEnum(Role)
  role!: Role;

  @IsIn(['active', 'inactive'])
  status!: UserStatus;

  /** Senha inicial — o usuário deve trocá-la no primeiro acesso (fluxo a implementar). */
  @IsString()
  @MinLength(12)
  password!: string;
}

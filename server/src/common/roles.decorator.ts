import { SetMetadata } from '@nestjs/common';
import type { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';

/** Restringe o endpoint aos perfis informados. Ex.: `@Roles('ADMIN')`. */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

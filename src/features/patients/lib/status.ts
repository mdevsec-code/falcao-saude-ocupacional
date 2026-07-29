import type { BadgeVariant } from '@/components/ui/Badge';
import type { PatientStatus } from '@/constants/status';

export const STATUS_BADGE_VARIANT: Record<PatientStatus, BadgeVariant> = {
  ativo: 'success',
  inativo: 'neutral',
  afastado: 'warning',
};

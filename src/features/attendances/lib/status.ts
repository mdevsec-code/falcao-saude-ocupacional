import type { BadgeVariant } from '@/components/ui/Badge';
import type { AppointmentConclusion } from '@/constants/status';

export const CONCLUSION_BADGE_VARIANT: Record<AppointmentConclusion, BadgeVariant> = {
  apto: 'success',
  apto_restricao: 'warning',
  inapto: 'danger',
  encaminhado: 'info',
};

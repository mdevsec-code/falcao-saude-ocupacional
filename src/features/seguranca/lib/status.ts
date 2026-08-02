import type { BadgeVariant } from '@/components/ui/Badge';
import type { DeviationStatus } from '@/constants/status';

export const DEVIATION_STATUS_BADGE_VARIANT: Record<DeviationStatus, BadgeVariant> = {
  pendente: 'danger',
  em_andamento: 'warning',
  concluido: 'success',
};

import type { BadgeVariant } from '@/components/ui/Badge';
import type { VacationStatus } from '@/constants/status';

export const STATUS_BADGE_VARIANT: Record<VacationStatus, BadgeVariant> = {
  agendado: 'neutral',
  em_andamento: 'brand',
  concluido: 'success',
  cancelado: 'danger',
};

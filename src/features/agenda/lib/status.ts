import type { BadgeVariant } from '@/components/ui/Badge';
import { APPOINTMENT_STATUS_LABELS, type AppointmentStatus } from '@/constants/status';

export { APPOINTMENT_STATUS_LABELS };

export const STATUS_BADGE_VARIANT: Record<AppointmentStatus, BadgeVariant> = {
  agendado: 'neutral',
  realizado: 'success',
  cancelado: 'warning',
  faltou: 'danger',
};

export const STATUS_CHIP_CLASSES: Record<AppointmentStatus, string> = {
  agendado: 'bg-brand-gold-50 text-brand-gold-900 border-brand-gold-300',
  realizado: 'bg-success/10 text-success border-success/30',
  cancelado: 'bg-neutral-100 text-ink-soft border-border line-through',
  faltou: 'bg-danger/10 text-danger border-danger/30',
};

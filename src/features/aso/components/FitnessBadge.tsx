import { useTranslation } from 'react-i18next';
import { Check, X, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FitnessBadgeProps {
  fit: boolean | undefined;
}

export function FitnessBadge({ fit }: FitnessBadgeProps) {
  const { t } = useTranslation('aso');

  if (fit === undefined) {
    return (
      <span
        className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-hover text-muted"
        title={t('aso:fitness.notEvaluated')}
        aria-label={t('aso:fitness.notEvaluated')}
      >
        <Minus className="h-3.5 w-3.5" />
      </span>
    );
  }

  return (
    <span
      className={cn(
        'mx-auto flex h-6 w-6 items-center justify-center rounded-full',
        fit ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger',
      )}
      title={fit ? t('aso:fitness.fit') : t('aso:fitness.unfit')}
      aria-label={fit ? t('aso:fitness.fit') : t('aso:fitness.unfit')}
    >
      {fit ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
    </span>
  );
}

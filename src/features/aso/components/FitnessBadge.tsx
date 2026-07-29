import { Check, X, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FitnessBadgeProps {
  fit: boolean | undefined;
}

export function FitnessBadge({ fit }: FitnessBadgeProps) {
  if (fit === undefined) {
    return (
      <span
        className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-hover text-muted"
        title="Não avaliado"
        aria-label="Não avaliado"
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
      title={fit ? 'Apto' : 'Inapto'}
      aria-label={fit ? 'Apto' : 'Inapto'}
    >
      {fit ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
    </span>
  );
}

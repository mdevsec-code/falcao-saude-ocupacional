import { type ReactNode } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/utils/cn';

export interface LoadingStateProps {
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({
  label = 'Carregando…',
  className,
  size = 'md',
}: LoadingStateProps): ReactNode {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex animate-fade-in flex-col items-center justify-center gap-3 py-10 text-ink-soft',
        className,
      )}
    >
      <Spinner size={size} />
      <p className="text-sm">{label}</p>
    </div>
  );
}

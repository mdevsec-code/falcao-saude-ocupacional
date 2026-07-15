import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface LabelProps extends HTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: ReactNode;
}

export function Label({ required, className, children, ...rest }: LabelProps) {
  return (
    <label className={cn('text-xs font-semibold text-ink-soft', className)} {...rest}>
      {children}
      {required && (
        <span aria-hidden="true" className="ml-0.5 text-danger">
          *
        </span>
      )}
    </label>
  );
}

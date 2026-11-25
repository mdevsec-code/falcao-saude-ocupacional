import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  inputClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, inputClassName, label, hint, error, id, rows = 4, ...rest }, ref) => {
    const inputId = id ?? `textarea-${rest.name ?? Math.random().toString(36).slice(2, 8)}`;

    return (
      <div className={cn('flex w-full flex-col gap-1.5', className)}>
        {label && (
          <label htmlFor={inputId} className="text-ink-soft text-xs font-semibold">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={cn(
            'bg-surface text-ink placeholder:text-muted w-full resize-y rounded-md border px-3 py-2 text-sm',
            'border-border duration-fast transition-[border-color,box-shadow]',
            'focus:border-brand-gold-500 focus:shadow-focus focus:outline-hidden',
            error && 'border-danger focus:border-danger focus:shadow-focus',
            rest.disabled && 'cursor-not-allowed opacity-60',
            inputClassName,
          )}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...rest}
        />

        {error ? (
          <p id={`${inputId}-error`} className="text-danger text-xs">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-ink-soft text-xs">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

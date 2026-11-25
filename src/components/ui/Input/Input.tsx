import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  inputClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputClassName, label, hint, error, leftIcon, rightIcon, id, ...rest }, ref) => {
    const inputId = id ?? `input-${rest.name ?? Math.random().toString(36).slice(2, 8)}`;

    return (
      <div className={cn('flex w-full flex-col gap-1.5', className)}>
        {label && (
          <label htmlFor={inputId} className="text-ink-soft text-xs font-semibold">
            {label}
          </label>
        )}

        <div
          className={cn(
            'group bg-surface flex h-10 w-full items-center gap-2 rounded-md border px-3',
            'duration-fast transition-[border-color,box-shadow]',
            'border-border',
            'focus-within:border-brand-gold-500 focus-within:shadow-focus',
            error && 'border-danger focus-within:border-danger focus-within:shadow-focus',
            rest.disabled && 'cursor-not-allowed opacity-60',
          )}
        >
          {leftIcon && <span className="text-ink-soft flex shrink-0 items-center">{leftIcon}</span>}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'text-ink placeholder:text-muted h-full w-full flex-1 bg-transparent text-sm',
              'focus:outline-hidden disabled:cursor-not-allowed',
              inputClassName,
            )}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...rest}
          />

          {rightIcon && (
            <span className="text-ink-soft flex shrink-0 items-center">{rightIcon}</span>
          )}
        </div>

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

Input.displayName = 'Input';

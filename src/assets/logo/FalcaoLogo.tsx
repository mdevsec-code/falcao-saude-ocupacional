import { type SVGProps } from 'react';

export type FalcaoLogoVariant = 'mark' | 'wordmark';

export interface FalcaoLogoProps extends SVGProps<SVGSVGElement> {
  /**
   * `mark` (padrão) — brandmark 40×40 com silhueta de falcão + "A".
   * `wordmark` — marca + wordmark "FALCÃO / SAÚDE OCUPACIONAL" (200×48).
   */
  variant?: FalcaoLogoVariant;
}

/**
 * Logo estilizada da Falcão Construções e Engenharia.
 * Inspirada na identidade enviada (preto + dourado).
 *
 * Lê-se como um "A" em tamanhos pequenos (sidebar) e revela a silhueta de
 * um falcão com asas abertas e bico em tamanhos maiores (login, marketing).
 */
export function FalcaoLogo({ variant = 'mark', className, ...rest }: FalcaoLogoProps) {
  if (variant === 'wordmark') {
    return (
      <svg
        viewBox="0 0 200 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Falcão · Saúde Ocupacional"
        {...rest}
      >
        {/* Brandmark (mesma composição da variante 'mark', escalada em 0–40) */}
        <g>
          <rect width="40" height="40" rx="10" fill="currentColor" />
          {/* Asas / "A" */}
          <path
            d="M8 32 L20 8 L32 32 M12 24 L28 24"
            stroke="rgb(var(--color-brand-gold-500))"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bico do falcão (curva partindo do apex para a direita) */}
          <path
            d="M20 8 Q26 11 27 16 Q24 16 21 14"
            stroke="rgb(var(--color-brand-gold-500))"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Âncora / olho */}
          <circle cx="20" cy="30" r="1.4" fill="rgb(var(--color-brand-gold-500))" />
        </g>

        {/* Wordmark */}
        <text
          x="50"
          y="24"
          fontFamily="var(--font-display)"
          fontSize="20"
          fontWeight="700"
          letterSpacing="0.04em"
          fill="currentColor"
        >
          FALCÃO
        </text>
        <text
          x="50"
          y="38"
          fontFamily="var(--font-sans)"
          fontSize="8.5"
          fontWeight="500"
          letterSpacing="0.22em"
          fill="currentColor"
          opacity="0.7"
        >
          SAÚDE OCUPACIONAL
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Falcão"
      {...rest}
    >
      {/* Container — currentColor deixa o parent controlar o tom */}
      <rect width="40" height="40" rx="10" fill="currentColor" />

      {/* Asas / "A" estilizado */}
      <path
        d="M8 32 L20 8 L32 32 M12 24 L28 24"
        stroke="rgb(var(--color-brand-gold-500))"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bico do falcão */}
      <path
        d="M20 8 Q26 11 27 16 Q24 16 21 14"
        stroke="rgb(var(--color-brand-gold-500))"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Âncora visual / olho */}
      <circle cx="20" cy="30" r="1.4" fill="rgb(var(--color-brand-gold-500))" />
    </svg>
  );
}

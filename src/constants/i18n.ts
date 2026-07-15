/**
 * Locales disponíveis. Adicione novos locales aqui e crie a pasta correspondente
 * em `src/i18n/locales/<locale>/` com seus namespaces.
 */
export const LOCALES = ['pt-BR', 'en-US'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'pt-BR';

export const NAMESPACES = ['common', 'auth', 'dashboard', 'validation', 'errors'] as const;

export type Namespace = (typeof NAMESPACES)[number];

export const localeLabels: Record<Locale, string> = {
  'pt-BR': 'Português (Brasil)',
  'en-US': 'English (United States)',
};

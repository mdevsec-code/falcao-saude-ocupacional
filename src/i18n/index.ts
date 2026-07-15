import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { env } from '@/config/env';
import { DEFAULT_LOCALE, NAMESPACES } from '@/constants/i18n';

import common from './locales/pt-BR/common.json';
import auth from './locales/pt-BR/auth.json';
import dashboard from './locales/pt-BR/dashboard.json';
import validation from './locales/pt-BR/validation.json';
import errors from './locales/pt-BR/errors.json';

const resources = {
  'pt-BR': { common, auth, dashboard, validation, errors },
} as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LOCALE,
    lng: env.VITE_DEFAULT_LOCALE,
    ns: NAMESPACES as unknown as string[],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
    react: { useSuspense: false },
  });

export default i18n;

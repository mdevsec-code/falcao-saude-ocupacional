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
import reports from './locales/pt-BR/reports.json';
import appointments from './locales/pt-BR/appointments.json';
import atestados from './locales/pt-BR/atestados.json';
import agenda from './locales/pt-BR/agenda.json';
import patients from './locales/pt-BR/patients.json';
import attendances from './locales/pt-BR/attendances.json';
import records from './locales/pt-BR/records.json';
import aso from './locales/pt-BR/aso.json';
import users from './locales/pt-BR/users.json';
import permissions from './locales/pt-BR/permissions.json';
import exams from './locales/pt-BR/exams.json';
import cid from './locales/pt-BR/cid.json';
import profile from './locales/pt-BR/profile.json';
import settings from './locales/pt-BR/settings.json';

const resources = {
  'pt-BR': {
    common,
    auth,
    dashboard,
    validation,
    errors,
    reports,
    appointments,
    atestados,
    agenda,
    patients,
    attendances,
    records,
    aso,
    users,
    permissions,
    exams,
    cid,
    profile,
    settings,
  },
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

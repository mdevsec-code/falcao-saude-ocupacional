/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_ENABLE_MSW: string;
  readonly VITE_DEFAULT_LOCALE: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/** Worker do MSW para o navegador. Inicializado condicionalmente em `main.tsx`. */
export const worker = setupWorker(...handlers);

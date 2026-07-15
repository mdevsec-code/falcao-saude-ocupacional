import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/** Server do MSW para ambiente Node (Vitest). */
export const server = setupServer(...handlers);

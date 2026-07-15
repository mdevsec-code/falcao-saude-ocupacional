import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/server';
import { resetAuthStorage } from './mocks/storage';

// Polyfill crypto.randomUUID para jsdom
import { webcrypto } from 'node:crypto';

if (typeof globalThis.crypto === 'undefined') {
  // @ts-expect-error — atribuindo polyfill
  globalThis.crypto = webcrypto;
}

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  resetAuthStorage();
});

afterAll(() => {
  server.close();
});

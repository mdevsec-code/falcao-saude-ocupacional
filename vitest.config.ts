/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    restoreMocks: true,
    clearMocks: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'coverage', '**/*.smoke.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      include: [
        'src/lib/**',
        'src/utils/**',
        'src/validators/**',
        'src/hooks/**',
        'src/services/http/**',
      ],
      exclude: ['**/*.test.{ts,tsx}', '**/*.d.ts', '**/index.ts'],
      // Thresholds realistas por globs — calibrados para a Etapa 2.
      // Cobertura por-glob incentiva qualidade onde ela já existe
      // (validators, hooks críticos) sem bloquear adições novas.
      thresholds: {
        'src/validators/**': {
          lines: 90,
          functions: 100,
          branches: 90,
          statements: 90,
        },
        'src/utils/cn.ts': {
          lines: 100,
          functions: 100,
          branches: 100,
          statements: 100,
        },
        'src/hooks/useDebounce.ts': {
          lines: 100,
          functions: 100,
          branches: 100,
          statements: 100,
        },
        'src/hooks/useDisclosure.ts': {
          lines: 100,
          functions: 100,
          branches: 100,
          statements: 100,
        },
      },
    },
  },
});

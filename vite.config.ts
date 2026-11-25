import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

const CHUNKS: Record<string, string[]> = {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'query-vendor': ['@tanstack/react-query', '@tanstack/react-query-devtools'],
  'radix-vendor': [
    '@radix-ui/react-avatar',
    '@radix-ui/react-checkbox',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-label',
    '@radix-ui/react-popover',
    '@radix-ui/react-radio-group',
    '@radix-ui/react-select',
    '@radix-ui/react-separator',
    '@radix-ui/react-slot',
    '@radix-ui/react-switch',
    '@radix-ui/react-tabs',
    '@radix-ui/react-toast',
    '@radix-ui/react-tooltip',
  ],
  'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
  'i18n-vendor': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
  'http-vendor': ['axios'],
  'export-vendor': ['jspdf', 'jspdf-autotable', 'exceljs'],
  icons: ['lucide-react'],
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    sourcemap: true,
    cssCodeSplit: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        // Vite 8 (Rolldown) aceita a divisão de pacotes só como função: mesmo agrupamento de antes.
        manualChunks(id) {
          const name = Object.entries(CHUNKS).find(([, pkgs]) =>
            pkgs.some((pkg) => id.includes(`/node_modules/${pkg}/`)),
          )?.[0];
          return name;
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
});

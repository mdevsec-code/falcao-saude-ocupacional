import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import { RuntimeErrorBoundary } from '@/app/RuntimeErrorBoundary';
import { env } from '@/config/env';
import '@/i18n';
import '@/styles/tailwind.css';

async function enableMocking(): Promise<void> {
  if (!env.VITE_ENABLE_MSW) return;
  const { worker } = await import('@/services/msw/browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: '/mockServiceWorker.js' },
  });
}

const container = document.getElementById('root');
if (!container) {
  throw new Error('Elemento #root não encontrado em index.html');
}

void enableMocking().then(() => {
  createRoot(container).render(
    <StrictMode>
      <RuntimeErrorBoundary>
        <App />
      </RuntimeErrorBoundary>
    </StrictMode>,
  );
});

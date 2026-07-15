import { type ReactElement, type ReactNode } from 'react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui';
import i18n from '@/i18n';

function makeTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Rota inicial em MemoryRouter. */
  initialRoute?: string;
  /** QueryClient customizado (default: novo por teste). */
  queryClient?: QueryClient;
  /** User event (default: já vem de `user` no retorno). */
  user?: ReturnType<typeof userEvent.setup>;
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {},
): RenderResult & { user: ReturnType<typeof userEvent.setup> } {
  const { initialRoute = '/', queryClient = makeTestQueryClient(), ...rest } = options;
  const user = userEvent.setup();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </I18nextProvider>
    );
  }

  const result = render(ui, { wrapper: Wrapper, ...rest });
  return { ...result, user };
}

import { type ReactNode } from 'react';
import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

interface RootBoundaryProps {
  children?: ReactNode;
}

/**
 * Boundary de erro global. Funciona como:
 *  - wrapper de layout (renderiza `children` quando não há erro);
 *  - estado de erro (mostra EmptyState quando o router entrega um erro).
 *
 * Hooks são chamados incondicionalmente (Rules of Hooks) e a decisão
 * de qual árvore renderizar é tomada pelo `if` abaixo, não por `children`.
 */
export function RootBoundary({ children }: RootBoundaryProps) {
  const error = useRouteError();

  if (!error) return <>{children}</>;

  const title = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText || 'Página não encontrada'}`
    : 'Algo deu errado';
  const description = isRouteErrorResponse(error)
    ? 'A rota solicitada não pôde ser carregada.'
    : error instanceof Error
      ? error.message
      : 'Não foi possível carregar essa página. Tente novamente ou volte para a tela inicial.';

  return (
    <div className="flex h-full min-h-screen items-center justify-center bg-bg p-6">
      <EmptyState
        icon={<AlertTriangle className="h-6 w-6" />}
        title={title}
        description={description}
        action={
          <Button asChild variant="primary">
            <Link to="/" replace>
              Voltar ao início
            </Link>
          </Button>
        }
      />
    </div>
  );
}

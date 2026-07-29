import { type ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Construction, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { ROUTE_PATHS } from '@/constants/routes';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  features?: string[];
  /** Conteúdo adicional exibido abaixo do cartão de "em construção". */
  children?: ReactNode;
}

const DEFAULT_FEATURES = [
  'Interface responsiva',
  'Acessibilidade AA',
  'Integração com a API',
  'Testes E2E',
];

export function PlaceholderPage({
  title,
  description = 'Este módulo está sendo preparado. A próxima etapa de implementação ativará esta área com dados, formulários e fluxos completos.',
  features = DEFAULT_FEATURES,
  children,
}: PlaceholderPageProps): ReactNode {
  // Mantém o título da aba coerente com o módulo
  useEffect(() => {
    document.title = `${title} · Falcão`;
    return () => {
      document.title = 'Falcão · Saúde Ocupacional';
    };
  }, [title]);

  return (
    <>
      <PageHeader
        eyebrow="Em construção"
        title={title}
        description={description}
        actions={
          <Button asChild variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            <Link to={ROUTE_PATHS.DASHBOARD}>Voltar ao início</Link>
          </Button>
        }
      />

      <div className="space-y-6 px-6 py-10 sm:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-xl border border-dashed border-border bg-surface p-10 text-center">
          <div
            aria-hidden="true"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold-50 text-brand-gold-700"
          >
            <Construction className="h-7 w-7" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">{title} chega em breve</h2>
            <p className="mt-2 text-sm text-ink-soft">{description}</p>
          </div>
          <ul className="grid grid-cols-1 gap-2 text-left text-sm text-ink-soft sm:grid-cols-2">
            {features.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-brand-gold-700" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {children}
      </div>
    </>
  );
}

export default PlaceholderPage;

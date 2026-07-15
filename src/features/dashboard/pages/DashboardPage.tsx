import { Calendar, Users, ClipboardCheck, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { PageHeader } from '@/components/layout/PageHeader';
import { StatTile } from '@/components/data-display/StatTile';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { Skeleton } from '@/components/ui/Skeleton';
import { useDashboardKpis } from '../hooks/useDashboardKpis';
import { ROUTE_PATHS } from '@/constants/routes';

const ICONS = {
  appointmentsToday: Calendar,
  waiting: Users,
  attendances: ClipboardCheck,
  pending: AlertCircle,
} as const;

export function DashboardPage() {
  const { t } = useTranslation('dashboard');
  const { data: kpis, isLoading, isError, refetch } = useDashboardKpis();

  return (
    <>
      <PageHeader
        eyebrow={t('dashboard:welcome.eyebrow')}
        title={t('dashboard:welcome.title')}
        description={t('dashboard:welcome.description')}
        actions={
          <Button asChild variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
            <Link to={ROUTE_PATHS.AGENDA}>{t('dashboard:welcome.openAgenda')}</Link>
          </Button>
        }
      />

      <div className="space-y-8 px-6 py-8 sm:px-8">
        <section
          aria-labelledby="kpi-title"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <h2 id="kpi-title" className="sr-only">
            Indicadores do dia
          </h2>

          {isLoading &&
            Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-[112px] w-full" />
            ))}

          {isError && (
            <div className="col-span-full rounded-md border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
              Não foi possível carregar os indicadores.{' '}
              <button onClick={() => void refetch()} className="underline">
                Tentar novamente
              </button>
            </div>
          )}

          {kpis?.map((kpi) => {
            const Icon = ICONS[kpi.id];
            return (
              <StatTile
                key={kpi.id}
                label={kpi.label}
                value={kpi.value}
                delta={kpi.trend}
                icon={<Icon className="h-4 w-4" />}
              />
            );
          })}
        </section>

        <Separator />

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{t('dashboard:roadmap.title')}</CardTitle>
                  <CardDescription>{t('dashboard:roadmap.description')}</CardDescription>
                </div>
                <Badge variant="brand" size="sm">
                  {t('dashboard:roadmap.badge')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <RoadmapItem
                current
                title={t('dashboard:roadmap.items.foundation.title')}
                description={t('dashboard:roadmap.items.foundation.description')}
              />
              <RoadmapItem
                title={t('dashboard:roadmap.items.auth.title')}
                description={t('dashboard:roadmap.items.auth.description')}
              />
              <RoadmapItem
                title={t('dashboard:roadmap.items.agenda.title')}
                description={t('dashboard:roadmap.items.agenda.description')}
              />
              <RoadmapItem
                title={t('dashboard:roadmap.items.clinical.title')}
                description={t('dashboard:roadmap.items.clinical.description')}
              />
              <RoadmapItem
                title={t('dashboard:roadmap.items.wrap.title')}
                description={t('dashboard:roadmap.items.wrap.description')}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard:identity.title')}</CardTitle>
              <CardDescription>{t('dashboard:identity.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-mono text-2xs uppercase tracking-wider text-ink-soft">
                  {t('dashboard:identity.primary')}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className="h-5 w-5 rounded border border-border"
                    style={{ background: 'rgb(var(--color-brand-gold-500))' }}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-xs">#C98A2B</span>
                </div>
              </div>
              <div>
                <p className="font-mono text-2xs uppercase tracking-wider text-ink-soft">
                  {t('dashboard:identity.accent')}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className="h-5 w-5 rounded border border-border"
                    style={{ background: 'rgb(var(--color-accent-500))' }}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-xs">#1B4B43</span>
                </div>
              </div>
              <div>
                <p className="font-mono text-2xs uppercase tracking-wider text-ink-soft">
                  {t('dashboard:identity.typography')}
                </p>
                <p className="mt-1 text-ink">Fraunces (display) · Inter (UI) · Plex Mono</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}

interface RoadmapItemProps {
  title: string;
  description: string;
  current?: boolean;
}

function RoadmapItem({ title, description, current }: RoadmapItemProps) {
  return (
    <div
      className={
        'flex items-start gap-3 rounded-md border p-3 ' +
        (current ? 'border-brand-gold-300 bg-brand-gold-50/60' : 'border-border bg-bg/40')
      }
    >
      <div
        aria-hidden="true"
        className={
          'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ' +
          (current ? 'bg-brand-gold-500 text-white' : 'bg-neutral-100 text-ink-soft')
        }
      >
        <Sparkles className="h-3 w-3" />
      </div>
      <div className="min-w-0">
        <p className={'text-sm font-semibold ' + (current ? 'text-brand-gold-900' : 'text-ink')}>
          {title}
        </p>
        <p className="mt-0.5 text-sm text-ink-soft">{description}</p>
      </div>
    </div>
  );
}

export default DashboardPage;

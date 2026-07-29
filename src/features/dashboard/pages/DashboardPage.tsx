import {
  Activity,
  ArrowRight,
  Calendar as CalendarIcon,
  CalendarDays,
  CalendarPlus,
  ClipboardCheck,
  ClipboardList,
  AlertCircle,
  BarChart3,
  FileText,
  FlaskConical,
  KeyRound,
  ShieldCheck,
  Stethoscope,
  Users,
  UserCog,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { PageHeader } from '@/components/layout/PageHeader';
import { StatTile } from '@/components/data-display/StatTile';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { useDashboardKpis } from '../hooks/useDashboardKpis';
import { useAppointments } from '@/features/agenda/hooks/useAppointments';
import { recordsOnDay } from '@/features/agenda/lib/calendar';
import { STATUS_BADGE_VARIANT, APPOINTMENT_STATUS_LABELS } from '@/features/agenda/lib/status';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PERMISSIONS } from '@/constants/permissions';
import { ROUTE_PATHS } from '@/constants/routes';

const ICONS = {
  appointmentsToday: CalendarIcon,
  waiting: Users,
  attendances: ClipboardCheck,
  pending: AlertCircle,
} as const;

const TIME_FMT = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });

interface QuickLink {
  label: string;
  description: string;
  to: string;
  icon: LucideIcon;
  requires?: (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
}

const QUICK_LINKS: QuickLink[] = [
  { label: 'Agenda', description: 'Calendário de consultas', to: ROUTE_PATHS.AGENDA, icon: CalendarDays },
  {
    label: 'Agendamentos',
    description: 'Lista do dia',
    to: ROUTE_PATHS.AGENDAMENTOS,
    icon: CalendarPlus,
  },
  { label: 'Pacientes', description: 'Cadastro de colaboradores', to: ROUTE_PATHS.PACIENTES, icon: Users },
  {
    label: 'Atendimentos',
    description: 'Consultas realizadas',
    to: ROUTE_PATHS.ATENDIMENTOS,
    icon: ClipboardList,
  },
  {
    label: 'Prontuários',
    description: 'Histórico por paciente',
    to: ROUTE_PATHS.PRONTUARIOS,
    icon: FileText,
  },
  { label: 'ASO', description: 'Aptidão por atividade', to: ROUTE_PATHS.ASO, icon: ShieldCheck },
  { label: 'Exames', description: 'Catálogo de exames', to: ROUTE_PATHS.EXAMES, icon: FlaskConical },
  { label: 'CID', description: 'Referência de códigos', to: ROUTE_PATHS.CID, icon: Stethoscope },
  { label: 'Atestados', description: 'Análise e indicadores', to: ROUTE_PATHS.ATESTADOS, icon: Activity },
  { label: 'Relatórios', description: 'Exportação e filtros', to: ROUTE_PATHS.RELATORIOS, icon: BarChart3 },
  {
    label: 'Usuários',
    description: 'Contas de acesso',
    to: ROUTE_PATHS.USUARIOS,
    icon: UserCog,
    requires: PERMISSIONS.USERS_MANAGE,
  },
  {
    label: 'Permissões',
    description: 'Matriz por perfil',
    to: ROUTE_PATHS.PERMISSOES,
    icon: KeyRound,
    requires: PERMISSIONS.USERS_MANAGE,
  },
  {
    label: 'Configurações',
    description: 'Sistema e notificações',
    to: ROUTE_PATHS.CONFIGURACOES,
    icon: Settings,
    requires: PERMISSIONS.SETTINGS_MANAGE,
  },
];

export function DashboardPage() {
  const { t } = useTranslation('dashboard');
  const { can } = useAuth();
  const { data: kpis, isLoading, isError, refetch } = useDashboardKpis();
  const { data: appointments, isLoading: agendaLoading } = useAppointments();

  const todayAppointments = recordsOnDay(appointments ?? [], new Date());
  const visibleLinks = QUICK_LINKS.filter((link) => !link.requires || can(link.requires));

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

        <section aria-labelledby="quick-links-title">
          <h2 id="quick-links-title" className="mb-4 text-sm font-semibold text-ink">
            Acesso rápido
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {visibleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group flex items-start gap-3 rounded-lg border border-border bg-surface p-4 transition-shadow duration-base hover:shadow-md"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-gold-50 text-brand-gold-700">
                  <link.icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink group-hover:text-brand-gold-700">
                    {link.label}
                  </span>
                  <span className="block truncate text-xs text-ink-soft">{link.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <Separator />

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>Agenda de hoje</CardTitle>
                  <CardDescription>
                    {new Intl.DateTimeFormat('pt-BR', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                    }).format(new Date())}
                  </CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                  <Link to={ROUTE_PATHS.AGENDA}>Ver agenda</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {agendaLoading && (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-14 w-full" />
                  ))}
                </div>
              )}

              {!agendaLoading && todayAppointments.length === 0 && (
                <EmptyState
                  title="Nenhuma consulta hoje"
                  description="A agenda de hoje está livre."
                  className="border-none bg-transparent py-8"
                />
              )}

              {!agendaLoading && todayAppointments.length > 0 && (
                <div className="space-y-2">
                  {todayAppointments.slice(0, 6).map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between gap-3 rounded-md border border-border bg-bg/40 px-3 py-2"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="font-mono text-xs font-semibold text-ink-soft">
                          {TIME_FMT.format(new Date(apt.startsAt))}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">{apt.patientName}</p>
                          <p className="truncate text-xs text-ink-soft">{apt.examType}</p>
                        </div>
                      </div>
                      <Badge variant={STATUS_BADGE_VARIANT[apt.status]} size="sm">
                        {APPOINTMENT_STATUS_LABELS[apt.status]}
                      </Badge>
                    </div>
                  ))}
                  {todayAppointments.length > 6 && (
                    <p className="pt-1 text-center text-xs text-ink-soft">
                      +{todayAppointments.length - 6} consulta(s) — veja a agenda completa
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Falcão Saúde Ocupacional</CardTitle>
              <CardDescription>Plataforma pronta para uso — dados de demonstração (MSW).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-soft">Consultas hoje</span>
                <span className="font-semibold text-ink">{todayAppointments.length}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-ink-soft">Módulos ativos</span>
                <span className="font-semibold text-ink">{visibleLinks.length}</span>
              </div>
              <Separator />
              <p className="text-xs text-ink-soft">
                Precisa de ajuda? Consulte o menu lateral ou fale com um administrador em
                Usuários.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}

export default DashboardPage;

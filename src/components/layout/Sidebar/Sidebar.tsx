import { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  CalendarPlus,
  Users,
  ClipboardList,
  FileText,
  Stethoscope,
  FlaskConical,
  ShieldCheck,
  BarChart3,
  Activity,
  Settings,
  UserCog,
  KeyRound,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { FalcaoLogo } from '@/assets/logo/FalcaoLogo';
import { useUIStore } from '@/store/uiStore';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTE_PATHS } from '@/constants/routes';
import { PERMISSIONS, type Permission } from '@/constants/permissions';

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  enabled: boolean;
  requires?: Permission;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    title: 'sidebar.overview',
    items: [
      { label: 'nav.dashboard', to: ROUTE_PATHS.DASHBOARD, icon: LayoutDashboard, enabled: true },
      { label: 'nav.agenda', to: ROUTE_PATHS.AGENDA, icon: CalendarDays, enabled: true },
    ],
  },
  {
    title: 'sidebar.attendance',
    items: [
      {
        label: 'nav.appointments',
        to: ROUTE_PATHS.AGENDAMENTOS,
        icon: CalendarPlus,
        enabled: true,
      },
      { label: 'nav.patients', to: ROUTE_PATHS.PACIENTES, icon: Users, enabled: true },
      {
        label: 'nav.attendances',
        to: ROUTE_PATHS.ATENDIMENTOS,
        icon: ClipboardList,
        enabled: true,
      },
      { label: 'nav.records', to: ROUTE_PATHS.PRONTUARIOS, icon: FileText, enabled: true },
    ],
  },
  {
    title: 'sidebar.clinical',
    items: [
      { label: 'nav.cid', to: ROUTE_PATHS.CID, icon: Stethoscope, enabled: true },
      { label: 'nav.exams', to: ROUTE_PATHS.EXAMES, icon: FlaskConical, enabled: true },
      { label: 'nav.aso', to: ROUTE_PATHS.ASO, icon: ShieldCheck, enabled: true },
    ],
  },
  {
    title: 'sidebar.management',
    items: [
      { label: 'nav.reports', to: ROUTE_PATHS.RELATORIOS, icon: BarChart3, enabled: true },
      { label: 'nav.atestados', to: ROUTE_PATHS.ATESTADOS, icon: Activity, enabled: true },
      {
        label: 'nav.users',
        to: ROUTE_PATHS.USUARIOS,
        icon: UserCog,
        enabled: true,
        requires: PERMISSIONS.USERS_MANAGE,
      },
      {
        label: 'nav.permissions',
        to: ROUTE_PATHS.PERMISSOES,
        icon: KeyRound,
        enabled: true,
        requires: PERMISSIONS.USERS_MANAGE,
      },
      {
        label: 'nav.settings',
        to: ROUTE_PATHS.CONFIGURACOES,
        icon: Settings,
        enabled: true,
        requires: PERMISSIONS.SETTINGS_MANAGE,
      },
    ],
  },
];

export function Sidebar(): ReactNode {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isCompact = isDesktop && collapsed;
  const { t } = useTranslation('common');

  return (
    <aside
      aria-label="Navegação principal"
      className={cn(
        'flex h-full flex-col border-r border-border bg-surface',
        isCompact ? 'w-[68px]' : 'w-64',
        'transition-[width] duration-base ease-out',
      )}
    >
      <div
        className={cn(
          'flex items-center gap-2.5 border-b border-border px-4 py-4',
          isCompact && 'justify-center px-2',
        )}
      >
        <FalcaoLogo className="h-9 w-auto shrink-0" bgClassName="rounded-md bg-neutral-0 p-1" />
        {!isCompact && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{t('app.shortName')}</p>
            <p className="truncate text-2xs uppercase tracking-wider text-ink-soft">
              {t('branding.health')}
            </p>
          </div>
        )}
      </div>

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-5">
          {SECTIONS.map((section) => (
            <li key={section.title}>
              {!isCompact && (
                <p className="mb-1.5 px-3 font-mono text-2xs uppercase tracking-[0.12em] text-ink-soft">
                  {t(section.title as never)}
                </p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <SidebarLink item={item} compact={isCompact} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      <div
        className={cn(
          'border-t border-border px-4 py-3 text-2xs text-ink-soft',
          isCompact && 'px-2 text-center',
        )}
      >
        {isCompact ? 'v0.2' : t('footer.version', { version: '0.2.0' })}
      </div>
    </aside>
  );
}

interface SidebarLinkProps {
  item: NavItem;
  compact: boolean;
}

function SidebarLink({ item, compact }: SidebarLinkProps): ReactNode {
  const { icon: Icon, label, to, enabled } = item;
  const { t } = useTranslation('common');
  const { can } = useAuth();

  const baseClasses = cn(
    'group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium',
    'transition-colors duration-fast',
    compact && 'justify-center px-2',
  );

  const labelText = t(label as never);

  if (!enabled || (item.requires && !can(item.requires))) {
    return (
      <div
        aria-disabled="true"
        className={cn(baseClasses, 'cursor-not-allowed text-ink-soft opacity-70')}
        title={t('sidebar.comingSoon')}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        {!compact && (
          <>
            <span className="flex-1 truncate">{labelText}</span>
            <Badge variant="outline" size="sm" className="text-2xs">
              {t('sidebar.comingSoon')}
            </Badge>
          </>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      end={to === ROUTE_PATHS.DASHBOARD}
      className={({ isActive }) =>
        cn(
          baseClasses,
          isActive ? 'bg-brand-gold-50 text-brand-gold-900' : 'text-ink hover:bg-hover',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn('h-4 w-4 shrink-0', isActive ? 'text-brand-gold-700' : 'text-ink-soft')}
            aria-hidden="true"
          />
          {!compact && <span className="flex-1 truncate">{labelText}</span>}
        </>
      )}
    </NavLink>
  );
}

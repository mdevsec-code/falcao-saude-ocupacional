import { type ReactNode, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
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
  Plane,
  ShieldAlert,
  Settings,
  UserCog,
  KeyRound,
  ScrollText,
  X,
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
      {
        label: 'nav.patients',
        to: ROUTE_PATHS.PACIENTES,
        icon: Users,
        enabled: true,
        requires: PERMISSIONS.PATIENT_READ,
      },
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
      {
        label: 'nav.cid',
        to: ROUTE_PATHS.CID,
        icon: Stethoscope,
        enabled: true,
        requires: PERMISSIONS.CID_READ,
      },
      { label: 'nav.exams', to: ROUTE_PATHS.EXAMES, icon: FlaskConical, enabled: true },
      {
        label: 'nav.aso',
        to: ROUTE_PATHS.ASO,
        icon: ShieldCheck,
        enabled: true,
        requires: PERMISSIONS.ASO_READ,
      },
      {
        label: 'nav.atestados',
        to: ROUTE_PATHS.ATESTADOS,
        icon: Activity,
        enabled: true,
        requires: PERMISSIONS.ATESTADO_READ,
      },
    ],
  },
  {
    title: 'sidebar.safety',
    items: [
      {
        label: 'nav.safety',
        to: ROUTE_PATHS.SEGURANCA,
        icon: ShieldAlert,
        enabled: true,
        requires: PERMISSIONS.DEVIATION_READ,
      },
    ],
  },
  {
    title: 'sidebar.hr',
    items: [
      {
        label: 'nav.vacation',
        to: ROUTE_PATHS.FERIAS,
        icon: Plane,
        enabled: true,
        requires: PERMISSIONS.EMPLOYEE_READ,
      },
    ],
  },
  {
    title: 'sidebar.reports',
    items: [
      { label: 'nav.reports', to: ROUTE_PATHS.RELATORIOS, icon: BarChart3, enabled: true },
      {
        label: 'nav.audit',
        to: ROUTE_PATHS.AUDITORIA,
        icon: ScrollText,
        enabled: true,
        requires: PERMISSIONS.AUDIT_READ,
      },
    ],
  },
  {
    title: 'sidebar.admin',
    items: [
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
  const mobileNavOpen = useUIStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isCompact = isDesktop && collapsed;
  const { t } = useTranslation('common');
  const mainNavAriaLabel = t('sidebar.mainNavAriaLabel');
  const { pathname } = useLocation();

  // Fecha o drawer automaticamente ao navegar (evita ficar aberto sobre a nova página).
  useEffect(() => {
    if (!isDesktop) setMobileNavOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const onNavigate = !isDesktop ? () => setMobileNavOpen(false) : undefined;

  if (!isDesktop) {
    return (
      <DialogPrimitive.Root open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay
            className={cn(
              'z-modal-backdrop fixed inset-0 bg-neutral-900/50 backdrop-blur-xs',
              'data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
            )}
          />
          <DialogPrimitive.Content
            className={cn(
              'z-modal fixed inset-y-0 left-0 flex h-full w-72 max-w-[85vw] flex-col',
              'border-r border-[#2a2b2f] bg-[#0b0b0c] shadow-lg focus:outline-hidden',
              'data-[state=closed]:animate-slide-out-left data-[state=open]:animate-slide-in-left',
            )}
          >
            <DialogPrimitive.Title className="sr-only">{t('app.shortName')}</DialogPrimitive.Title>
            <DialogPrimitive.Close
              className="focus-visible:shadow-focus absolute top-3 right-3 z-10 rounded-md p-1.5 text-[#5d5e64] hover:bg-black/5 hover:text-[#0b0b0c] focus:outline-hidden"
              aria-label={t('actions.close')}
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
            <SidebarBody isCompact={false} onNavigate={onNavigate} />
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
  }

  return (
    <aside
      aria-label={mainNavAriaLabel}
      className={cn(
        'flex h-full min-h-0 flex-col border-r border-[#2a2b2f] bg-[#0b0b0c] bg-[radial-gradient(120%_60%_at_0%_100%,rgb(254_190_2/0.10),transparent_60%)]',
        isCompact ? 'w-[68px]' : 'w-64',
        'duration-base transition-[width] ease-out',
      )}
    >
      <SidebarBody isCompact={isCompact} />
    </aside>
  );
}

interface SidebarBodyProps {
  isCompact: boolean;
  onNavigate?: () => void;
}

function SidebarBody({ isCompact, onNavigate }: SidebarBodyProps): ReactNode {
  const { t } = useTranslation('common');

  return (
    <>
      <div
        className={cn(
          'relative z-10 mb-6 flex h-16 shrink-0 items-center gap-2.5 bg-white px-5',
          'before:pointer-events-none before:absolute before:inset-x-0 before:top-full before:h-12 before:bg-[linear-gradient(to_bottom,rgb(255_255_255)_0%,rgb(255_255_255/0.55)_18%,rgb(255_255_255/0.22)_42%,rgb(255_255_255/0.07)_70%,transparent_100%)]',
          'after:pointer-events-none after:absolute after:inset-x-6 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-[#febe02] after:to-transparent',
          isCompact && 'justify-center px-2',
        )}
      >
        <FalcaoLogo className="h-9 w-auto shrink-0" bgClassName="rounded-md bg-neutral-0 p-1" />
        {!isCompact && (
          <div className="min-w-0">
            <p className="font-display truncate text-xl leading-none font-semibold text-[#0b0b0c]">
              {t('app.shortName')}
            </p>
            <p className="mt-1 truncate text-[10px] font-medium tracking-[0.18em] text-[#5d5e64] uppercase">
              {t('branding.health')}
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 scrollbar-thin overflow-y-auto px-3 pb-4">
        <ul className="space-y-5">
          {SECTIONS.map((section) => (
            <li key={section.title}>
              {!isCompact && (
                <p className="mb-2 px-3 text-[10.5px] font-medium tracking-[0.16em] text-[#a3a6ab]/55 uppercase">
                  {t(section.title as never)}
                </p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <SidebarLink item={item} compact={isCompact} onNavigate={onNavigate} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      <div
        className={cn(
          'text-2xs border-t border-[#2a2b2f] px-4 py-3 text-[#a3a6ab]/60',
          isCompact && 'px-2 text-center',
        )}
      >
        {isCompact ? 'v0.2' : t('footer.version', { version: '0.2.0' })}
      </div>
    </>
  );
}

interface SidebarLinkProps {
  item: NavItem;
  compact: boolean;
  onNavigate?: () => void;
}

function SidebarLink({ item, compact, onNavigate }: SidebarLinkProps): ReactNode {
  const { icon: Icon, label, to, enabled } = item;
  const { t } = useTranslation('common');
  const { can } = useAuth();

  const baseClasses = cn(
    'group flex h-10 items-center gap-3 rounded-sm px-3 text-[14.5px]',
    'transition-colors duration-fast',
    compact && 'justify-center px-2',
  );

  const labelText = t(label as never);

  if (!enabled || (item.requires && !can(item.requires))) {
    return (
      <div
        aria-disabled="true"
        className={cn(baseClasses, 'cursor-not-allowed text-[#a3a6ab] opacity-50')}
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
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(baseClasses, 'relative', isActive ? 'text-white' : 'text-[#a3a6ab] hover:text-white')
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="sidebar-active-pill"
              className="absolute inset-0 rounded-sm bg-gradient-to-r from-white/[0.09] to-white/[0.04] ring-1 ring-white/[0.07] ring-inset before:absolute before:inset-y-2.5 before:-left-px before:w-[3px] before:rounded-r-full before:bg-[#febe02] before:shadow-[0_0_14px_2px_rgb(254_190_2/0.45)]"
              transition={{ type: 'spring', stiffness: 500, damping: 34, mass: 0.9 }}
            />
          )}
          <Icon
            className={cn(
              'relative h-4 w-4 shrink-0',
              isActive
                ? 'text-[#febe02]'
                : 'text-[#a3a6ab] transition-transform duration-300 group-hover:scale-110 group-hover:text-white',
            )}
            aria-hidden="true"
          />
          {!compact && <span className="relative flex-1 truncate">{labelText}</span>}
        </>
      )}
    </NavLink>
  );
}

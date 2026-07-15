import { type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Bell, ChevronsLeft, ChevronsRight, LogOut } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useUIStore } from '@/store/uiStore';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTE_PATHS } from '@/constants/routes';
import { getInitials } from '@/utils/format';
import { cn } from '@/utils/cn';

function useBreadcrumb() {
  const { pathname } = useLocation();
  const { t } = useTranslation('common');
  const label = t(`nav.${pathname.replace(/^\//, '') || 'dashboard'}` as never, '');
  return [{ label: label || pathname, href: pathname }];
}

export function Topbar(): ReactNode {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const crumbs = useBreadcrumb();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggle = useUIStore((s) => s.toggleSidebar);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { user, isAuthenticated, signOut } = useAuth();

  async function handleSignOut(): Promise<void> {
    await signOut();
    navigate(ROUTE_PATHS.LOGIN);
  }

  return (
    <header
      className={cn(
        'z-sticky sticky top-0 flex items-center gap-3 border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-md sm:px-6',
      )}
    >
      {isDesktop && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </Button>
      )}

      <nav aria-label="Trilha de navegação" className="hidden min-w-0 sm:block">
        <ol className="flex items-center gap-1.5 text-sm text-ink-soft">
          <li>
            <Link to="/" className="hover:text-ink">
              {t('nav.home')}
            </Link>
          </li>
          {crumbs
            .filter((c) => c.href !== '/')
            .map((c) => (
              <li key={c.href} className="flex items-center gap-1.5">
                <span aria-hidden="true" className="text-muted">
                  /
                </span>
                <span className="truncate font-medium text-ink">{c.label}</span>
              </li>
            ))}
        </ol>
      </nav>

      <span className="font-display text-base font-semibold text-ink sm:hidden">Falcão</span>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden w-72 lg:block">
          <Input
            placeholder="Buscar paciente, CID, matrícula…"
            leftIcon={<Search className="h-4 w-4" />}
            aria-label="Busca global"
            disabled
            hint="Disponível nas próximas etapas"
          />
        </div>

        <Button variant="ghost" size="icon" aria-label="Notificações">
          <Bell className="h-4 w-4" />
        </Button>

        <ThemeToggle />

        {isAuthenticated && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void handleSignOut()}
            leftIcon={<LogOut className="h-4 w-4" />}
          >
            Sair
          </Button>
        )}

        <Avatar className="ml-1">
          <AvatarFallback>{getInitials(user?.name ?? 'Falcão')}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

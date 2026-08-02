import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bell, ChevronsLeft, ChevronsRight, LogOut, Menu, Search, X } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { GlobalSearch } from './GlobalSearch';
import { useUIStore } from '@/store/uiStore';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTE_PATHS, ROUTE_NAV_KEYS } from '@/constants/routes';
import { getInitials } from '@/utils/format';
import { cn } from '@/utils/cn';

function useBreadcrumb() {
  const { pathname } = useLocation();
  const { t } = useTranslation('common');
  const navKey = ROUTE_NAV_KEYS[pathname as keyof typeof ROUTE_NAV_KEYS];
  const label = navKey ? t(`nav.${navKey}` as never) : pathname;
  return [{ label, href: pathname }];
}

export function Topbar(): ReactNode {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const crumbs = useBreadcrumb();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggle = useUIStore((s) => s.toggleSidebar);
  const toggleMobileNav = useUIStore((s) => s.toggleMobileNav);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { user, isAuthenticated, signOut } = useAuth();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  async function handleSignOut(): Promise<void> {
    await signOut();
    navigate(ROUTE_PATHS.LOGIN);
  }

  if (!isDesktop && mobileSearchOpen) {
    return (
      <header className="sticky top-0 z-sticky flex items-center gap-2 border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-md">
        <div className="flex-1">
          <GlobalSearch focusOnMount />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileSearchOpen(false)}
          aria-label={t('topbar.closeSearch')}
        >
          <X className="h-4 w-4" />
        </Button>
      </header>
    );
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-sticky flex items-center gap-3 border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-md sm:px-6',
      )}
    >
      {isDesktop ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          aria-label={collapsed ? t('topbar.expandMenu') : t('topbar.collapseMenu')}
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileNav}
          aria-label={t('topbar.openMenu')}
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}

      <nav aria-label={t('breadcrumb.ariaLabel')} className="hidden min-w-0 sm:block">
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
          <GlobalSearch />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileSearchOpen(true)}
          aria-label={t('actions.search')}
        >
          <Search className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" aria-label={t('topbar.notifications')}>
          <Bell className="h-4 w-4" />
        </Button>

        <LanguageSwitcher />

        <ThemeToggle />

        {isAuthenticated && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void handleSignOut()}
            leftIcon={<LogOut className="h-4 w-4" />}
            aria-label={t('topbar.signOut')}
          >
            <span className="hidden sm:inline">{t('topbar.signOut')}</span>
          </Button>
        )}

        <Link to={ROUTE_PATHS.PERFIL} aria-label={t('topbar.viewProfile')} className="ml-1">
          <Avatar>
            <AvatarFallback>{getInitials(user?.name ?? 'Falcão')}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}

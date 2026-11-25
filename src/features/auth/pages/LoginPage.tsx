import { useEffect, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  AlertTriangle,
  Stethoscope,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { toast } from 'sonner';

import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Label } from '@/components/ui/Label';
import { FalcaoLogo } from '@/assets/logo/FalcaoLogo';
import { brand } from '@/config/brand';
import { env } from '@/config/env';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, type LoginInput } from '../types';
import { ROUTE_PATHS } from '@/constants/routes';

interface LocationState {
  from?: string;
}

/** Ícone oficial de 4 quadrados da Microsoft, usado no botão "Entrar com Microsoft". */
function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1" y="1" width="6.5" height="6.5" fill="#F25022" />
      <rect x="8.5" y="1" width="6.5" height="6.5" fill="#7FBA00" />
      <rect x="1" y="8.5" width="6.5" height="6.5" fill="#00A4EF" />
      <rect x="8.5" y="8.5" width="6.5" height="6.5" fill="#FFB900" />
    </svg>
  );
}

interface FeedItem {
  title: string;
  detail: string;
  time: string;
}

function greetingKey(): 'morning' | 'afternoon' | 'evening' {
  const h = new Date().getHours();
  return h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
}

/** Três cartões de atividade que giram a cada ~3,8 s (parado se o usuário pede menos movimento). */
function LiveFeed({ items }: { items: FeedItem[] }) {
  const reduce = useReducedMotion();
  const [start, setStart] = useState(0);
  useEffect(() => {
    if (reduce || items.length <= 3) return;
    const id = window.setInterval(() => setStart((s) => (s + 1) % items.length), 3800);
    return () => window.clearInterval(id);
  }, [reduce, items.length]);
  const visible = [0, 1, 2]
    .map((i) => items[(start + i) % items.length])
    .filter((x): x is FeedItem => Boolean(x));

  return (
    <ul className="relative my-10 flex max-w-md flex-col gap-3">
      <AnimatePresence initial={false} mode="popLayout">
        {visible.map((item, i) => (
          <motion.li
            key={item.title}
            layout
            initial={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
            animate={{ opacity: 1 - i * 0.22, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="bg-surface flex items-center gap-3 rounded-xl px-4 py-3 shadow-sm ring-1 ring-black/5 dark:ring-white/10"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#fff6d6] text-[#6b4e00]">
              <Stethoscope className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="text-ink block text-sm font-medium">{item.title}</span>
              <span className="text-ink-soft block truncate text-xs">{item.detail}</span>
            </span>
            <span className="text-muted text-2xs shrink-0">{item.time}</span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

export function LoginPage(): ReactNode {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isAuthenticated } = useAuth();
  const { t } = useTranslation(['auth', 'common', 'validation']);
  const sidePanelRoles = t('auth:login.sidePanel.roles', { returnObjects: true }) as string[];
  const feed = t('auth:login.sidePanel.feed', { returnObjects: true }) as FeedItem[];

  // Para onde ir depois de autenticar: a página que o usuário tentava
  // acessar antes de ser redirecionado ao login (`RequireAuth`), ou o
  // Dashboard se ele chegou aqui diretamente. Nunca volta para `/login`
  // (evita loop caso `from` aponte para a própria tela de login).
  const state = location.state as LocationState | null;
  const redirectTo =
    state?.from && state.from !== ROUTE_PATHS.LOGIN ? state.from : ROUTE_PATHS.DASHBOARD;

  const [credentialsError, setCredentialsError] = useState<string | null>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  function handlePasswordKeyEvent(event: KeyboardEvent<HTMLInputElement>) {
    setCapsLockOn(event.getModifierState('CapsLock'));
  }

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- redirectTo é estável durante o ciclo de vida da tela de login
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('error') === 'sso_failed') {
      toast.error(t('auth:login.sso.failed'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- roda só na montagem, lendo a query string atual
  }, []);

  function handleMicrosoftSignIn() {
    window.location.href = `${env.VITE_API_URL}/auth/microsoft`;
  }

  async function attemptSignIn(email: string, password: string, rememberMe: boolean) {
    setCredentialsError(null);
    const result = await signIn(email, password, rememberMe);
    if (!result.ok) {
      setCredentialsError(result.error);
      toast.error(result.error);
      return;
    }
    navigate(redirectTo, { replace: true });
  }

  const onSubmit = handleSubmit((data) =>
    attemptSignIn(data.email, data.password, data.rememberMe),
  );

  return (
    <div className="bg-surface dark:bg-bg grid min-h-screen grid-cols-1 gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      {/* ────────── Esquerda: formulário ────────── */}
      <main className="relative flex flex-col px-4 py-6 sm:px-10">
        <header className="flex items-center justify-between">
          <FalcaoLogo variant="wordmark" className="h-9 w-auto" />
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <p className="text-ink-soft text-xs font-semibold tracking-[0.18em] uppercase">
            {t('auth:login.sidePanel.title')}
          </p>
          <h1 className="text-ink mt-3 font-serif text-[2.6rem] leading-[1.05] tracking-tight">
            {t(`auth:login.greeting.${greetingKey()}`)}
          </h1>
          <p className="text-ink-soft mt-2 text-sm">{t('auth:login.subtitle')}</p>
          <div className="mt-8">
            <form onSubmit={onSubmit} noValidate className="space-y-4">
              <div
                className="animate-slide-up"
                style={{ animationDelay: '60ms', animationFillMode: 'backwards' }}
              >
                <Input
                  {...register('email')}
                  type="email"
                  label={t('auth:login.fields.email')}
                  placeholder={t('auth:login.fields.emailPlaceholder')}
                  autoComplete="email"
                  leftIcon={<Mail className="h-4 w-4" />}
                  error={errors.email?.message}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div
                className="animate-slide-up"
                style={{ animationDelay: '110ms', animationFillMode: 'backwards' }}
              >
                <Input
                  {...register('password')}
                  type={showPwd ? 'text' : 'password'}
                  label={t('auth:login.fields.password')}
                  placeholder={t('auth:login.fields.passwordPlaceholder')}
                  autoComplete="current-password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  onKeyDown={handlePasswordKeyEvent}
                  onKeyUp={handlePasswordKeyEvent}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      aria-label={
                        showPwd
                          ? t('auth:login.actions.hidePassword')
                          : t('auth:login.actions.showPassword')
                      }
                      aria-pressed={showPwd}
                      className="text-ink-soft hover:text-ink focus-visible:text-ink transition-colors focus:outline-hidden"
                    >
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  error={errors.password?.message}
                  disabled={isSubmitting}
                  required
                />
                {capsLockOn && (
                  <p className="animate-slide-up text-warning mt-1.5 flex items-center gap-1.5 text-xs">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {t('auth:login.fields.capsLockWarning')}
                  </p>
                )}
              </div>

              <div
                className="animate-slide-up flex items-center justify-between"
                style={{ animationDelay: '160ms', animationFillMode: 'backwards' }}
              >
                <Label className="text-ink-soft flex items-center gap-2 font-normal">
                  <Controller
                    control={control}
                    name="rememberMe"
                    render={({ field }) => (
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                  {t('auth:login.fields.rememberMe')}
                </Label>

                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto px-0 text-xs"
                  onClick={() => toast.info(t('auth:login.actions.forgotPasswordUnavailable'))}
                >
                  {t('auth:login.actions.forgotPassword')}
                </Button>
              </div>

              {credentialsError && (
                <p
                  role="alert"
                  className="animate-slide-up border-danger/30 bg-danger/5 text-danger rounded-md border px-3 py-2 text-xs"
                >
                  {credentialsError}
                </p>
              )}

              <div
                className="animate-slide-up"
                style={{ animationDelay: '210ms', animationFillMode: 'backwards' }}
              >
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                  leftIcon={!isSubmitting ? <LogIn className="h-4 w-4" /> : undefined}
                >
                  {t('auth:login.actions.submit')}
                </Button>
              </div>
            </form>

            {env.VITE_ENABLE_MICROSOFT_SSO && (
              <>
                <div
                  className="animate-slide-up mt-5 flex items-center gap-3"
                  style={{ animationDelay: '250ms', animationFillMode: 'backwards' }}
                >
                  <span className="bg-border h-px flex-1" />
                  <span className="text-2xs text-ink-soft tracking-wider uppercase">
                    {t('auth:login.sso.divider')}
                  </span>
                  <span className="bg-border h-px flex-1" />
                </div>

                <div
                  className="animate-slide-up mt-4"
                  style={{ animationDelay: '280ms', animationFillMode: 'backwards' }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    fullWidth
                    onClick={handleMicrosoftSignIn}
                    leftIcon={<MicrosoftIcon />}
                  >
                    {t('auth:login.sso.button')}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="text-2xs text-muted relative mt-6">{brand.copyright}</p>
      </main>

      {/* ────────── Direita: painel com feed ao vivo (apenas ≥lg) ────────── */}
      <aside
        aria-hidden="true"
        className="relative hidden overflow-hidden rounded-2xl bg-[#eef0f3] p-10 lg:flex lg:flex-col lg:justify-between xl:p-14 dark:bg-[#151618]"
      >
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgb(254 190 2 / 0.22), transparent 70%)' }}
        />
        <div className="relative max-w-md">
          <p className="text-ink font-serif text-4xl leading-[1.1] tracking-tight xl:text-5xl">
            {t('auth:login.sidePanel.tagline')}
          </p>
          <p className="text-ink-soft mt-4 text-sm">{t('auth:login.sidePanel.subtitle')}</p>
        </div>

        <LiveFeed items={feed} />

        <div className="text-ink-soft relative flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t('auth:login.sidePanel.compliance')}
          </span>
          <span className="opacity-70">{sidePanelRoles.join(' · ')}</span>
        </div>
      </aside>
    </div>
  );
}

export default LoginPage;

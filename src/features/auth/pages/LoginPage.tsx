import { useEffect, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Label } from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { FalcaoLogo } from '@/assets/logo/FalcaoLogo';
import falcaoMark from '@/assets/logo/falcao-mark.png';
import { brand } from '@/config/brand';
import { ROLE_LABELS } from '@/constants/roles';
import { DEMO_USERS } from '@/services/msw/fixtures/users';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, type LoginInput } from '../types';
import { ROUTE_PATHS } from '@/constants/routes';

const DEMO_PASSWORD = 'admin123';
const ACTIVE_DEMO_USERS = DEMO_USERS.filter((u) => u.status === 'active');

export function LoginPage(): ReactNode {
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuth();
  const { t } = useTranslation(['auth', 'common', 'validation']);

  const [credentialsError, setCredentialsError] = useState<string | null>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [isQuickLoggingIn, setIsQuickLoggingIn] = useState(false);
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
      navigate(ROUTE_PATHS.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function attemptSignIn(email: string, password: string, rememberMe: boolean) {
    setCredentialsError(null);
    const result = await signIn(email, password, rememberMe);
    if (!result.ok) {
      setCredentialsError(result.error);
      toast.error(result.error);
      return;
    }
    navigate(ROUTE_PATHS.DASHBOARD, { replace: true });
  }

  const onSubmit = handleSubmit((data) =>
    attemptSignIn(data.email, data.password, data.rememberMe),
  );

  async function handleQuickLogin(email: string) {
    setIsQuickLoggingIn(true);
    await attemptSignIn(email, DEMO_PASSWORD, true);
    setIsQuickLoggingIn(false);
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* ────────── Esquerda: painel decorativo (apenas ≥lg) ────────── */}
      <aside
        aria-hidden="true"
        className="relative hidden overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-900 to-brand-gold-900 p-10 lg:flex lg:flex-col lg:justify-between xl:p-12"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 30% 30%, rgb(var(--color-brand-gold-500) / 0.18), transparent 70%)',
          }}
        />

        <img
          src={falcaoMark}
          alt=""
          className="pointer-events-none absolute -bottom-16 -right-16 h-[26rem] w-auto object-contain opacity-[0.07] grayscale invert"
        />

        <FalcaoLogo
          variant="wordmark"
          className="relative h-16 w-auto max-w-[280px] animate-fade-in"
          bgClassName="rounded-lg bg-white p-3 shadow-md ring-1 ring-black/5"
        />

        <div className="relative animate-slide-up space-y-4">
          <div className="space-y-2">
            <p className="font-display text-2xl font-semibold text-white">
              {t('auth:login.sidePanel.title')}
            </p>
            <p className="max-w-sm text-sm text-white/70">{t('auth:login.sidePanel.tagline')}</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {brand.roles.map((role) => (
              <span
                key={role}
                className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-2xs font-medium text-white/80 backdrop-blur-sm"
              >
                {role}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-white/50">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span>{t('auth:login.sidePanel.compliance')}</span>
          </div>
        </div>
      </aside>

      {/* ────────── Direita: formulário ────────── */}
      <main className="relative flex flex-col items-center justify-center overflow-hidden bg-bg px-4 py-10 sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(50% 40% at 50% 0%, rgb(var(--color-brand-gold-500) / 0.08), transparent 70%)',
          }}
        />

        <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
          <ThemeToggle />
        </div>

        <Card className="relative w-full max-w-md animate-scale-in overflow-hidden border-border shadow-md">
          <CardHeader className="items-center text-center">
            <FalcaoLogo
              className="h-12 w-auto"
              bgClassName="rounded-md bg-white p-1.5 shadow-sm ring-1 ring-border"
            />
            <CardTitle className="mt-3">{t('auth:login.title')}</CardTitle>
            <CardDescription>{t('auth:login.subtitle')}</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit} noValidate className="space-y-4">
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

              <div>
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
                      className="text-ink-soft hover:text-ink focus:outline-none focus-visible:text-ink"
                    >
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  error={errors.password?.message}
                  disabled={isSubmitting}
                  required
                />
                {capsLockOn && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-warning">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    Caps Lock está ativado.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 font-normal text-ink-soft">
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
                  className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger"
                >
                  {credentialsError}
                </p>
              )}

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
            </form>
          </CardContent>

          <CardFooter className="flex-col items-stretch gap-2 bg-brand-gold-50/40">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-gold-900">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {t('auth:login.demo.title')}
            </div>
            <p className="text-xs text-ink-soft">{t('auth:login.demo.description')}</p>
            <Select onValueChange={(email) => void handleQuickLogin(email)} disabled={isQuickLoggingIn}>
              <SelectTrigger className="w-full bg-surface">
                <SelectValue placeholder="Entrar rapidamente como…" />
              </SelectTrigger>
              <SelectContent>
                {ACTIVE_DEMO_USERS.map((demoUser) => (
                  <SelectItem key={demoUser.id} value={demoUser.email}>
                    {demoUser.name} — {ROLE_LABELS[demoUser.role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-2xs text-ink-soft">
              Todas as contas de demonstração usam a senha <span className="font-mono">{DEMO_PASSWORD}</span>.
            </p>
          </CardFooter>
        </Card>

        <p className="relative mt-6 text-2xs text-muted">{brand.copyright}</p>
      </main>
    </div>
  );
}

export default LoginPage;

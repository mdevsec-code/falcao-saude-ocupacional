import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { FalcaoLogo } from '@/assets/logo/FalcaoLogo';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, type LoginInput } from '../types';
import { ROUTE_PATHS } from '@/constants/routes';

export function LoginPage(): ReactNode {
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuth();
  const { t } = useTranslation(['auth', 'common', 'validation']);

  const [credentialsError, setCredentialsError] = useState<string | null>(null);
  const [showPwd, setShowPwd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  if (isAuthenticated) {
    navigate(ROUTE_PATHS.DASHBOARD, { replace: true });
  }

  const onSubmit = handleSubmit(async (data) => {
    setCredentialsError(null);
    const result = await signIn(data.email, data.password);
    if (!result.ok) {
      setCredentialsError(result.error);
      toast.error(result.error);
      return;
    }
    navigate(ROUTE_PATHS.DASHBOARD, { replace: true });
  });

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

        <FalcaoLogo variant="wordmark" className="relative h-14 w-auto text-white" />

        <div className="relative space-y-2">
          <p className="font-display text-2xl font-semibold text-white">
            {t('auth:login.sidePanel.title')}
          </p>
          <p className="text-sm text-white/70">{t('auth:login.sidePanel.subtitle')}</p>
          <div className="flex items-center gap-2 pt-3 text-xs text-white/50">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{t('auth:login.sidePanel.compliance')}</span>
          </div>
        </div>
      </aside>

      {/* ────────── Direita: formulário ────────── */}
      <main className="flex flex-col items-center justify-center bg-bg px-4 py-10 sm:px-8">
        <Card className="w-full max-w-md border-border shadow-md">
          <CardHeader className="items-center text-center">
            <FalcaoLogo className="h-10 w-10 text-neutral-900" />
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

              <Input
                {...register('password')}
                type={showPwd ? 'text' : 'password'}
                label={t('auth:login.fields.password')}
                placeholder={t('auth:login.fields.passwordPlaceholder')}
                autoComplete="current-password"
                leftIcon={<Lock className="h-4 w-4" />}
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

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-ink-soft">
                  <input
                    {...register('rememberMe')}
                    type="checkbox"
                    className="h-4 w-4 rounded border-border text-brand-gold-500 focus:ring-brand-gold-500"
                  />
                  {t('auth:login.fields.rememberMe')}
                </label>

                <Button asChild variant="link" size="sm" className="h-auto px-0 text-xs">
                  <a href="#esqueci">{t('auth:login.actions.forgotPassword')}</a>
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
        </Card>

        <p className="mt-6 text-2xs text-muted">Falcão Construções e Engenharia © 2026</p>
      </main>
    </div>
  );
}

export default LoginPage;

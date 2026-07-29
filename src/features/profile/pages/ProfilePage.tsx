import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { KeyRound, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/layout/PageHeader';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Separator } from '@/components/ui/Separator';
import { Switch } from '@/components/ui/Switch';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { ROLE_LABELS } from '@/constants/roles';
import { getInitials } from '@/utils/format';
import { passwordSchema } from '@/validators/common';

const passwordFormSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type PasswordFormInput = z.infer<typeof passwordFormSchema>;

export function ProfilePage() {
  const { t } = useTranslation('profile');
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormInput>({
    resolver: zodResolver(passwordFormSchema),
    mode: 'onTouched',
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
    reset();
    toast.info('Ambiente de demonstração: alteração de senha não é persistida.');
  });

  return (
    <>
      <PageHeader
        eyebrow={t('profile:page.eyebrow')}
        title={t('profile:page.title')}
        description={t('profile:page.description')}
      />

      <div className="mx-auto max-w-2xl space-y-6 px-6 py-8 sm:px-8">
        <Card>
          <CardContent className="flex items-center gap-4 pt-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{getInitials(user?.name ?? 'Falcão')}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-semibold text-ink">
                {user?.name ?? '—'}
              </p>
              <p className="truncate text-sm text-ink-soft">{user?.email ?? '—'}</p>
              {user && (
                <Badge variant="brand" size="sm" className="mt-1.5">
                  {ROLE_LABELS[user.role]}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferências</CardTitle>
            <CardDescription>Aparência e idioma da plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-ink">
                {theme === 'dark' ? (
                  <Moon className="h-4 w-4 text-ink-soft" />
                ) : (
                  <Sun className="h-4 w-4 text-ink-soft" />
                )}
                Tema escuro
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggle} aria-label="Alternar tema" />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">Idioma</span>
              <span className="text-sm text-ink-soft">Português (Brasil)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>Alterar senha de acesso.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} noValidate className="space-y-4">
              <Input
                {...register('currentPassword')}
                type="password"
                label="Senha atual"
                leftIcon={<KeyRound className="h-4 w-4" />}
                error={errors.currentPassword?.message}
                required
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  {...register('newPassword')}
                  type="password"
                  label="Nova senha"
                  error={errors.newPassword?.message}
                  required
                />
                <Input
                  {...register('confirmPassword')}
                  type="password"
                  label="Confirmar nova senha"
                  error={errors.confirmPassword?.message}
                  required
                />
              </div>
              <div>
                <Label htmlFor="profile-role" className="sr-only">
                  Perfil
                </Label>
                <Button type="submit" variant="primary" isLoading={isSubmitting}>
                  Atualizar senha
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default ProfilePage;

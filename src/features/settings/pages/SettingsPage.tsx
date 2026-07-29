import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Globe, Info } from 'lucide-react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Separator } from '@/components/ui/Separator';
import { Switch } from '@/components/ui/Switch';
import { Badge } from '@/components/ui/Badge';
import { env } from '@/config/env';
import { brand } from '@/config/brand';
import { localeLabels } from '@/constants/i18n';

const APP_VERSION = '0.2.0';

interface NotificationPrefs {
  newAppointments: boolean;
  pendingAtestados: boolean;
  examReminders: boolean;
}

export function SettingsPage() {
  const { t } = useTranslation('settings');
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    newAppointments: true,
    pendingAtestados: true,
    examReminders: false,
  });

  function handleToggle(key: keyof NotificationPrefs) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.info('Ambiente de demonstração: preferências não são persistidas.');
  }

  return (
    <>
      <PageHeader
        eyebrow={t('settings:page.eyebrow')}
        title={t('settings:page.title')}
        description={t('settings:page.description')}
      />

      <div className="mx-auto max-w-2xl space-y-6 px-6 py-8 sm:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-4 w-4 text-brand-gold-700" />
              Informações do sistema
            </CardTitle>
            <CardDescription>Ambiente e versão em execução.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink-soft">Aplicação</span>
              <span className="text-ink">{brand.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-soft">Versão</span>
              <span className="font-mono text-ink">v{APP_VERSION}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-soft">Ambiente</span>
              <Badge variant={import.meta.env.PROD ? 'success' : 'warning'} size="sm">
                {import.meta.env.PROD ? 'Produção' : 'Desenvolvimento'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-soft">Fonte de dados</span>
              <Badge variant={env.VITE_ENABLE_MSW ? 'warning' : 'success'} size="sm">
                {env.VITE_ENABLE_MSW ? 'Mock (MSW)' : 'API real'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-soft">API</span>
              <span className="truncate font-mono text-xs text-ink-soft">{env.VITE_API_URL}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-brand-gold-700" />
              Localização
            </CardTitle>
            <CardDescription>Idioma e formato padrão da plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink-soft">Idioma padrão</span>
              <span className="text-ink">{localeLabels[env.VITE_DEFAULT_LOCALE as 'pt-BR']}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-soft">Fuso horário</span>
              <span className="text-ink">America/Bahia (UTC-3)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-brand-gold-700" />
              Notificações
            </CardTitle>
            <CardDescription>Alertas enviados para administradores e recepção.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">Novos agendamentos</span>
              <Switch
                checked={prefs.newAppointments}
                onCheckedChange={() => handleToggle('newAppointments')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">Atestados pendentes de lançamento</span>
              <Switch
                checked={prefs.pendingAtestados}
                onCheckedChange={() => handleToggle('pendingAtestados')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">Lembretes de exame periódico (NR-7)</span>
              <Switch
                checked={prefs.examReminders}
                onCheckedChange={() => handleToggle('examReminders')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default SettingsPage;

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
import { LOCALES, localeLabels, type Locale } from '@/constants/i18n';

const APP_VERSION = '0.2.0';

interface NotificationPrefs {
  newAppointments: boolean;
  pendingAtestados: boolean;
  examReminders: boolean;
}

export function SettingsPage() {
  const { t, i18n } = useTranslation('settings');
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    newAppointments: true,
    pendingAtestados: true,
    examReminders: false,
  });

  const current = (i18n.resolvedLanguage ?? i18n.language) as Locale;
  const currentLocale: Locale = LOCALES.includes(current) ? current : 'pt-BR';

  function handleToggle(key: keyof NotificationPrefs) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.info(t('settings:toast.prefsNotPersisted'));
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
              {t('settings:system.title')}
            </CardTitle>
            <CardDescription>{t('settings:system.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink-soft">{t('settings:system.application')}</span>
              <span className="text-ink">{brand.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-soft">{t('settings:system.version')}</span>
              <span className="font-mono text-ink">v{APP_VERSION}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-soft">{t('settings:system.environment')}</span>
              <Badge variant={import.meta.env.PROD ? 'success' : 'warning'} size="sm">
                {import.meta.env.PROD
                  ? t('settings:system.production')
                  : t('settings:system.development')}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-soft">{t('settings:system.dataSource')}</span>
              <Badge variant={env.VITE_ENABLE_MSW ? 'warning' : 'success'} size="sm">
                {env.VITE_ENABLE_MSW
                  ? t('settings:system.mockSource')
                  : t('settings:system.realApiSource')}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-soft">{t('settings:system.api')}</span>
              <span className="truncate font-mono text-xs text-ink-soft">{env.VITE_API_URL}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-brand-gold-700" />
              {t('settings:localization.title')}
            </CardTitle>
            <CardDescription>{t('settings:localization.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink-soft">{t('settings:localization.currentLanguage')}</span>
              <span className="text-ink">{localeLabels[currentLocale]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-soft">{t('settings:localization.timezone')}</span>
              <span className="text-ink">America/Bahia (UTC-3)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-brand-gold-700" />
              {t('settings:notifications.title')}
            </CardTitle>
            <CardDescription>{t('settings:notifications.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">
                {t('settings:notifications.newAppointments')}
              </span>
              <Switch
                checked={prefs.newAppointments}
                onCheckedChange={() => handleToggle('newAppointments')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">
                {t('settings:notifications.pendingAtestados')}
              </span>
              <Switch
                checked={prefs.pendingAtestados}
                onCheckedChange={() => handleToggle('pendingAtestados')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">{t('settings:notifications.examReminders')}</span>
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

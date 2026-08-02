import { useMemo, type ReactNode } from 'react';
import { AlertTriangle, Clock, CircleCheck, type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import type { AtestadoRecord } from '../types';

interface AttentionAlertsProps {
  records: readonly AtestadoRecord[];
}

const TONE_CLASSES = {
  warning: 'border-brand-gold-300 bg-brand-gold-50/60 text-brand-gold-900',
  danger: 'border-danger/30 bg-danger/5 text-danger',
  success: 'border-success/30 bg-success/5 text-success',
} as const;

export function AttentionAlerts({ records }: AttentionAlertsProps) {
  const { t } = useTranslation('atestados');
  const { recorrentesGraves, slaAtrasado } = useMemo(() => {
    const porColaborador: Record<string, number> = {};
    records.forEach((r) => {
      if (r.nome) porColaborador[r.nome] = (porColaborador[r.nome] ?? 0) + 1;
    });
    const graves = Object.entries(porColaborador)
      .filter(([, count]) => count >= 3)
      .sort((a, b) => b[1] - a[1]);
    const atrasado = records.filter(
      (r) =>
        r.slaLancamentoDias !== null &&
        r.slaLancamentoDias !== undefined &&
        r.slaLancamentoDias > 2,
    ).length;
    return { recorrentesGraves: graves, slaAtrasado: atrasado };
  }, [records]);

  const hasAlerts = recorrentesGraves.length > 0 || slaAtrasado > 0;

  return (
    <div className="space-y-3">
      {recorrentesGraves.length > 0 && (
        <AlertRow
          tone="warning"
          icon={AlertTriangle}
          title={t('atestados:alerts.recurrentTitle', { count: recorrentesGraves.length })}
        >
          {recorrentesGraves
            .slice(0, 5)
            .map(([nome, count]) => `${nome} (${count})`)
            .join(', ')}
          {recorrentesGraves.length > 5 ? '…' : ''}
        </AlertRow>
      )}
      {slaAtrasado > 0 && (
        <AlertRow
          tone="danger"
          icon={Clock}
          title={t('atestados:alerts.slaTitle', { count: slaAtrasado })}
        >
          {t('atestados:alerts.slaDescription')}
        </AlertRow>
      )}
      {!hasAlerts && (
        <AlertRow tone="success" icon={CircleCheck} title={t('atestados:alerts.none')} />
      )}
    </div>
  );
}

interface AlertRowProps {
  tone: keyof typeof TONE_CLASSES;
  icon: LucideIcon;
  title: string;
  children?: ReactNode;
}

function AlertRow({ tone, icon: Icon, title, children }: AlertRowProps) {
  return (
    <div className={cn('flex items-start gap-3 rounded-md border p-3 text-sm', TONE_CLASSES[tone])}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        {children && <p className="mt-0.5 text-ink-soft">{children}</p>}
      </div>
    </div>
  );
}

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/utils/format';
import type { AtestadoRecord } from '../types';

interface RecentTimelineProps {
  records: readonly AtestadoRecord[];
  limit?: number;
}

export function RecentTimeline({ records, limit = 8 }: RecentTimelineProps) {
  const { t } = useTranslation('atestados');
  const recent = useMemo(
    () =>
      [...records]
        .filter((r) => r.dataLancamento)
        .sort((a, b) => (b.dataLancamento ?? '').localeCompare(a.dataLancamento ?? ''))
        .slice(0, limit),
    [records, limit],
  );

  if (recent.length === 0) {
    return <p className="text-sm text-ink-soft">{t('atestados:timeline.empty')}</p>;
  }

  return (
    <ol className="space-y-3">
      {recent.map((r) => (
        <li key={r.id} className="flex gap-3">
          <span
            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-gold-500"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">
              {r.nome} — {r.setor ?? '—'}
            </p>
            <p className="text-xs text-ink-soft">
              {formatDate(r.dataLancamento) ?? '—'} · {r.qntDias ?? 0}{' '}
              {t('atestados:timeline.daysUnit')} · CID {r.cid ?? '—'}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

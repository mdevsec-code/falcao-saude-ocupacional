import { Stethoscope, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { formatDate } from '@/utils/format';
import { APPOINTMENT_CONCLUSION_LABELS } from '@/constants/status';
import { CONCLUSION_BADGE_VARIANT } from '@/features/attendances/lib/status';
import type { AttendanceRecord } from '@/features/attendances/types';

interface AttendanceTimelineProps {
  records: readonly AttendanceRecord[];
}

export function AttendanceTimeline({ records }: AttendanceTimelineProps) {
  const { t } = useTranslation('records');

  if (records.length === 0) {
    return (
      <EmptyState
        title={t('records:timeline.emptyTitle')}
        description={t('records:timeline.emptyDescription')}
      />
    );
  }

  const sorted = [...records].sort((a, b) => b.attendanceDate.localeCompare(a.attendanceDate));

  return (
    <ol className="border-border relative space-y-5 border-l pl-5">
      {sorted.map((record) => (
        <li key={record.id} className="relative">
          <span
            aria-hidden="true"
            className="border-surface bg-brand-gold-500 absolute top-1 left-[-25px] h-2.5 w-2.5 rounded-full border-2"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-ink text-sm font-semibold">
              {formatDate(record.attendanceDate) ?? '—'}
            </p>
            <Badge variant={CONCLUSION_BADGE_VARIANT[record.conclusion]} size="sm">
              {APPOINTMENT_CONCLUSION_LABELS[record.conclusion]}
            </Badge>
          </div>
          <p className="text-ink-soft mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span className="flex items-center gap-1">
              <Stethoscope className="h-3 w-3" aria-hidden="true" />
              {record.examType}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" aria-hidden="true" />
              {record.doctor}
            </span>
          </p>
          {record.restrictionNotes && (
            <p className="border-brand-gold-300 bg-brand-gold-50/60 text-brand-gold-900 mt-1.5 rounded-md border px-2.5 py-1.5 text-xs">
              {record.restrictionNotes}
            </p>
          )}
          {record.notes && <p className="text-ink-soft mt-1.5 text-xs">{record.notes}</p>}
        </li>
      ))}
    </ol>
  );
}

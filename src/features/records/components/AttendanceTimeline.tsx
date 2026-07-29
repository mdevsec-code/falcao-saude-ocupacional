import { Stethoscope, User } from 'lucide-react';

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
  if (records.length === 0) {
    return (
      <EmptyState
        title="Nenhum atendimento registrado"
        description="Este paciente ainda não possui histórico de atendimentos."
      />
    );
  }

  const sorted = [...records].sort((a, b) => b.attendanceDate.localeCompare(a.attendanceDate));

  return (
    <ol className="relative space-y-5 border-l border-border pl-5">
      {sorted.map((record) => (
        <li key={record.id} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full border-2 border-surface bg-brand-gold-500"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-ink">{formatDate(record.attendanceDate) ?? '—'}</p>
            <Badge variant={CONCLUSION_BADGE_VARIANT[record.conclusion]} size="sm">
              {APPOINTMENT_CONCLUSION_LABELS[record.conclusion]}
            </Badge>
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
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
            <p className="mt-1.5 rounded-md border border-brand-gold-300 bg-brand-gold-50/60 px-2.5 py-1.5 text-xs text-brand-gold-900">
              {record.restrictionNotes}
            </p>
          )}
          {record.notes && <p className="mt-1.5 text-xs text-ink-soft">{record.notes}</p>}
        </li>
      ))}
    </ol>
  );
}

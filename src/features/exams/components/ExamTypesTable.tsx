import { Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/feedback/EmptyState';
import type { ExamTypeRecord } from '../types';

interface ExamTypesTableProps {
  records: readonly ExamTypeRecord[];
  onEdit: (record: ExamTypeRecord) => void;
  onDelete: (record: ExamTypeRecord) => void;
}

export function ExamTypesTable({ records, onEdit, onDelete }: ExamTypesTableProps) {
  const { t } = useTranslation('exams');

  if (records.length === 0) {
    return <EmptyState title={t('exams:empty.title')} description={t('exams:empty.description')} />;
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-brand-gold-50/60 text-ink">
          <tr>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              {t('exams:table.name')}
            </th>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              {t('exams:table.category')}
            </th>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              {t('exams:table.duration')}
            </th>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              {t('exams:table.periodicity')}
            </th>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              {t('exams:table.status')}
            </th>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              {t('exams:table.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface">
          {records.map((row, idx) => (
            <tr
              key={row.id}
              className="animate-slide-up hover:bg-hover"
              style={{ animationDelay: `${idx * 25}ms`, animationFillMode: 'backwards' }}
            >
              <td className="px-3 py-2">
                <p className="font-medium text-ink">{row.name}</p>
                {row.description && <p className="text-xs text-ink-soft">{row.description}</p>}
              </td>
              <td className="px-3 py-2 text-ink">{row.category}</td>
              <td className="px-3 py-2 text-ink">
                {t('exams:table.durationValue', { count: row.defaultDurationMin })}
              </td>
              <td className="px-3 py-2 text-ink">
                {row.periodicityMonths
                  ? t('exams:table.periodicityValue', { count: row.periodicityMonths })
                  : '—'}
              </td>
              <td className="px-3 py-2">
                <Badge variant={row.active ? 'success' : 'neutral'} size="sm">
                  {row.active ? t('exams:table.active') : t('exams:table.inactive')}
                </Badge>
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={t('exams:table.editAria')}
                    onClick={() => onEdit(row)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-danger hover:text-danger"
                    aria-label={t('exams:table.deleteAria')}
                    onClick={() => onDelete(row)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FileSpreadsheet, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/feedback/EmptyState';
import { getIntlLocale } from '@/utils/locale';
import { exportToExcel } from '@/utils/exports/excel';
import type { ExportColumn } from '@/utils/exports/types';
import {
  frequencyRate,
  relativeAccidentIndex,
  severityRate,
  totalAccidents,
  totalDaysLost,
} from '../lib/metrics';
import type { AccidentIndicatorRecord } from '../indicatorTypes';

interface IndicadoresTableProps {
  records: readonly AccidentIndicatorRecord[];
  onEdit: (record: AccidentIndicatorRecord) => void;
  onDelete: (record: AccidentIndicatorRecord) => void;
}

function formatRate(value: number | null): string {
  return value === null ? '—' : value.toLocaleString(getIntlLocale(), { maximumFractionDigits: 2 });
}

export function IndicadoresTable({ records, onEdit, onDelete }: IndicadoresTableProps) {
  const { t } = useTranslation('seguranca');

  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(getIntlLocale(), { month: 'short' }),
    [],
  );

  const sorted = useMemo(
    () => [...records].sort((a, b) => (a.year === b.year ? a.month - b.month : a.year - b.year)),
    [records],
  );

  async function handleExport() {
    try {
      const columns: ExportColumn<AccidentIndicatorRecord>[] = [
        { key: 'year', header: t('seguranca:indicadores.table.year') },
        {
          key: 'month',
          header: t('seguranca:indicadores.table.month'),
          format: (v) => monthFormatter.format(new Date(2000, (v as number) - 1, 1)),
        },
        { key: 'employees', header: t('seguranca:indicadores.table.employees') },
        {
          key: 'accidentsWithLeave',
          header: t('seguranca:indicadores.table.accidentsWithLeave'),
        },
        {
          key: 'accidentsWithoutLeave',
          header: t('seguranca:indicadores.table.accidentsWithoutLeave'),
        },
        {
          key: 'id',
          header: t('seguranca:indicadores.table.totalAccidents'),
          format: (_v, row) => String(totalAccidents(row as AccidentIndicatorRecord)),
        },
        {
          key: 'daysLostAccidents',
          header: t('seguranca:indicadores.table.totalDaysLost'),
          format: (_v, row) => String(totalDaysLost(row as AccidentIndicatorRecord)),
        },
        {
          key: 'daysDebited',
          header: t('seguranca:indicadores.table.frequencyRate'),
          format: (_v, row) => formatRate(frequencyRate(row as AccidentIndicatorRecord)),
        },
      ];
      await exportToExcel({
        title: t('seguranca:indicadores.table.exportTitle'),
        rows: sorted,
        columns,
        fileName: `indicadores_acidentes_${new Date().toISOString().slice(0, 10)}`,
        meta: {
          [t('seguranca:indicadores.table.generatedAt')]: new Date().toLocaleString(
            getIntlLocale(),
          ),
        },
      });
      toast.success(t('seguranca:indicadores.toast.exportSuccess'));
    } catch (err) {
      toast.error(t('seguranca:indicadores.toast.exportError'));
      console.error(err);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button
          variant="outline"
          leftIcon={<FileSpreadsheet className="h-4 w-4" />}
          disabled={sorted.length === 0}
          onClick={() => void handleExport()}
        >
          {t('seguranca:indicadores.table.exportExcel')}
        </Button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          title={t('seguranca:indicadores.empty.title')}
          description={t('seguranca:indicadores.empty.description')}
        />
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-gold-50/60 text-ink">
              <tr>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  {t('seguranca:indicadores.table.period')}
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  {t('seguranca:indicadores.table.employees')}
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  {t('seguranca:indicadores.table.totalAccidents')}
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  {t('seguranca:indicadores.table.totalDaysLost')}
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  {t('seguranca:indicadores.table.frequencyRate')}
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  {t('seguranca:indicadores.table.severityRate')}
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  {t('seguranca:indicadores.table.relativeIndex')}
                </th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  {t('seguranca:indicadores.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {sorted.map((row, idx) => (
                <tr
                  key={row.id}
                  className="animate-slide-up hover:bg-hover"
                  style={{ animationDelay: `${idx * 30}ms`, animationFillMode: 'backwards' }}
                >
                  <td className="whitespace-nowrap px-3 py-2 font-medium capitalize text-ink">
                    {monthFormatter.format(new Date(row.year, row.month - 1, 1))}/{row.year}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-ink">{row.employees}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-ink">
                    {totalAccidents(row)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-ink">
                    {totalDaysLost(row)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-ink">
                    {formatRate(frequencyRate(row))}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-ink">
                    {formatRate(severityRate(row))}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-ink">
                    {formatRate(relativeAccidentIndex(row))}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={t('seguranca:indicadores.table.editAria')}
                        onClick={() => onEdit(row)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-danger hover:text-danger"
                        aria-label={t('seguranca:indicadores.table.deleteAria')}
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
      )}
    </div>
  );
}

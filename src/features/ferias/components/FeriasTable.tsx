import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Pencil,
  Search,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { formatDate } from '@/utils/format';
import { getIntlLocale } from '@/utils/locale';
import { exportToExcel } from '@/utils/exports/excel';
import type { ExportColumn } from '@/utils/exports/types';
import { VACATION_STATUS_LABELS } from '@/constants/status';
import { STATUS_BADGE_VARIANT } from '../lib/status';
import type { VacationRecord } from '../types';

const PAGE_SIZE = 10;

interface FeriasTableProps {
  records: readonly VacationRecord[];
  onEdit: (record: VacationRecord) => void;
  onDelete: (record: VacationRecord) => void;
}

export function FeriasTable({ records, onEdit, onDelete }: FeriasTableProps) {
  const { t } = useTranslation('ferias');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof VacationRecord>('startDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  const COLUMNS: { key: keyof VacationRecord; label: string }[] = useMemo(
    () => [
      { key: 'patientName', label: t('ferias:table.patientName') },
      { key: 'sector', label: t('ferias:table.sector') },
      { key: 'role', label: t('ferias:table.role') },
      { key: 'startDate', label: t('ferias:table.startDate') },
      { key: 'endDate', label: t('ferias:table.endDate') },
      { key: 'days', label: t('ferias:table.days') },
      { key: 'status', label: t('ferias:table.status') },
    ],
    [t],
  );

  const filteredSorted = useMemo(() => {
    let rows = [...records];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        COLUMNS.some((c) =>
          String(r[c.key] ?? '')
            .toLowerCase()
            .includes(q),
        ),
      );
    }
    rows.sort((a, b) => {
      const va = a[sortKey] ?? '';
      const vb = b[sortKey] ?? '';
      return sortDir === 'asc'
        ? String(va).localeCompare(String(vb), getIntlLocale())
        : String(vb).localeCompare(String(va), getIntlLocale());
    });
    return rows;
  }, [records, search, sortKey, sortDir, COLUMNS]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filteredSorted.slice(start, start + PAGE_SIZE);

  function handleSort(key: keyof VacationRecord) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  async function handleExport() {
    try {
      const columns: ExportColumn<VacationRecord>[] = [
        { key: 'patientName', header: t('ferias:table.patientName') },
        { key: 'sector', header: t('ferias:table.sector') },
        { key: 'role', header: t('ferias:table.role') },
        {
          key: 'startDate',
          header: t('ferias:table.startDate'),
          format: (v) => formatDate(v as string) ?? '—',
        },
        {
          key: 'endDate',
          header: t('ferias:table.endDate'),
          format: (v) => formatDate(v as string) ?? '—',
        },
        { key: 'days', header: t('ferias:table.days') },
        {
          key: 'status',
          header: t('ferias:table.status'),
          format: (v) => VACATION_STATUS_LABELS[v as keyof typeof VACATION_STATUS_LABELS],
        },
      ];
      await exportToExcel({
        title: t('ferias:table.exportTitle'),
        rows: filteredSorted,
        columns,
        fileName: `ferias_export_${new Date().toISOString().slice(0, 10)}`,
        meta: {
          [t('ferias:table.generatedAt')]: new Date().toLocaleString(getIntlLocale()),
          [t('ferias:table.total')]: filteredSorted.length,
        },
      });
      toast.success(t('ferias:toast.exportSuccess'));
    } catch (err) {
      toast.error(t('ferias:toast.exportError'));
      console.error(err);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          className="max-w-xs"
          placeholder={t('ferias:table.searchPlaceholder')}
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <Button
          variant="outline"
          leftIcon={<FileSpreadsheet className="h-4 w-4" />}
          disabled={filteredSorted.length === 0}
          onClick={() => void handleExport()}
        >
          {t('ferias:table.exportExcel')}
        </Button>
      </div>

      {filteredSorted.length === 0 ? (
        <EmptyState title={t('ferias:empty.title')} description={t('ferias:empty.description')} />
      ) : (
        <>
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-gold-50/60 text-ink">
                <tr>
                  {COLUMNS.map((c) => (
                    <th
                      key={c.key}
                      className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft"
                    >
                      <button
                        type="button"
                        onClick={() => handleSort(c.key)}
                        className="inline-flex items-center gap-1 hover:text-ink"
                      >
                        {c.label}
                        {sortKey === c.key ? (
                          sortDir === 'asc' ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-40" />
                        )}
                      </button>
                    </th>
                  ))}
                  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                    {t('ferias:table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {pageRows.map((row) => (
                  <tr key={row.id} className="hover:bg-hover">
                    <td className="px-3 py-2 font-medium text-ink">{row.patientName}</td>
                    <td className="px-3 py-2 text-ink">{row.sector}</td>
                    <td className="px-3 py-2 text-ink">{row.role}</td>
                    <td className="px-3 py-2 text-ink">{formatDate(row.startDate) ?? '—'}</td>
                    <td className="px-3 py-2 text-ink">{formatDate(row.endDate) ?? '—'}</td>
                    <td className="px-3 py-2 text-ink">{row.days}</td>
                    <td className="px-3 py-2">
                      <Badge variant={STATUS_BADGE_VARIANT[row.status]} size="sm">
                        {VACATION_STATUS_LABELS[row.status]}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={t('ferias:table.editAria')}
                          onClick={() => onEdit(row)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-danger hover:text-danger"
                          aria-label={t('ferias:table.deleteAria')}
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

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink-soft">
            <span>
              {t('ferias:table.showingRange', {
                start: start + 1,
                end: Math.min(start + PAGE_SIZE, filteredSorted.length),
                total: filteredSorted.length,
              })}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label={t('ferias:table.prevPageAria')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>{t('ferias:table.pageOf', { current: currentPage, total: totalPages })}</span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label={t('ferias:table.nextPageAria')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

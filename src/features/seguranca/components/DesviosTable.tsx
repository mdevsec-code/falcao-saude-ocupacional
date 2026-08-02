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
import { DEVIATION_CLASSIFICATION_LABELS, DEVIATION_STATUS_LABELS } from '@/constants/status';
import { DEVIATION_STATUS_BADGE_VARIANT } from '../lib/status';
import type { DeviationRecord } from '../types';

const PAGE_SIZE = 10;

interface DesviosTableProps {
  records: readonly DeviationRecord[];
  onEdit: (record: DeviationRecord) => void;
  onDelete: (record: DeviationRecord) => void;
}

export function DesviosTable({ records, onEdit, onDelete }: DesviosTableProps) {
  const { t } = useTranslation('seguranca');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof DeviationRecord>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  const COLUMNS: { key: keyof DeviationRecord; label: string }[] = useMemo(
    () => [
      { key: 'date', label: t('seguranca:desvios.table.date') },
      { key: 'location', label: t('seguranca:desvios.table.location') },
      { key: 'classification', label: t('seguranca:desvios.table.classification') },
      { key: 'description', label: t('seguranca:desvios.table.description') },
      { key: 'status', label: t('seguranca:desvios.table.status') },
    ],
    [t],
  );

  const filteredSorted = useMemo(() => {
    let rows = [...records];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        `${r.description} ${r.location} ${r.foreman ?? ''} ${r.responsibleTechnician ?? ''}`
          .toLowerCase()
          .includes(q),
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
  }, [records, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filteredSorted.slice(start, start + PAGE_SIZE);

  function handleSort(key: keyof DeviationRecord) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  async function handleExport() {
    try {
      const columns: ExportColumn<DeviationRecord>[] = [
        {
          key: 'date',
          header: t('seguranca:desvios.table.date'),
          format: (v) => formatDate(v as string) ?? '—',
        },
        { key: 'location', header: t('seguranca:desvios.table.location') },
        {
          key: 'classification',
          header: t('seguranca:desvios.table.classification'),
          format: (v) =>
            DEVIATION_CLASSIFICATION_LABELS[v as keyof typeof DEVIATION_CLASSIFICATION_LABELS],
        },
        { key: 'description', header: t('seguranca:desvios.table.description') },
        { key: 'foreman', header: t('seguranca:desvios.table.foreman') },
        {
          key: 'responsibleTechnician',
          header: t('seguranca:desvios.table.responsibleTechnician'),
        },
        { key: 'action', header: t('seguranca:desvios.table.action') },
        {
          key: 'status',
          header: t('seguranca:desvios.table.status'),
          format: (v) => DEVIATION_STATUS_LABELS[v as keyof typeof DEVIATION_STATUS_LABELS],
        },
      ];
      await exportToExcel({
        title: t('seguranca:desvios.table.exportTitle'),
        rows: filteredSorted,
        columns,
        fileName: `desvios_export_${new Date().toISOString().slice(0, 10)}`,
        meta: {
          [t('seguranca:desvios.table.generatedAt')]: new Date().toLocaleString(getIntlLocale()),
          [t('seguranca:desvios.table.total')]: filteredSorted.length,
        },
      });
      toast.success(t('seguranca:desvios.toast.exportSuccess'));
    } catch (err) {
      toast.error(t('seguranca:desvios.toast.exportError'));
      console.error(err);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          className="max-w-xs"
          placeholder={t('seguranca:desvios.table.searchPlaceholder')}
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
          {t('seguranca:desvios.table.exportExcel')}
        </Button>
      </div>

      {filteredSorted.length === 0 ? (
        <EmptyState
          title={t('seguranca:desvios.empty.title')}
          description={t('seguranca:desvios.empty.description')}
        />
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
                    {t('seguranca:desvios.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {pageRows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className="animate-slide-up hover:bg-hover"
                    style={{ animationDelay: `${idx * 25}ms`, animationFillMode: 'backwards' }}
                  >
                    <td className="whitespace-nowrap px-3 py-2 text-ink">
                      {formatDate(row.date) ?? '—'}
                    </td>
                    <td className="px-3 py-2 text-ink">{row.location}</td>
                    <td className="px-3 py-2 text-ink">
                      {DEVIATION_CLASSIFICATION_LABELS[row.classification]}
                    </td>
                    <td className="max-w-xs truncate px-3 py-2 text-ink" title={row.description}>
                      {row.description}
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant={DEVIATION_STATUS_BADGE_VARIANT[row.status]} size="sm">
                        {DEVIATION_STATUS_LABELS[row.status]}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={t('seguranca:desvios.table.editAria')}
                          onClick={() => onEdit(row)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-danger hover:text-danger"
                          aria-label={t('seguranca:desvios.table.deleteAria')}
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
              {t('seguranca:desvios.table.showingRange', {
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
                aria-label={t('seguranca:desvios.table.prevPageAria')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>
                {t('seguranca:desvios.table.pageOf', { current: currentPage, total: totalPages })}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label={t('seguranca:desvios.table.nextPageAria')}
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

import { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { formatDate } from '@/utils/format';
import { getIntlLocale } from '@/utils/locale';
import { exportToExcel } from '@/utils/exports/excel';
import type { ExportColumn } from '@/utils/exports/types';
import type { AtestadoRecord } from '../types';

const COLUMN_KEYS: (keyof AtestadoRecord)[] = [
  'nome',
  'funcao',
  'setor',
  'qntDias',
  'cid',
  'inicioAtestado',
  'terminoAtestado',
  'dataLancamento',
  'competencia',
  'liderancaDireta',
];

const DATE_KEYS = new Set<keyof AtestadoRecord>([
  'inicioAtestado',
  'terminoAtestado',
  'dataLancamento',
]);

const PAGE_SIZE = 10;

interface RecordsTableProps {
  records: readonly AtestadoRecord[];
}

export function RecordsTable({ records }: RecordsTableProps) {
  const { t } = useTranslation('atestados');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof AtestadoRecord>('dataLancamento');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  const COLUMNS = useMemo(
    () => COLUMN_KEYS.map((key) => ({ key, label: t(`atestados:table.columns.${key}`) })),
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
      let va: unknown = a[sortKey];
      let vb: unknown = b[sortKey];
      if (va === null || va === undefined) va = '';
      if (vb === null || vb === undefined) vb = '';
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDir === 'asc' ? va - vb : vb - va;
      }
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

  function handleSort(key: keyof AtestadoRecord) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  async function handleExport() {
    try {
      const columns: ExportColumn<AtestadoRecord>[] = COLUMNS.map((c) => ({
        key: c.key,
        header: c.label,
        format: DATE_KEYS.has(c.key) ? (v: unknown) => formatDate(v as string) ?? '—' : undefined,
      }));
      await exportToExcel({
        title: t('atestados:table.exportTitle'),
        rows: filteredSorted,
        columns,
        fileName: `atestados_export_${new Date().toISOString().slice(0, 10)}`,
        meta: {
          [t('atestados:table.exportMetaGeneratedAt')]: new Date().toLocaleString(getIntlLocale()),
          [t('atestados:table.exportMetaTotal')]: filteredSorted.length,
        },
      });
      toast.success(t('atestados:table.exportSuccess'));
    } catch (err) {
      toast.error(t('atestados:table.exportError'));
      console.error(err);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          className="max-w-xs"
          placeholder={t('atestados:table.searchPlaceholder')}
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
          {t('atestados:table.exportButton')}
        </Button>
      </div>

      {filteredSorted.length === 0 ? (
        <EmptyState
          title={t('atestados:table.emptyTitle')}
          description={t('atestados:table.emptyDescription')}
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
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {pageRows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className="animate-slide-up hover:bg-hover"
                    style={{ animationDelay: `${idx * 25}ms`, animationFillMode: 'backwards' }}
                  >
                    {COLUMNS.map((c) => {
                      const raw = row[c.key];
                      if (raw === null || raw === undefined || raw === '') {
                        return (
                          <td key={c.key} className="px-3 py-2 text-ink-soft">
                            —
                          </td>
                        );
                      }
                      if (DATE_KEYS.has(c.key)) {
                        return (
                          <td key={c.key} className="px-3 py-2 text-ink">
                            {formatDate(String(raw)) ?? '—'}
                          </td>
                        );
                      }
                      if (c.key === 'qntDias') {
                        return (
                          <td key={c.key} className="px-3 py-2">
                            <Badge variant="brand" size="sm">
                              {raw}d
                            </Badge>
                          </td>
                        );
                      }
                      return (
                        <td key={c.key} className="px-3 py-2 text-ink">
                          {String(raw)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink-soft">
            <span>
              {t('atestados:table.showingRange', {
                from: start + 1,
                to: Math.min(start + PAGE_SIZE, filteredSorted.length),
                total: filteredSorted.length,
              })}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label={t('atestados:table.prevPageAria')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>
                {t('atestados:table.pageOfTotal', { current: currentPage, total: totalPages })}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label={t('atestados:table.nextPageAria')}
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

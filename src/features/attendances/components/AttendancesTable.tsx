import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  FileDown,
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
import { generateAsoPdf } from '@/utils/exports/aso';
import type { ExportColumn } from '@/utils/exports/types';
import { APPOINTMENT_CONCLUSION_LABELS } from '@/constants/status';
import type { PatientRecord } from '@/features/patients/types';
import { CONCLUSION_BADGE_VARIANT } from '../lib/status';
import type { AttendanceRecord } from '../types';

const PAGE_SIZE = 10;

interface AttendancesTableProps {
  records: readonly AttendanceRecord[];
  patients: readonly PatientRecord[];
  onEdit: (record: AttendanceRecord) => void;
  onDelete: (record: AttendanceRecord) => void;
}

export function AttendancesTable({ records, patients, onEdit, onDelete }: AttendancesTableProps) {
  const { t } = useTranslation(['attendances', 'common']);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof AttendanceRecord>('attendanceDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  const COLUMNS: { key: keyof AttendanceRecord; label: string }[] = useMemo(
    () => [
      { key: 'attendanceDate', label: t('attendances:table.columns.date') },
      { key: 'patientName', label: t('attendances:table.columns.patient') },
      { key: 'examType', label: t('attendances:table.columns.exam') },
      { key: 'doctor', label: t('attendances:table.columns.doctor') },
      { key: 'conclusion', label: t('attendances:table.columns.conclusion') },
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

  function handleSort(key: keyof AttendanceRecord) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  async function handleExport() {
    try {
      const columns: ExportColumn<AttendanceRecord>[] = [
        {
          key: 'attendanceDate',
          header: t('attendances:table.columns.date'),
          format: (v) => formatDate(v as string) ?? '—',
        },
        { key: 'patientName', header: t('attendances:table.columns.patient') },
        { key: 'examType', header: t('attendances:table.columns.exam') },
        { key: 'doctor', header: t('attendances:table.columns.doctor') },
        {
          key: 'conclusion',
          header: t('attendances:table.columns.conclusion'),
          format: (v) =>
            APPOINTMENT_CONCLUSION_LABELS[v as keyof typeof APPOINTMENT_CONCLUSION_LABELS],
        },
        {
          key: 'restrictionNotes',
          header: t('attendances:table.columns.restrictionNotes'),
          format: (v) => (v as string | null) ?? '—',
        },
      ];
      await exportToExcel({
        title: t('attendances:export.title'),
        rows: filteredSorted,
        columns,
        fileName: `atendimentos_export_${new Date().toISOString().slice(0, 10)}`,
        meta: {
          [t('attendances:export.generatedAt')]: new Date().toLocaleString('pt-BR'),
          [t('attendances:export.total')]: filteredSorted.length,
        },
      });
      toast.success(t('attendances:toast.exportSuccess'));
    } catch (err) {
      toast.error(t('attendances:toast.exportError'));
      console.error(err);
    }
  }

  function handleDownloadAso(record: AttendanceRecord) {
    const patient = patients.find((p) => p.id === record.patientId);
    try {
      generateAsoPdf({
        patientName: record.patientName,
        patientCpf: patient?.cpf ?? '',
        patientRole: patient?.role ?? '—',
        patientSector: patient?.sector ?? '—',
        examType: record.examType,
        doctor: record.doctor,
        attendanceDate: record.attendanceDate,
        conclusion: record.conclusion,
        restrictionNotes: record.restrictionNotes,
        dutyFitness: record.dutyFitness,
      });
      toast.success(t('attendances:toast.asoSuccess'));
    } catch (err) {
      toast.error(t('attendances:toast.asoError'));
      console.error(err);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          className="max-w-xs"
          placeholder={t('attendances:table.search.placeholder')}
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
          {t('attendances:table.actions.exportExcel')}
        </Button>
      </div>

      {filteredSorted.length === 0 ? (
        <EmptyState
          title={t('attendances:empty.title')}
          description={t('attendances:empty.description')}
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
                    {t('attendances:table.columns.actions')}
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
                    <td className="px-3 py-2 text-ink">{formatDate(row.attendanceDate) ?? '—'}</td>
                    <td className="px-3 py-2 font-medium text-ink">{row.patientName}</td>
                    <td className="px-3 py-2 text-ink">{row.examType}</td>
                    <td className="px-3 py-2 text-ink">{row.doctor}</td>
                    <td className="px-3 py-2">
                      <Badge variant={CONCLUSION_BADGE_VARIANT[row.conclusion]} size="sm">
                        {APPOINTMENT_CONCLUSION_LABELS[row.conclusion]}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={t('attendances:table.actions.downloadAso')}
                          onClick={() => handleDownloadAso(row)}
                        >
                          <FileDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={t('attendances:table.actions.edit')}
                          onClick={() => onEdit(row)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-danger hover:text-danger"
                          aria-label={t('attendances:table.actions.remove')}
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
              {t('attendances:table.pagination.showing', {
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
                aria-label={t('attendances:table.pagination.previous')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>
                {t('attendances:table.pagination.page', {
                  current: currentPage,
                  total: totalPages,
                })}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label={t('attendances:table.pagination.next')}
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

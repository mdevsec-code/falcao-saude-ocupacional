import { useMemo, useState } from 'react';
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
import { exportToExcel } from '@/utils/exports/excel';
import { generateAsoPdf } from '@/utils/exports/aso';
import type { ExportColumn } from '@/utils/exports/types';
import { APPOINTMENT_CONCLUSION_LABELS } from '@/constants/status';
import type { PatientRecord } from '@/features/patients/types';
import { CONCLUSION_BADGE_VARIANT } from '../lib/status';
import type { AttendanceRecord } from '../types';

const COLUMNS: { key: keyof AttendanceRecord; label: string }[] = [
  { key: 'attendanceDate', label: 'Data' },
  { key: 'patientName', label: 'Paciente' },
  { key: 'examType', label: 'Exame' },
  { key: 'doctor', label: 'Médico' },
  { key: 'conclusion', label: 'Conclusão' },
];

const PAGE_SIZE = 10;

interface AttendancesTableProps {
  records: readonly AttendanceRecord[];
  patients: readonly PatientRecord[];
  onEdit: (record: AttendanceRecord) => void;
  onDelete: (record: AttendanceRecord) => void;
}

export function AttendancesTable({ records, patients, onEdit, onDelete }: AttendancesTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof AttendanceRecord>('attendanceDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  const filteredSorted = useMemo(() => {
    let rows = [...records];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => COLUMNS.some((c) => String(r[c.key] ?? '').toLowerCase().includes(q)));
    }
    rows.sort((a, b) => {
      const va = a[sortKey] ?? '';
      const vb = b[sortKey] ?? '';
      return sortDir === 'asc'
        ? String(va).localeCompare(String(vb), 'pt-BR')
        : String(vb).localeCompare(String(va), 'pt-BR');
    });
    return rows;
  }, [records, search, sortKey, sortDir]);

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
        { key: 'attendanceDate', header: 'Data', format: (v) => formatDate(v as string) ?? '—' },
        { key: 'patientName', header: 'Paciente' },
        { key: 'examType', header: 'Exame' },
        { key: 'doctor', header: 'Médico' },
        {
          key: 'conclusion',
          header: 'Conclusão',
          format: (v) => APPOINTMENT_CONCLUSION_LABELS[v as keyof typeof APPOINTMENT_CONCLUSION_LABELS],
        },
        { key: 'restrictionNotes', header: 'Restrições', format: (v) => (v as string | null) ?? '—' },
      ];
      await exportToExcel({
        title: 'Atendimentos',
        rows: filteredSorted,
        columns,
        fileName: `atendimentos_export_${new Date().toISOString().slice(0, 10)}`,
        meta: { 'Gerado em': new Date().toLocaleString('pt-BR'), Total: filteredSorted.length },
      });
      toast.success('Exportação concluída.');
    } catch (err) {
      toast.error('Não foi possível exportar a planilha.');
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
      toast.success('ASO gerado.');
    } catch (err) {
      toast.error('Não foi possível gerar o ASO.');
      console.error(err);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          className="max-w-xs"
          placeholder="Pesquisar na tabela…"
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
          Exportar Excel
        </Button>
      </div>

      {filteredSorted.length === 0 ? (
        <EmptyState title="Nenhum atendimento encontrado" description="Ajuste os filtros ou a busca." />
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
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {pageRows.map((row) => (
                  <tr key={row.id} className="hover:bg-hover">
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
                          aria-label="Baixar ASO"
                          onClick={() => handleDownloadAso(row)}
                        >
                          <FileDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label="Editar atendimento"
                          onClick={() => onEdit(row)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-danger hover:text-danger"
                          aria-label="Remover atendimento"
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
              Mostrando {start + 1}–{Math.min(start + PAGE_SIZE, filteredSorted.length)} de{' '}
              {filteredSorted.length} atendimentos
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Próxima página"
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

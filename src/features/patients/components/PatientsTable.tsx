import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Pencil,
  Search,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import { ROUTE_PATHS } from '@/constants/routes';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { formatCPF, formatDate, formatPhoneBR } from '@/utils/format';
import { exportToExcel } from '@/utils/exports/excel';
import type { ExportColumn } from '@/utils/exports/types';
import { PATIENT_STATUS_LABELS } from '@/constants/status';
import { STATUS_BADGE_VARIANT } from '../lib/status';
import type { PatientRecord } from '../types';

const COLUMNS: { key: keyof PatientRecord; label: string }[] = [
  { key: 'name', label: 'Nome' },
  { key: 'cpf', label: 'CPF' },
  { key: 'role', label: 'Função' },
  { key: 'sector', label: 'Setor' },
  { key: 'admissionDate', label: 'Admissão' },
  { key: 'status', label: 'Status' },
];

const PAGE_SIZE = 10;

interface PatientsTableProps {
  records: readonly PatientRecord[];
  onEdit: (record: PatientRecord) => void;
  onDelete: (record: PatientRecord) => void;
}

export function PatientsTable({ records, onEdit, onDelete }: PatientsTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof PatientRecord>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
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

  function handleSort(key: keyof PatientRecord) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  async function handleExport() {
    try {
      const columns: ExportColumn<PatientRecord>[] = [
        { key: 'name', header: 'Nome' },
        { key: 'cpf', header: 'CPF', format: (v) => formatCPF(v as string) },
        { key: 'role', header: 'Função' },
        { key: 'sector', header: 'Setor' },
        { key: 'phone', header: 'Telefone', format: (v) => formatPhoneBR(v as string | null) },
        { key: 'admissionDate', header: 'Admissão', format: (v) => formatDate(v as string) ?? '—' },
        {
          key: 'status',
          header: 'Status',
          format: (v) => PATIENT_STATUS_LABELS[v as keyof typeof PATIENT_STATUS_LABELS],
        },
      ];
      await exportToExcel({
        title: 'Cadastro de Pacientes',
        rows: filteredSorted,
        columns,
        fileName: `pacientes_export_${new Date().toISOString().slice(0, 10)}`,
        meta: { 'Gerado em': new Date().toLocaleString('pt-BR'), Total: filteredSorted.length },
      });
      toast.success('Exportação concluída.');
    } catch (err) {
      toast.error('Não foi possível exportar a planilha.');
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
        <EmptyState title="Nenhum paciente encontrado" description="Ajuste os filtros ou a busca." />
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
                    <td className="px-3 py-2 font-medium text-ink">{row.name}</td>
                    <td className="px-3 py-2 text-ink">{formatCPF(row.cpf)}</td>
                    <td className="px-3 py-2 text-ink">{row.role}</td>
                    <td className="px-3 py-2 text-ink">{row.sector}</td>
                    <td className="px-3 py-2 text-ink">{formatDate(row.admissionDate) ?? '—'}</td>
                    <td className="px-3 py-2">
                      <Badge variant={STATUS_BADGE_VARIANT[row.status]} size="sm">
                        {PATIENT_STATUS_LABELS[row.status]}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label="Ver prontuário"
                        >
                          <Link to={`${ROUTE_PATHS.PRONTUARIOS}?patientId=${row.id}`}>
                            <FileText className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label="Editar paciente"
                          onClick={() => onEdit(row)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-danger hover:text-danger"
                          aria-label="Remover paciente"
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
              {filteredSorted.length} pacientes
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

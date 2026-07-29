import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileDown, FileSpreadsheet, MessageCircle, Filter } from 'lucide-react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Separator } from '@/components/ui/Separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { EmptyState } from '@/components/feedback/EmptyState';
import { exportToPdf, exportToExcel } from '@/utils/exports';
import { buildWhatsappUrl } from '@/utils/exports/whatsapp';
import { brand } from '@/config/brand';
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_CONCLUSION_LABELS } from '@/constants/status';
import { formatDate, formatDateTime } from '@/utils/format';

import {
  useReportKinds,
  useReportRows,
  reportKindLabel,
  reportDateLabel,
} from '../hooks/useReportRows';
import type { ReportFilters, ReportKind, ReportRecord } from '../types';
import { REPORT_FIXTURES } from '../fixtures';
import type { ExportColumn } from '@/utils/exports/types';

const STATUS_TONE: Record<
  ReportRecord['status'],
  'brand' | 'success' | 'danger' | 'warning' | 'neutral'
> = {
  agendado: 'neutral',
  realizado: 'success',
  cancelado: 'neutral',
  faltou: 'warning',
  apto: 'success',
  inapto: 'danger',
  apto_restricao: 'warning',
};

const STATUS_LABELS: Record<ReportRecord['status'], string> = {
  ...APPOINTMENT_STATUS_LABELS,
  ...APPOINTMENT_CONCLUSION_LABELS,
};

function buildColumns(): readonly ExportColumn<ReportRecord>[] {
  return [
    {
      key: 'date',
      header: 'Data',
      width: 14,
      format: (v: unknown) => formatDate(v as string) ?? '—',
    },
    { key: 'patient', header: 'Paciente', width: 28 },
    { key: 'company', header: 'Empresa', width: 22 },
    { key: 'sector', header: 'Setor', width: 18 },
    { key: 'exam', header: 'Exame', width: 22 },
    {
      key: 'status',
      header: 'Status',
      width: 18,
      format: (v: unknown) => STATUS_LABELS[v as ReportRecord['status']] ?? String(v),
    },
    { key: 'professional', header: 'Profissional', width: 22 },
    { key: 'notes', header: 'Observações', width: 32 },
  ];
}

export function ReportsPage() {
  const { t } = useTranslation('reports');
  const kinds = useReportKinds();
  const [filters, setFilters] = useState<ReportFilters>({ kind: 'agendamentos' });
  const rows = useReportRows(filters);
  const columns = useMemo(() => buildColumns(), []);

  const companies = useMemo(
    () => Array.from(new Set(REPORT_FIXTURES.map((r) => r.company))).sort(),
    [],
  );

  const subtitle = `${reportKindLabel(filters.kind)} · ${rows.length} registro${
    rows.length === 1 ? '' : 's'
  }`;

  const baseFileName = useMemo(() => {
    const stamp = new Date().toISOString().slice(0, 10);
    return `relatorio-${filters.kind}-${stamp}`;
  }, [filters.kind]);

  const documentBase = useMemo(
    () => ({
      title: `${t('title')} — ${reportKindLabel(filters.kind)}`,
      subtitle: `${brand.legalName} · ${reportDateLabel(filters.kind)}`,
      rows,
      columns,
      fileName: baseFileName,
      meta: {
        ...(filters.from ? { De: formatDate(filters.from) ?? filters.from } : {}),
        ...(filters.to ? { Até: formatDate(filters.to) ?? filters.to } : {}),
        ...(filters.company ? { Empresa: filters.company } : {}),
        'Gerado em': formatDateTime(new Date()) ?? '',
      },
    }),
    [t, filters, rows, columns, baseFileName],
  );

  const handleExportPdf = () => {
    try {
      exportToPdf(documentBase);
      toast.success(t('toast.pdfSuccess'));
    } catch (err) {
      toast.error(t('toast.pdfError'));
      console.error(err);
    }
  };

  const handleExportExcel = async () => {
    try {
      await exportToExcel(documentBase);
      toast.success(t('toast.excelSuccess'));
    } catch (err) {
      toast.error(t('toast.excelError'));
      console.error(err);
    }
  };

  const handleSendWhatsapp = () => {
    const contactPhone = '11999990000'; // placeholder — virá do filtro/empresa
    const message = [
      `*${t('title')}*`,
      reportKindLabel(filters.kind),
      `Período: ${filters.from ? formatDate(filters.from) : 'início'} a ${
        filters.to ? formatDate(filters.to) : 'hoje'
      }`,
      rows.length > 0 ? `Total de registros: ${rows.length}` : 'Nenhum registro no período.',
    ].join('\n');
    const url = buildWhatsappUrl({ phone: contactPhone, name: 'Equipe' }, message);
    if (!url) {
      toast.error(t('toast.whatsappInvalid'));
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
    toast.success(t('toast.whatsappSent'));
  };

  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />

      <div className="space-y-6 px-6 py-8 sm:px-8">
        {/* Filtros */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-ink-soft" aria-hidden="true" />
              <CardTitle>{t('filters.title')}</CardTitle>
            </div>
            <CardDescription>{t('filters.description')}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label htmlFor="kind">{t('filters.kind')}</Label>
              <Select
                value={filters.kind}
                onValueChange={(v) => setFilters((f) => ({ ...f, kind: v as ReportKind }))}
              >
                <SelectTrigger id="kind" className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {kinds.map((k) => (
                    <SelectItem key={k.value} value={k.value}>
                      {k.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="from">{t('filters.from')}</Label>
              <Input
                id="from"
                type="date"
                className="mt-1 w-full"
                value={filters.from?.slice(0, 10) ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value || undefined }))}
              />
            </div>
            <div>
              <Label htmlFor="to">{t('filters.to')}</Label>
              <Input
                id="to"
                type="date"
                className="mt-1 w-full"
                value={filters.to?.slice(0, 10) ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value || undefined }))}
              />
            </div>
            <div>
              <Label htmlFor="company">{t('filters.company')}</Label>
              <Select
                value={filters.company ?? '__all'}
                onValueChange={(v) =>
                  setFilters((f) => ({ ...f, company: v === '__all' ? undefined : v }))
                }
              >
                <SelectTrigger id="company" className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all">{t('filters.allCompanies')}</SelectItem>
                  {companies.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <Card>
          <CardHeader>
            <CardTitle>{t('actions.title')}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button
              onClick={handleExportPdf}
              leftIcon={<FileDown className="h-4 w-4" />}
              disabled={rows.length === 0}
            >
              {t('actions.pdf')}
            </Button>
            <Button
              variant="outline"
              onClick={handleExportExcel}
              leftIcon={<FileSpreadsheet className="h-4 w-4" />}
              disabled={rows.length === 0}
            >
              {t('actions.excel')}
            </Button>
            <Button
              variant="secondary"
              onClick={handleSendWhatsapp}
              leftIcon={<MessageCircle className="h-4 w-4" />}
            >
              {t('actions.whatsapp')}
            </Button>
          </CardContent>
        </Card>

        <Separator />

        {/* Tabela de pré-visualização */}
        <Card>
          <CardHeader>
            <CardTitle>{t('preview.title')}</CardTitle>
            <CardDescription>{t('preview.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {rows.length === 0 ? (
              <EmptyState
                title={t('preview.empty.title')}
                description={t('preview.empty.description')}
              />
            ) : (
              <div className="overflow-x-auto rounded-md border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-brand-gold-50/60 text-ink">
                    <tr>
                      {columns.map((c) => (
                        <th
                          key={c.key}
                          className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft"
                        >
                          {c.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-surface">
                    {rows.map((row) => (
                      <tr key={row.id} className="hover:bg-hover">
                        {columns.map((c) => {
                          const raw = (row as unknown as Record<string, unknown>)[c.key];
                          const text = c.format ? c.format(raw, row) : String(raw ?? '');
                          if (c.key === 'status') {
                            return (
                              <td key={c.key} className="px-3 py-2">
                                <Badge variant={STATUS_TONE[row.status]} size="sm">
                                  {text}
                                </Badge>
                              </td>
                            );
                          }
                          return (
                            <td key={c.key} className="px-3 py-2 text-ink">
                              {text || <span className="text-ink-soft">—</span>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default ReportsPage;

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  AlertTriangle,
  FileDown,
  FileSpreadsheet,
  History,
  LogIn,
  ScrollText,
  Search,
  ShieldAlert,
} from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import { StatTile } from '@/components/data-display/StatTile';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { formatDateTime } from '@/utils/format';
import { exportToExcel, exportToPdf } from '@/utils/exports';
import type { ExportColumn } from '@/utils/exports/types';
import { brand } from '@/config/brand';
import { ROLE_LABELS, type Role } from '@/constants/roles';
import {
  ALL_AUDIT_ACTIONS,
  ALL_AUDIT_ENTITY_TYPES,
  AUDIT_ACTION_LABELS,
  AUDIT_ENTITY_LABELS,
} from '@/constants/audit';

import { useAuditLog } from '../hooks/useAuditLog';
import type { AuditLogRecord } from '../types';

const ALL_VALUE = '__all';

const ACTION_BADGE_VARIANT: Record<AuditLogRecord['action'], BadgeVariant> = {
  login: 'success',
  login_failed: 'danger',
  logout: 'neutral',
  create: 'brand',
  update: 'info',
  delete: 'danger',
};

function buildColumns(): readonly ExportColumn<AuditLogRecord>[] {
  return [
    {
      key: 'timestamp',
      header: 'Data/hora',
      width: 20,
      format: (v) => formatDateTime(v as string) ?? '—',
    },
    { key: 'actorName', header: 'Usuário', width: 24 },
    {
      key: 'actorRole',
      header: 'Perfil',
      width: 20,
      format: (v) => (v ? (ROLE_LABELS[v as Role] ?? String(v)) : '—'),
    },
    {
      key: 'action',
      header: 'Ação',
      width: 18,
      format: (v) => AUDIT_ACTION_LABELS[v as AuditLogRecord['action']] ?? String(v),
    },
    {
      key: 'entityType',
      header: 'Área',
      width: 16,
      format: (v) => AUDIT_ENTITY_LABELS[v as AuditLogRecord['entityType']] ?? String(v),
    },
    { key: 'entityLabel', header: 'Registro', width: 28 },
    { key: 'detail', header: 'Detalhe', width: 24 },
  ];
}

export function AuditPage() {
  const { t } = useTranslation('audit');
  const { data, isLoading, isError, refetch } = useAuditLog();
  const records = useMemo(() => data ?? [], [data]);

  const [search, setSearch] = useState('');
  const [action, setAction] = useState<string>(ALL_VALUE);
  const [entityType, setEntityType] = useState<string>(ALL_VALUE);
  const columns = useMemo(() => buildColumns(), []);

  const kpis = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      total: records.length,
      hoje: records.filter((r) => r.timestamp.slice(0, 10) === today).length,
      loginFailed: records.filter((r) => r.action === 'login_failed').length,
      dadosPacientes: records.filter((r) => r.entityType === 'patient').length,
    };
  }, [records]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((r) => {
      if (action !== ALL_VALUE && r.action !== action) return false;
      if (entityType !== ALL_VALUE && r.entityType !== entityType) return false;
      if (
        q &&
        !`${r.actorName} ${r.entityLabel ?? ''} ${r.detail ?? ''}`.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [records, search, action, entityType]);

  const fileName = useMemo(() => `auditoria-${new Date().toISOString().slice(0, 10)}`, []);

  const documentBase = useMemo(
    () => ({
      title: 'Trilha de auditoria',
      subtitle: `${brand.legalName} · ${filtered.length} registro${filtered.length === 1 ? '' : 's'}`,
      rows: filtered,
      columns,
      fileName,
    }),
    [filtered, columns, fileName],
  );

  function handleExportPdf() {
    try {
      exportToPdf(documentBase);
      toast.success('PDF gerado com sucesso.');
    } catch (err) {
      toast.error('Não foi possível gerar o PDF.');
      console.error(err);
    }
  }

  async function handleExportExcel() {
    try {
      await exportToExcel(documentBase);
      toast.success('Planilha gerada com sucesso.');
    } catch (err) {
      toast.error('Não foi possível gerar a planilha.');
      console.error(err);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow={t('audit:page.eyebrow')}
        title={t('audit:page.title')}
        description={t('audit:page.description')}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FileDown className="h-4 w-4" />}
              onClick={handleExportPdf}
              disabled={filtered.length === 0}
            >
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FileSpreadsheet className="h-4 w-4" />}
              onClick={() => void handleExportExcel()}
              disabled={filtered.length === 0}
            >
              Excel
            </Button>
          </div>
        }
      />

      <div className="space-y-8 px-6 py-8 sm:px-8">
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-[112px] w-full" />
            ))}
          </div>
        )}

        {isError && (
          <ErrorState
            title={t('audit:error.title')}
            description={t('audit:error.description')}
            action={
              <Button variant="outline" onClick={() => void refetch()}>
                Tentar novamente
              </Button>
            }
          />
        )}

        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                label="Eventos registrados"
                value={kpis.total}
                icon={<ScrollText className="h-4 w-4" />}
              />
              <StatTile
                label="Eventos hoje"
                value={kpis.hoje}
                icon={<History className="h-4 w-4" />}
              />
              <StatTile
                label="Falhas de login"
                value={kpis.loginFailed}
                icon={<LogIn className="h-4 w-4" />}
              />
              <StatTile
                label="Acessos a dados de pacientes"
                value={kpis.dadosPacientes}
                icon={<ShieldAlert className="h-4 w-4" />}
              />
            </div>

            <Separator />

            <div className="flex flex-wrap items-center gap-3">
              <Input
                className="max-w-xs"
                placeholder="Buscar por usuário ou registro…"
                leftIcon={<Search className="h-4 w-4" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Select value={action} onValueChange={setAction}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>Todas as ações</SelectItem>
                  {ALL_AUDIT_ACTIONS.map((a) => (
                    <SelectItem key={a} value={a}>
                      {AUDIT_ACTION_LABELS[a]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={entityType} onValueChange={setEntityType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>Todas as áreas</SelectItem>
                  {ALL_AUDIT_ENTITY_TYPES.map((e) => (
                    <SelectItem key={e} value={e}>
                      {AUDIT_ENTITY_LABELS[e]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                title="Nenhum evento encontrado"
                description="Ajuste a busca ou os filtros."
              />
            ) : (
              <div className="overflow-x-auto rounded-md border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-brand-gold-50/60 text-ink">
                    <tr>
                      <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                        Data/hora
                      </th>
                      <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                        Usuário
                      </th>
                      <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                        Ação
                      </th>
                      <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                        Área
                      </th>
                      <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                        Registro
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-surface">
                    {filtered.slice(0, 200).map((row) => (
                      <tr key={row.id} className="hover:bg-hover">
                        <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-ink-soft">
                          {formatDateTime(row.timestamp)}
                        </td>
                        <td className="px-3 py-2">
                          <p className="font-medium text-ink">{row.actorName}</p>
                          {row.actorRole && (
                            <p className="text-xs text-ink-soft">{ROLE_LABELS[row.actorRole]}</p>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <Badge variant={ACTION_BADGE_VARIANT[row.action]} size="sm">
                            {row.action === 'login_failed' && (
                              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                            )}
                            {AUDIT_ACTION_LABELS[row.action]}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 text-ink-soft">
                          {AUDIT_ENTITY_LABELS[row.entityType]}
                        </td>
                        <td className="px-3 py-2 text-ink">
                          {row.entityLabel ?? '—'}
                          {row.detail && (
                            <p className="text-xs text-ink-soft">{row.detail}</p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length > 200 && (
                  <p className="border-t border-border px-3 py-2 text-xs text-ink-soft">
                    Exibindo os 200 eventos mais recentes de {filtered.length}. Exporte para PDF ou
                    Excel para ver a lista completa.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default AuditPage;

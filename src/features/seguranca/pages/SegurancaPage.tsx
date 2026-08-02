import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ClipboardList,
  HeartPulse,
  Plus,
  TrendingDown,
  Users2,
} from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import { StatTile } from '@/components/data-display/StatTile';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Label } from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useCountUp } from '@/hooks/useCountUp';
import { getIntlLocale } from '@/utils/locale';

import { useDesvios } from '../hooks/useDesvios';
import { useCreateDesvio, useDeleteDesvio, useUpdateDesvio } from '../hooks/useDesviosMutations';
import { useFilteredDesvios } from '../hooks/useDesviosFilters';
import { fromFormInput as fromDesvioFormInput } from '../types';
import type { DeviationFilters, DeviationFormInput, DeviationRecord } from '../types';

import { useIndicadores } from '../hooks/useIndicadores';
import {
  useCreateIndicador,
  useDeleteIndicador,
  useUpdateIndicador,
} from '../hooks/useIndicadoresMutations';
import { fromFormInput as fromIndicatorFormInput } from '../indicatorTypes';
import type { AccidentIndicatorRecord, IndicatorFormInput } from '../indicatorTypes';
import { manHours, totalAccidents, totalDaysLost } from '../lib/metrics';

import { DesviosFiltersBar } from '../components/DesviosFiltersBar';
import { DesviosTable } from '../components/DesviosTable';
import { DesvioDialog } from '../components/DesvioDialog';
import { DeleteDesvioDialog } from '../components/DeleteDesvioDialog';

import { IndicadoresChart } from '../components/IndicadoresChart';
import { IndicadoresTable } from '../components/IndicadoresTable';
import { IndicadorDialog } from '../components/IndicadorDialog';
import { DeleteIndicadorDialog } from '../components/DeleteIndicadorDialog';

function AnimatedStatTile(props: Parameters<typeof StatTile>[0]) {
  const numericValue = typeof props.value === 'number' ? props.value : null;
  const animated = useCountUp(numericValue ?? 0);
  return <StatTile {...props} value={numericValue === null ? props.value : animated} />;
}

export function SegurancaPage() {
  const { t } = useTranslation('seguranca');

  return (
    <>
      <PageHeader
        eyebrow={t('seguranca:page.eyebrow')}
        title={t('seguranca:page.title')}
        description={t('seguranca:page.description')}
      />

      <div className="px-6 py-8 sm:px-8">
        <Tabs defaultValue="desvios">
          <TabsList>
            <TabsTrigger value="desvios">{t('seguranca:tabs.desvios')}</TabsTrigger>
            <TabsTrigger value="indicadores">{t('seguranca:tabs.indicadores')}</TabsTrigger>
          </TabsList>

          <TabsContent value="desvios">
            <DesviosSection />
          </TabsContent>

          <TabsContent value="indicadores">
            <IndicadoresSection />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function DesviosSection() {
  const { t } = useTranslation('seguranca');
  const { data: allRecords, isLoading, isError, refetch } = useDesvios();
  const records = useMemo(() => allRecords ?? [], [allRecords]);

  const [filters, setFilters] = useState<DeviationFilters>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DeviationRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeviationRecord | null>(null);

  const filteredRecords = useFilteredDesvios(records, filters);

  const createMutation = useCreateDesvio();
  const updateMutation = useUpdateDesvio();
  const deleteMutation = useDeleteDesvio();

  const kpis = useMemo(() => {
    const pending = records.filter((r) => r.status === 'pendente').length;
    const inProgress = records.filter((r) => r.status === 'em_andamento').length;
    const completed = records.filter((r) => r.status === 'concluido').length;
    return { total: records.length, pending, inProgress, completed };
  }, [records]);

  function handleFilterChange(patch: Partial<DeviationFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  function handleClearAll() {
    setFilters({});
  }

  function handleCreate() {
    setEditingRecord(null);
    setDialogOpen(true);
  }

  function handleEdit(record: DeviationRecord) {
    setEditingRecord(record);
    setDialogOpen(true);
  }

  function handleSubmit(input: DeviationFormInput) {
    if (editingRecord) {
      updateMutation.mutate(
        { id: editingRecord.id, patch: fromDesvioFormInput(input) },
        { onSuccess: () => setDialogOpen(false) },
      );
    } else {
      createMutation.mutate(fromDesvioFormInput(input), { onSuccess: () => setDialogOpen(false) });
    }
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  }

  return (
    <div className="space-y-8 pt-6">
      <div className="flex items-center justify-end">
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
          {t('seguranca:desvios.actions.new')}
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-[112px] w-full" />
          ))}
        </div>
      )}

      {isError && (
        <ErrorState
          title={t('seguranca:desvios.error.title')}
          description={t('seguranca:desvios.error.description')}
          action={
            <Button variant="outline" onClick={() => void refetch()}>
              {t('seguranca:desvios.actions.retry')}
            </Button>
          }
        />
      )}

      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AnimatedStatTile
              label={t('seguranca:desvios.kpi.total')}
              value={kpis.total}
              icon={<ClipboardList className="h-4 w-4" />}
            />
            <AnimatedStatTile
              label={t('seguranca:desvios.kpi.pending')}
              value={kpis.pending}
              icon={<AlertTriangle className="h-4 w-4" />}
            />
            <AnimatedStatTile
              label={t('seguranca:desvios.kpi.inProgress')}
              value={kpis.inProgress}
              icon={<Clock className="h-4 w-4" />}
            />
            <AnimatedStatTile
              label={t('seguranca:desvios.kpi.completed')}
              value={kpis.completed}
              icon={<CheckCircle2 className="h-4 w-4" />}
            />
          </div>

          <Separator />

          <DesviosFiltersBar
            filters={filters}
            onChange={handleFilterChange}
            onClearAll={handleClearAll}
          />

          <DesviosTable records={filteredRecords} onEdit={handleEdit} onDelete={setDeleteTarget} />
        </>
      )}

      <DesvioDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingRecord={editingRecord}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteDesvioDialog
        record={deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isSubmitting={deleteMutation.isPending}
      />
    </div>
  );
}

function IndicadoresSection() {
  const { t } = useTranslation('seguranca');
  const { data: allRecords, isLoading, isError, refetch } = useIndicadores();
  const records = useMemo(() => allRecords ?? [], [allRecords]);

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AccidentIndicatorRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AccidentIndicatorRecord | null>(null);

  const yearOptions = useMemo(() => {
    const years = new Set(records.map((r) => r.year));
    years.add(currentYear);
    return Array.from(years).sort((a, b) => b - a);
  }, [records, currentYear]);

  const yearRecords = useMemo(() => records.filter((r) => r.year === year), [records, year]);

  const createMutation = useCreateIndicador();
  const updateMutation = useUpdateIndicador();
  const deleteMutation = useDeleteIndicador();

  const kpis = useMemo(() => {
    const accidents = yearRecords.reduce((sum, r) => sum + totalAccidents(r), 0);
    const daysLost = yearRecords.reduce((sum, r) => sum + totalDaysLost(r), 0);
    const hours = yearRecords.reduce((sum, r) => sum + manHours(r), 0);
    const frequency = hours > 0 ? (accidents * 1_000_000) / hours : null;
    const severity = hours > 0 ? (daysLost * 1_000_000) / hours : null;
    return { accidents, daysLost, frequency, severity };
  }, [yearRecords]);

  function formatRate(value: number | null): string {
    return value === null
      ? '—'
      : value.toLocaleString(getIntlLocale(), { maximumFractionDigits: 2 });
  }

  function handleCreate() {
    setEditingRecord(null);
    setDialogOpen(true);
  }

  function handleEdit(record: AccidentIndicatorRecord) {
    setEditingRecord(record);
    setDialogOpen(true);
  }

  function handleSubmit(input: IndicatorFormInput) {
    if (editingRecord) {
      updateMutation.mutate(
        { id: editingRecord.id, patch: fromIndicatorFormInput(input) },
        { onSuccess: () => setDialogOpen(false) },
      );
    } else {
      createMutation.mutate(fromIndicatorFormInput(input), {
        onSuccess: () => setDialogOpen(false),
      });
    }
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  }

  return (
    <div className="space-y-8 pt-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Label htmlFor="indicadores-year">{t('seguranca:indicadores.yearFilter.label')}</Label>
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger id="indicadores-year" className="mt-1 w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
          {t('seguranca:indicadores.actions.new')}
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-[112px] w-full" />
          ))}
        </div>
      )}

      {isError && (
        <ErrorState
          title={t('seguranca:indicadores.error.title')}
          description={t('seguranca:indicadores.error.description')}
          action={
            <Button variant="outline" onClick={() => void refetch()}>
              {t('seguranca:indicadores.actions.retry')}
            </Button>
          }
        />
      )}

      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AnimatedStatTile
              label={t('seguranca:indicadores.kpi.totalAccidents')}
              value={kpis.accidents}
              icon={<HeartPulse className="h-4 w-4" />}
            />
            <StatTile
              label={t('seguranca:indicadores.kpi.frequencyRate')}
              value={formatRate(kpis.frequency)}
              icon={<Users2 className="h-4 w-4" />}
            />
            <StatTile
              label={t('seguranca:indicadores.kpi.severityRate')}
              value={formatRate(kpis.severity)}
              icon={<TrendingDown className="h-4 w-4" />}
            />
            <AnimatedStatTile
              label={t('seguranca:indicadores.kpi.daysLost')}
              value={kpis.daysLost}
              icon={<Clock className="h-4 w-4" />}
            />
          </div>

          {yearRecords.length > 0 && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>{t('seguranca:indicadores.chartTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <IndicadoresChart records={yearRecords} />
              </CardContent>
            </Card>
          )}

          <Separator />

          <IndicadoresTable records={yearRecords} onEdit={handleEdit} onDelete={setDeleteTarget} />
        </>
      )}

      <IndicadorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingRecord={editingRecord}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteIndicadorDialog
        record={deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isSubmitting={deleteMutation.isPending}
      />
    </div>
  );
}

export default SegurancaPage;

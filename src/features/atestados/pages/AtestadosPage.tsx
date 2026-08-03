import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Separator } from '@/components/ui/Separator';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PERMISSIONS } from '@/constants/permissions';

import '../atestados-charts.css';

import { useAtestados } from '../hooks/useAtestados';
import {
  useCreateAtestado,
  useDeleteAtestado,
  useUpdateAtestado,
} from '../hooks/useAtestadoMutations';
import {
  useFilterDefinitions,
  useAtestadoDateRange,
  useFilteredAtestados,
} from '../hooks/useAtestadoFilters';
import { useAtestadoKpis, useCompetenciaGroups } from '../hooks/useAtestadoKpis';
import { topN } from '../lib/kpis';
import { fromFormInput } from '../types';
import type { AtestadoFilters, AtestadoFormInput, AtestadoRecord } from '../types';

import { ChartCard } from '../components/ChartCard';
import { KpiGrid } from '../components/KpiGrid';
import { FiltersBar } from '../components/FiltersBar';
import { EvolutionCharts } from '../components/EvolutionCharts';
import { RankingBarChart } from '../components/RankingBarChart';
import { FunctionDonut } from '../components/FunctionDonut';
import { AccumulatedAreaChart } from '../components/AccumulatedAreaChart';
import { HeatmapTable } from '../components/HeatmapTable';
import { RecentTimeline } from '../components/RecentTimeline';
import { AttentionAlerts } from '../components/AttentionAlerts';
import { RecordsTable } from '../components/RecordsTable';
import { AtestadoDialog } from '../components/AtestadoDialog';
import { DeleteAtestadoDialog } from '../components/DeleteAtestadoDialog';

export function AtestadosPage() {
  const { t } = useTranslation('atestados');
  const { can } = useAuth();
  const canWrite = can(PERMISSIONS.ATESTADO_WRITE);
  const { data: allRecords, isLoading, isError, refetch } = useAtestados();
  const [filters, setFilters] = useState<AtestadoFilters>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AtestadoRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AtestadoRecord | null>(null);

  const records = allRecords ?? [];
  const filteredRecords = useFilteredAtestados(records, filters);
  const filterDefinitions = useFilterDefinitions(records);
  const dateRange = useAtestadoDateRange(records);
  const kpis = useAtestadoKpis(filteredRecords);
  const competenciaGroups = useCompetenciaGroups(filteredRecords);

  const createMutation = useCreateAtestado();
  const updateMutation = useUpdateAtestado();
  const deleteMutation = useDeleteAtestado();

  function handleFilterChange(patch: Partial<AtestadoFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  function handleClearAll() {
    setFilters({});
  }

  function handleCreate() {
    setEditingRecord(null);
    setDialogOpen(true);
  }

  function handleEdit(record: AtestadoRecord) {
    setEditingRecord(record);
    setDialogOpen(true);
  }

  function handleSubmit(input: AtestadoFormInput) {
    if (editingRecord) {
      updateMutation.mutate(
        { id: editingRecord.id, patch: fromFormInput(input) },
        { onSuccess: () => setDialogOpen(false) },
      );
    } else {
      createMutation.mutate(fromFormInput(input), { onSuccess: () => setDialogOpen(false) });
    }
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  }

  return (
    <>
      <PageHeader
        eyebrow={t('atestados:page.eyebrow')}
        title={t('atestados:page.title')}
        description={t('atestados:page.description')}
        actions={
          canWrite && (
            <Button
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={handleCreate}
            >
              {t('atestados:actions.new')}
            </Button>
          )
        }
      />

      <div className="space-y-8 px-6 py-8 sm:px-8">
        <ChartCard
          title={t('atestados:filtersCard.title')}
          description={t('atestados:filtersCard.description')}
        >
          <FiltersBar
            definitions={filterDefinitions}
            filters={filters}
            dateRange={dateRange}
            onChange={handleFilterChange}
            onClearAll={handleClearAll}
          />
        </ChartCard>

        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-[112px] w-full" />
            ))}
          </div>
        )}

        {isError && (
          <ErrorState
            title={t('atestados:error.title')}
            description={t('atestados:error.description')}
            action={
              <Button variant="outline" onClick={() => void refetch()}>
                {t('atestados:error.retry')}
              </Button>
            }
          />
        )}

        {!isLoading && !isError && filteredRecords.length === 0 && (
          <EmptyState
            title={t('atestados:empty.title')}
            description={t('atestados:empty.description')}
          />
        )}

        {!isLoading && !isError && filteredRecords.length > 0 && (
          <>
            <KpiGrid kpis={kpis} />

            <Separator />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <ChartCard
                title={t('atestados:charts.evolucao.title')}
                description={t('atestados:charts.evolucao.description')}
                className="xl:col-span-2"
              >
                <EvolutionCharts groups={competenciaGroups} />
              </ChartCard>

              <ChartCard
                title={t('atestados:charts.funcao.title')}
                description={t('atestados:charts.funcao.description')}
              >
                <FunctionDonut records={filteredRecords} />
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ChartCard
                title={t('atestados:charts.setor.title')}
                description={t('atestados:charts.setor.description')}
              >
                <RankingBarChart
                  data={topN(filteredRecords, 'setor', 10)}
                  valueLabel={t('atestados:chartLabels.ranking.setorUnit')}
                />
              </ChartCard>

              <ChartCard
                title={t('atestados:charts.cid.title')}
                description={t('atestados:charts.cid.description')}
              >
                <RankingBarChart
                  data={topN(filteredRecords, 'cid', 8)}
                  valueLabel={t('atestados:chartLabels.ranking.cidUnit')}
                  layout="vertical"
                />
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ChartCard
                title={t('atestados:charts.acumulado.title')}
                description={t('atestados:charts.acumulado.description')}
              >
                <AccumulatedAreaChart records={filteredRecords} />
              </ChartCard>

              <ChartCard
                title={t('atestados:charts.lideranca.title')}
                description={t('atestados:charts.lideranca.description')}
              >
                <RankingBarChart
                  data={topN(filteredRecords, 'liderancaDireta', 8)}
                  valueLabel={t('atestados:chartLabels.ranking.liderancaUnit')}
                  layout="vertical"
                />
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ChartCard
                title={t('atestados:charts.heatmap.title')}
                description={t('atestados:charts.heatmap.description')}
              >
                <HeatmapTable records={filteredRecords} competenciaGroups={competenciaGroups} />
              </ChartCard>

              <ChartCard
                title={t('atestados:charts.timeline.title')}
                description={t('atestados:charts.timeline.description')}
              >
                <RecentTimeline records={filteredRecords} />
              </ChartCard>
            </div>

            <ChartCard
              title={t('atestados:charts.alerts.title')}
              description={t('atestados:charts.alerts.description')}
            >
              <AttentionAlerts records={filteredRecords} />
            </ChartCard>

            <Separator />

            <ChartCard
              title={t('atestados:charts.table.title')}
              description={t('atestados:charts.table.description')}
            >
              <RecordsTable
                records={filteredRecords}
                canWrite={canWrite}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
              />
            </ChartCard>
          </>
        )}
      </div>

      <AtestadoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingRecord={editingRecord}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteAtestadoDialog
        record={deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isSubmitting={deleteMutation.isPending}
      />
    </>
  );
}

export default AtestadosPage;

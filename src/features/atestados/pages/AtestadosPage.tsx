import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Separator } from '@/components/ui/Separator';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/Button';

import '../atestados-charts.css';

import { useAtestados } from '../hooks/useAtestados';
import { useFilterDefinitions, useAtestadoDateRange, useFilteredAtestados } from '../hooks/useAtestadoFilters';
import { useAtestadoKpis, useCompetenciaGroups } from '../hooks/useAtestadoKpis';
import { topN } from '../lib/kpis';
import type { AtestadoFilters } from '../types';

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

export function AtestadosPage() {
  const { t } = useTranslation('atestados');
  const { data: allRecords, isLoading, isError, refetch } = useAtestados();
  const [filters, setFilters] = useState<AtestadoFilters>({});

  const records = allRecords ?? [];
  const filteredRecords = useFilteredAtestados(records, filters);
  const filterDefinitions = useFilterDefinitions(records);
  const dateRange = useAtestadoDateRange(records);
  const kpis = useAtestadoKpis(filteredRecords);
  const competenciaGroups = useCompetenciaGroups(filteredRecords);

  function handleFilterChange(patch: Partial<AtestadoFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  function handleClearAll() {
    setFilters({});
  }

  return (
    <>
      <PageHeader
        eyebrow={t('atestados:page.eyebrow')}
        title={t('atestados:page.title')}
        description={t('atestados:page.description')}
      />

      <div className="space-y-8 px-6 py-8 sm:px-8">
        <ChartCard title={t('atestados:filtersCard.title')} description={t('atestados:filtersCard.description')}>
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
                Tentar novamente
              </Button>
            }
          />
        )}

        {!isLoading && !isError && filteredRecords.length === 0 && (
          <EmptyState title={t('atestados:empty.title')} description={t('atestados:empty.description')} />
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
                <RankingBarChart data={topN(filteredRecords, 'setor', 10)} valueLabel="atestado(s)" />
              </ChartCard>

              <ChartCard
                title={t('atestados:charts.cid.title')}
                description={t('atestados:charts.cid.description')}
              >
                <RankingBarChart
                  data={topN(filteredRecords, 'cid', 8)}
                  valueLabel="ocorrência(s)"
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
                  valueLabel="atestado(s)"
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
              <RecordsTable records={filteredRecords} />
            </ChartCard>
          </>
        )}
      </div>
    </>
  );
}

export default AtestadosPage;

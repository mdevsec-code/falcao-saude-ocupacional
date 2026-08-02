import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarRange, Clock, Plane, CheckCircle2, Plus } from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import { StatTile } from '@/components/data-display/StatTile';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';

import { useFerias } from '../hooks/useFerias';
import { useCreateFerias, useDeleteFerias, useUpdateFerias } from '../hooks/useFeriasMutations';
import { useFilteredFerias } from '../hooks/useFeriasFilters';
import { fromFormInput } from '../types';
import type { VacationFilters, VacationFormInput, VacationRecord } from '../types';

import { FiltersBar } from '../components/FiltersBar';
import { FeriasTable } from '../components/FeriasTable';
import { FeriasDialog } from '../components/FeriasDialog';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';

export function FeriasPage() {
  const { t } = useTranslation('ferias');
  const { data: allRecords, isLoading, isError, refetch } = useFerias();
  const records = useMemo(() => allRecords ?? [], [allRecords]);

  const [filters, setFilters] = useState<VacationFilters>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<VacationRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VacationRecord | null>(null);

  const filteredRecords = useFilteredFerias(records, filters);

  const createMutation = useCreateFerias();
  const updateMutation = useUpdateFerias();
  const deleteMutation = useDeleteFerias();

  const kpis = useMemo(() => {
    const agendadas = records.filter((r) => r.status === 'agendado').length;
    const emAndamento = records.filter((r) => r.status === 'em_andamento').length;
    const concluidas = records.filter((r) => r.status === 'concluido').length;
    return { total: records.length, agendadas, emAndamento, concluidas };
  }, [records]);

  function handleFilterChange(patch: Partial<VacationFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  function handleClearAll() {
    setFilters({});
  }

  function handleCreate() {
    setEditingRecord(null);
    setDialogOpen(true);
  }

  function handleEdit(record: VacationRecord) {
    setEditingRecord(record);
    setDialogOpen(true);
  }

  function handleSubmit(input: VacationFormInput) {
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
        eyebrow={t('ferias:page.eyebrow')}
        title={t('ferias:page.title')}
        description={t('ferias:page.description')}
        actions={
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
            {t('ferias:actions.new')}
          </Button>
        }
      />

      <div className="space-y-8 px-6 py-8 sm:px-8">
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-[112px] w-full" />
            ))}
          </div>
        )}

        {isError && (
          <ErrorState
            title={t('ferias:error.title')}
            description={t('ferias:error.description')}
            action={
              <Button variant="outline" onClick={() => void refetch()}>
                {t('ferias:actions.retry')}
              </Button>
            }
          />
        )}

        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatTile
                label={t('ferias:kpi.total')}
                value={kpis.total}
                icon={<CalendarRange className="h-4 w-4" />}
              />
              <StatTile
                label={t('ferias:kpi.scheduled')}
                value={kpis.agendadas}
                icon={<Clock className="h-4 w-4" />}
              />
              <StatTile
                label={t('ferias:kpi.ongoing')}
                value={kpis.emAndamento}
                icon={<Plane className="h-4 w-4" />}
              />
              <StatTile
                label={t('ferias:kpi.completed')}
                value={kpis.concluidas}
                icon={<CheckCircle2 className="h-4 w-4" />}
              />
            </div>

            <Separator />

            <FiltersBar
              filters={filters}
              onChange={handleFilterChange}
              onClearAll={handleClearAll}
            />

            <FeriasTable records={filteredRecords} onEdit={handleEdit} onDelete={setDeleteTarget} />
          </>
        )}
      </div>

      <FeriasDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingRecord={editingRecord}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        record={deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isSubmitting={deleteMutation.isPending}
      />
    </>
  );
}

export default FeriasPage;

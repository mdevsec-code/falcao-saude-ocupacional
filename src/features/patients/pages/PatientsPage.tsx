import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, UserCheck, UserX, Briefcase, Plus } from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import { StatTile } from '@/components/data-display/StatTile';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';

import { usePatients } from '../hooks/usePatients';
import { useCreatePatient, useDeletePatient, useUpdatePatient } from '../hooks/usePatientMutations';
import { useFilteredPatients } from '../hooks/usePatientFilters';
import { fromFormInput } from '../types';
import type { PatientFilters, PatientFormInput, PatientRecord } from '../types';

import { FiltersBar } from '../components/FiltersBar';
import { PatientsTable } from '../components/PatientsTable';
import { PatientDialog } from '../components/PatientDialog';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';

export function PatientsPage() {
  const { t } = useTranslation('patients');
  const { data: allRecords, isLoading, isError, refetch } = usePatients();
  const records = useMemo(() => allRecords ?? [], [allRecords]);

  const [filters, setFilters] = useState<PatientFilters>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PatientRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PatientRecord | null>(null);

  const filteredRecords = useFilteredPatients(records, filters);

  const createMutation = useCreatePatient();
  const updateMutation = useUpdatePatient();
  const deleteMutation = useDeletePatient();

  const kpis = useMemo(() => {
    const ativos = records.filter((r) => r.status === 'ativo').length;
    const afastados = records.filter((r) => r.status === 'afastado').length;
    const setores = new Set(records.map((r) => r.sector)).size;
    return { total: records.length, ativos, afastados, setores };
  }, [records]);

  function handleFilterChange(patch: Partial<PatientFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  function handleClearAll() {
    setFilters({});
  }

  function handleCreate() {
    setEditingRecord(null);
    setDialogOpen(true);
  }

  function handleEdit(record: PatientRecord) {
    setEditingRecord(record);
    setDialogOpen(true);
  }

  function handleSubmit(input: PatientFormInput) {
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
        eyebrow={t('patients:page.eyebrow')}
        title={t('patients:page.title')}
        description={t('patients:page.description')}
        actions={
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
            {t('patients:actions.new')}
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
            title={t('patients:error.title')}
            description={t('patients:error.description')}
            action={
              <Button variant="outline" onClick={() => void refetch()}>
                {t('patients:actions.retry')}
              </Button>
            }
          />
        )}

        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatTile
                label={t('patients:kpi.total')}
                value={kpis.total}
                icon={<Users className="h-4 w-4" />}
              />
              <StatTile
                label={t('patients:kpi.active')}
                value={kpis.ativos}
                icon={<UserCheck className="h-4 w-4" />}
              />
              <StatTile
                label={t('patients:kpi.onLeave')}
                value={kpis.afastados}
                icon={<UserX className="h-4 w-4" />}
              />
              <StatTile
                label={t('patients:kpi.sectors')}
                value={kpis.setores}
                icon={<Briefcase className="h-4 w-4" />}
              />
            </div>

            <Separator />

            <FiltersBar
              filters={filters}
              onChange={handleFilterChange}
              onClearAll={handleClearAll}
            />

            <PatientsTable
              records={filteredRecords}
              onEdit={handleEdit}
              onDelete={setDeleteTarget}
            />
          </>
        )}
      </div>

      <PatientDialog
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

export default PatientsPage;

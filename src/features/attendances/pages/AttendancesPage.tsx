import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardCheck, CircleCheck, ShieldAlert, TriangleAlert, Plus } from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import { StatTile } from '@/components/data-display/StatTile';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { usePatients } from '@/features/patients/hooks/usePatients';
import { useActiveExamNames } from '@/features/exams/hooks/useExamTypes';
import { APPOINTMENT_CONCLUSION } from '@/constants/status';

import { useAttendances } from '../hooks/useAttendances';
import {
  useCreateAttendance,
  useDeleteAttendance,
  useUpdateAttendance,
} from '../hooks/useAttendanceMutations';
import { useFilteredAttendances } from '../hooks/useAttendanceFilters';
import { fromFormInput } from '../types';
import type { AttendanceFilters, AttendanceFormInput, AttendanceRecord } from '../types';

import { FiltersBar } from '../components/FiltersBar';
import { AttendancesTable } from '../components/AttendancesTable';
import { AttendanceDialog } from '../components/AttendanceDialog';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';

export function AttendancesPage() {
  const { t } = useTranslation(['attendances', 'common']);
  const { data: allRecords, isLoading, isError, refetch } = useAttendances();
  const { data: allPatients } = usePatients();
  const records = useMemo(() => allRecords ?? [], [allRecords]);
  const patients = useMemo(() => allPatients ?? [], [allPatients]);
  const examTypes = useActiveExamNames();

  const [filters, setFilters] = useState<AttendanceFilters>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AttendanceRecord | null>(null);

  const filteredRecords = useFilteredAttendances(records, filters);

  const createMutation = useCreateAttendance();
  const updateMutation = useUpdateAttendance();
  const deleteMutation = useDeleteAttendance();

  const kpis = useMemo(() => {
    const aptos = records.filter((r) => r.conclusion === APPOINTMENT_CONCLUSION.APTO).length;
    const restricao = records.filter(
      (r) => r.conclusion === APPOINTMENT_CONCLUSION.APTO_COM_RESTRICAO,
    ).length;
    const atencao = records.filter(
      (r) =>
        r.conclusion === APPOINTMENT_CONCLUSION.INAPTO ||
        r.conclusion === APPOINTMENT_CONCLUSION.ENCAMINHADO,
    ).length;
    return { total: records.length, aptos, restricao, atencao };
  }, [records]);

  function handleFilterChange(patch: Partial<AttendanceFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  function handleClearAll() {
    setFilters({});
  }

  function handleCreate() {
    setEditingRecord(null);
    setDialogOpen(true);
  }

  function handleEdit(record: AttendanceRecord) {
    setEditingRecord(record);
    setDialogOpen(true);
  }

  function handleSubmit(input: AttendanceFormInput) {
    const patient = patients.find((p) => p.id === input.patientId);
    const patientName = patient?.name ?? editingRecord?.patientName ?? '';

    if (editingRecord) {
      updateMutation.mutate(
        { id: editingRecord.id, patch: fromFormInput(input, patientName) },
        { onSuccess: () => setDialogOpen(false) },
      );
    } else {
      createMutation.mutate(fromFormInput(input, patientName), {
        onSuccess: () => setDialogOpen(false),
      });
    }
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  }

  return (
    <>
      <PageHeader
        eyebrow={t('attendances:page.eyebrow')}
        title={t('attendances:page.title')}
        description={t('attendances:page.description')}
        actions={
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
            {t('attendances:actions.new')}
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
            title={t('attendances:error.title')}
            description={t('attendances:error.description')}
            action={
              <Button variant="outline" onClick={() => void refetch()}>
                {t('common:actions.retry')}
              </Button>
            }
          />
        )}

        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatTile
                label={t('attendances:kpi.total')}
                value={kpis.total}
                icon={<ClipboardCheck className="h-4 w-4" />}
              />
              <StatTile
                label={t('attendances:kpi.aptos')}
                value={kpis.aptos}
                icon={<CircleCheck className="h-4 w-4" />}
              />
              <StatTile
                label={t('attendances:kpi.restricao')}
                value={kpis.restricao}
                icon={<ShieldAlert className="h-4 w-4" />}
              />
              <StatTile
                label={t('attendances:kpi.atencao')}
                value={kpis.atencao}
                icon={<TriangleAlert className="h-4 w-4" />}
              />
            </div>

            <Separator />

            <FiltersBar
              patients={patients}
              examTypes={examTypes}
              filters={filters}
              onChange={handleFilterChange}
              onClearAll={handleClearAll}
            />

            <AttendancesTable
              records={filteredRecords}
              patients={patients}
              onEdit={handleEdit}
              onDelete={setDeleteTarget}
            />
          </>
        )}
      </div>

      <AttendanceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingRecord={editingRecord}
        patients={patients}
        examTypes={examTypes}
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

export default AttendancesPage;

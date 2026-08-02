import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/layout/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/Button';

import { useActiveExamNames } from '@/features/exams/hooks/useExamTypes';
import { useAppointments } from '../hooks/useAppointments';
import {
  useCreateAppointment,
  useDeleteAppointment,
  useUpdateAppointment,
} from '../hooks/useAppointmentMutations';
import { useFilteredAppointments } from '../hooks/useAgendaFilters';
import {
  addDays,
  addMonths,
  formatWeekRangeLabel,
  getWeekDays,
  formatMonthLabel,
  formatDayLabel,
} from '../lib/calendar';
import { fromFormInput } from '../types';
import type { AgendaFilters, AgendaView, AppointmentFormInput, AppointmentRecord } from '../types';

import { CalendarToolbar } from '../components/CalendarToolbar';
import { MonthView } from '../components/MonthView';
import { WeekView } from '../components/WeekView';
import { DayView } from '../components/DayView';
import { AppointmentDialog } from '../components/AppointmentDialog';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';

export function AgendaPage() {
  const { t, i18n } = useTranslation('agenda');
  const { data: allRecords, isLoading, isError, refetch } = useAppointments();
  const records = allRecords ?? [];
  const examTypes = useActiveExamNames();

  const [view, setView] = useState<AgendaView>('month');
  const [anchor, setAnchor] = useState(() => new Date());
  const [filters, setFilters] = useState<AgendaFilters>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AppointmentRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppointmentRecord | null>(null);

  const filteredRecords = useFilteredAppointments(records, filters);

  const createMutation = useCreateAppointment();
  const updateMutation = useUpdateAppointment();
  const deleteMutation = useDeleteAppointment();

  // `i18n.language` força recomputar o label (nomes de mês/dia) ao trocar
  // idioma — o eslint não enxerga essa dependência porque ela é lida
  // dentro de `formatMonthLabel`/`formatDayLabel`, não neste callback.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const label = useMemo(() => {
    if (view === 'month') return formatMonthLabel(anchor);
    if (view === 'week') return formatWeekRangeLabel(getWeekDays(anchor));
    return formatDayLabel(anchor);
  }, [view, anchor, i18n.language]);

  function handlePrev() {
    if (view === 'month') setAnchor((d) => addMonths(d, -1));
    else if (view === 'week') setAnchor((d) => addDays(d, -7));
    else setAnchor((d) => addDays(d, -1));
  }

  function handleNext() {
    if (view === 'month') setAnchor((d) => addMonths(d, 1));
    else if (view === 'week') setAnchor((d) => addDays(d, 7));
    else setAnchor((d) => addDays(d, 1));
  }

  function handleToday() {
    setAnchor(new Date());
  }

  function handleSelectDay(date: Date) {
    setAnchor(date);
    setView('day');
  }

  function handleCreate() {
    setEditingRecord(null);
    setDialogOpen(true);
  }

  function handleEdit(record: AppointmentRecord) {
    setEditingRecord(record);
    setDialogOpen(true);
  }

  function handleSubmit(input: AppointmentFormInput) {
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
        eyebrow={t('agenda:page.eyebrow')}
        title={t('agenda:page.title')}
        description={t('agenda:page.description')}
      />

      <div className="space-y-6 px-6 py-8 sm:px-8">
        <CalendarToolbar
          view={view}
          onViewChange={setView}
          label={label}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
          filters={filters}
          onFiltersChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
          onCreate={handleCreate}
          examTypes={examTypes}
        />

        {isLoading && (
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 21 }).map((_, idx) => (
              <Skeleton key={idx} className="h-24 w-full" />
            ))}
          </div>
        )}

        {isError && (
          <ErrorState
            title={t('agenda:error.title')}
            description={t('agenda:error.description')}
            action={
              <Button variant="outline" onClick={() => void refetch()}>
                {t('agenda:actions.retry')}
              </Button>
            }
          />
        )}

        {!isLoading && !isError && view === 'month' && (
          <MonthView
            monthAnchor={anchor}
            records={filteredRecords}
            onSelectDay={handleSelectDay}
            onEditAppointment={handleEdit}
          />
        )}

        {!isLoading && !isError && view === 'week' && (
          <WeekView
            weekAnchor={anchor}
            records={filteredRecords}
            onSelectDay={handleSelectDay}
            onEditAppointment={handleEdit}
          />
        )}

        {!isLoading && !isError && view === 'day' && (
          <DayView
            dayAnchor={anchor}
            records={filteredRecords}
            onEditAppointment={handleEdit}
            onDeleteAppointment={setDeleteTarget}
          />
        )}
      </div>

      <AppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingRecord={editingRecord}
        defaultDate={view === 'day' || view === 'week' ? anchor : undefined}
        allRecords={records}
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

export default AgendaPage;

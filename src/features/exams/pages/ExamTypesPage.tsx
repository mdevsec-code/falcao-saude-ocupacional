import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/Button';

import { useExamTypes } from '../hooks/useExamTypes';
import { useCreateExamType, useDeleteExamType, useUpdateExamType } from '../hooks/useExamTypeMutations';
import { fromFormInput } from '../types';
import type { ExamTypeFormInput, ExamTypeRecord } from '../types';

import { ExamTypesTable } from '../components/ExamTypesTable';
import { ExamTypeDialog } from '../components/ExamTypeDialog';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';

export function ExamTypesPage() {
  const { t } = useTranslation('exams');
  const { data: allRecords, isLoading, isError, refetch } = useExamTypes();
  const records = allRecords ?? [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ExamTypeRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ExamTypeRecord | null>(null);

  const createMutation = useCreateExamType();
  const updateMutation = useUpdateExamType();
  const deleteMutation = useDeleteExamType();

  function handleCreate() {
    setEditingRecord(null);
    setDialogOpen(true);
  }

  function handleEdit(record: ExamTypeRecord) {
    setEditingRecord(record);
    setDialogOpen(true);
  }

  function handleSubmit(input: ExamTypeFormInput) {
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
        eyebrow={t('exams:page.eyebrow')}
        title={t('exams:page.title')}
        description={t('exams:page.description')}
        actions={
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
            Novo tipo de exame
          </Button>
        }
      />

      <div className="space-y-6 px-6 py-8 sm:px-8">
        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} className="h-12 w-full" />
            ))}
          </div>
        )}

        {isError && (
          <ErrorState
            title={t('exams:error.title')}
            description={t('exams:error.description')}
            action={
              <Button variant="outline" onClick={() => void refetch()}>
                Tentar novamente
              </Button>
            }
          />
        )}

        {!isLoading && !isError && (
          <ExamTypesTable records={records} onEdit={handleEdit} onDelete={setDeleteTarget} />
        )}
      </div>

      <ExamTypeDialog
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

export default ExamTypesPage;

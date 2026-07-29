import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';

import { useUsers } from '../hooks/useUsers';
import { useCreateUser, useDeleteUser, useUpdateUser } from '../hooks/useUserMutations';
import { fromFormInput } from '../types';
import type { UserFormInput, UserRecord } from '../types';

import { UsersTable } from '../components/UsersTable';
import { UserDialog } from '../components/UserDialog';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';

export function UsersPage() {
  const { t } = useTranslation('users');
  const { user: currentUser } = useAuth();
  const { data: allRecords, isLoading, isError, refetch } = useUsers();
  const records = allRecords ?? [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<UserRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserRecord | null>(null);

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  function handleCreate() {
    setEditingRecord(null);
    setDialogOpen(true);
  }

  function handleEdit(record: UserRecord) {
    setEditingRecord(record);
    setDialogOpen(true);
  }

  function handleSubmit(input: UserFormInput) {
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
        eyebrow={t('users:page.eyebrow')}
        title={t('users:page.title')}
        description={t('users:page.description')}
        actions={
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
            Novo usuário
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
            title={t('users:error.title')}
            description={t('users:error.description')}
            action={
              <Button variant="outline" onClick={() => void refetch()}>
                Tentar novamente
              </Button>
            }
          />
        )}

        {!isLoading && !isError && (
          <UsersTable
            records={records}
            currentUserId={currentUser?.id}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
          />
        )}
      </div>

      <UserDialog
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

export default UsersPage;

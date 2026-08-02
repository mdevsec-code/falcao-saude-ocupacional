import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import type { UserRecord } from '../types';

interface DeleteConfirmDialogProps {
  record: UserRecord | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function DeleteConfirmDialog({
  record,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: DeleteConfirmDialogProps) {
  const { t } = useTranslation('users');
  return (
    <Dialog open={record !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('users:deleteDialog.title')}</DialogTitle>
          <DialogDescription>
            {record && (
              <>
                {t('users:deleteDialog.descriptionBefore')}
                <strong className="text-ink">{record.name}</strong>
                {t('users:deleteDialog.descriptionAfter')}
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('users:actions.cancel')}
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isSubmitting}>
            {t('users:actions.remove')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

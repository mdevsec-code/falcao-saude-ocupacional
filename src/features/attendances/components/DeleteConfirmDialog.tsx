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
import type { AttendanceRecord } from '../types';

interface DeleteConfirmDialogProps {
  record: AttendanceRecord | null;
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
  const { t } = useTranslation(['attendances', 'common']);

  return (
    <Dialog open={record !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('attendances:delete.title')}</DialogTitle>
          <DialogDescription>
            {record && (
              <>
                {t('attendances:delete.descriptionBefore')}
                <strong className="text-ink">{record.patientName}</strong>
                {t('attendances:delete.descriptionAfter')}
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common:actions.cancel')}
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isSubmitting}>
            {t('attendances:delete.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

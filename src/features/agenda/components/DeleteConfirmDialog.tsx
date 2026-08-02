import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import type { AppointmentRecord } from '../types';

interface DeleteConfirmDialogProps {
  record: AppointmentRecord | null;
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
  const { t } = useTranslation('agenda');

  return (
    <Dialog open={record !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('agenda:dialog.deleteTitle')}</DialogTitle>
          <DialogDescription>
            {record && (
              <Trans
                i18nKey="agenda:dialog.deleteDescription"
                values={{ name: record.patientName }}
                components={{ 1: <strong className="text-ink" /> }}
              />
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('agenda:actions.cancel')}
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isSubmitting}>
            {t('agenda:actions.remove')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
import type { PatientRecord } from '../types';

interface DeleteConfirmDialogProps {
  record: PatientRecord | null;
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
  const { t } = useTranslation('patients');

  return (
    <Dialog open={record !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('patients:deleteDialog.title')}</DialogTitle>
          <DialogDescription>
            {record && (
              <Trans
                i18nKey="patients:deleteDialog.description"
                values={{ name: record.name }}
                components={{ strong: <strong className="text-ink" /> }}
              />
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('patients:deleteDialog.cancel')}
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isSubmitting}>
            {t('patients:deleteDialog.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

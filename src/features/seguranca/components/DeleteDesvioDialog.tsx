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
import { formatDate } from '@/utils/format';
import type { DeviationRecord } from '../types';

interface DeleteDesvioDialogProps {
  record: DeviationRecord | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function DeleteDesvioDialog({
  record,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: DeleteDesvioDialogProps) {
  const { t } = useTranslation('seguranca');

  return (
    <Dialog open={record !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('seguranca:desvios.deleteDialog.title')}</DialogTitle>
          <DialogDescription>
            {record && (
              <Trans
                i18nKey="seguranca:desvios.deleteDialog.description"
                values={{ date: formatDate(record.date) ?? record.date }}
                components={{ strong: <strong className="text-ink" /> }}
              />
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('seguranca:desvios.deleteDialog.cancel')}
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isSubmitting}>
            {t('seguranca:desvios.deleteDialog.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

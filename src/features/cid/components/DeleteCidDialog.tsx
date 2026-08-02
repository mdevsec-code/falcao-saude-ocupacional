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
import type { CidCustomEntry } from '../types';

interface DeleteCidDialogProps {
  record: CidCustomEntry | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function DeleteCidDialog({
  record,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: DeleteCidDialogProps) {
  const { t } = useTranslation('cid');

  return (
    <Dialog open={record !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('cid:deleteDialog.title')}</DialogTitle>
          <DialogDescription>
            {record && (
              <Trans
                i18nKey="cid:deleteDialog.description"
                values={{ code: record.code }}
                components={{ strong: <strong className="text-ink" /> }}
              />
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cid:deleteDialog.cancel')}
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isSubmitting}>
            {t('cid:deleteDialog.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

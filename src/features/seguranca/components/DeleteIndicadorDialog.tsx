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
import { getIntlLocale } from '@/utils/locale';
import type { AccidentIndicatorRecord } from '../indicatorTypes';

interface DeleteIndicadorDialogProps {
  record: AccidentIndicatorRecord | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function DeleteIndicadorDialog({
  record,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: DeleteIndicadorDialogProps) {
  const { t } = useTranslation('seguranca');
  const monthFormatter = new Intl.DateTimeFormat(getIntlLocale(), { month: 'long' });

  return (
    <Dialog open={record !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('seguranca:indicadores.deleteDialog.title')}</DialogTitle>
          <DialogDescription>
            {record && (
              <Trans
                i18nKey="seguranca:indicadores.deleteDialog.description"
                values={{
                  period: `${monthFormatter.format(new Date(record.year, record.month - 1, 1))}/${record.year}`,
                }}
                components={{ strong: <strong className="text-ink" /> }}
              />
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('seguranca:indicadores.deleteDialog.cancel')}
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isSubmitting}>
            {t('seguranca:indicadores.deleteDialog.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
  return (
    <Dialog open={record !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Remover agendamento?</DialogTitle>
          <DialogDescription>
            {record && (
              <>
                A consulta de <strong className="text-ink">{record.patientName}</strong> será removida
                permanentemente. Essa ação não pode ser desfeita.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isSubmitting}>
            Remover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

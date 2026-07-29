import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import type { ExamTypeRecord } from '../types';

interface DeleteConfirmDialogProps {
  record: ExamTypeRecord | null;
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
          <DialogTitle>Remover tipo de exame?</DialogTitle>
          <DialogDescription>
            {record && (
              <>
                <strong className="text-ink">{record.name}</strong> será removido do catálogo.
                Atendimentos e agendamentos já registrados com esse exame não são afetados.
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

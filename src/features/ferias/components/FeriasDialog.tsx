import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { VACATION_STATUS, VACATION_STATUS_LABELS } from '@/constants/status';

import {
  vacationFormSchema,
  SECTORS,
  toFormInput,
  type VacationFormInput,
  type VacationRecord,
} from '../types';

function emptyValues(): VacationFormInput {
  return {
    patientName: '',
    sector: SECTORS[0],
    role: '',
    startDate: '',
    endDate: '',
    status: VACATION_STATUS.AGENDADO,
    notes: undefined,
  };
}

interface FeriasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRecord: VacationRecord | null;
  onSubmit: (input: VacationFormInput) => void;
  isSubmitting: boolean;
}

export function FeriasDialog({
  open,
  onOpenChange,
  editingRecord,
  onSubmit,
  isSubmitting,
}: FeriasDialogProps) {
  const { t } = useTranslation('ferias');
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VacationFormInput>({
    resolver: zodResolver(vacationFormSchema),
    mode: 'onTouched',
    defaultValues: emptyValues(),
  });

  useEffect(() => {
    if (!open) return;
    reset(editingRecord ? toFormInput(editingRecord) : emptyValues());
  }, [open, editingRecord, reset]);

  const submit = handleSubmit((data) => onSubmit(data));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingRecord ? t('ferias:dialog.editTitle') : t('ferias:dialog.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {editingRecord
              ? t('ferias:dialog.editDescription')
              : t('ferias:dialog.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} noValidate className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          <Input
            {...register('patientName')}
            label={t('ferias:dialog.fields.patientName.label')}
            placeholder={t('ferias:dialog.fields.patientName.placeholder')}
            error={errors.patientName?.message}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="ferias-sector">{t('ferias:dialog.fields.sector.label')}</Label>
              <Controller
                control={control}
                name="sector"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="ferias-sector" className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTORS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <Input
              {...register('role')}
              label={t('ferias:dialog.fields.role.label')}
              placeholder={t('ferias:dialog.fields.role.placeholder')}
              error={errors.role?.message}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              {...register('startDate')}
              type="date"
              label={t('ferias:dialog.fields.startDate.label')}
              error={errors.startDate?.message}
              required
            />
            <Input
              {...register('endDate')}
              type="date"
              label={t('ferias:dialog.fields.endDate.label')}
              error={errors.endDate?.message}
              required
            />
          </div>

          <div>
            <Label htmlFor="ferias-status">{t('ferias:dialog.fields.status.label')}</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="ferias-status" className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(VACATION_STATUS).map((status) => (
                      <SelectItem key={status} value={status}>
                        {VACATION_STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <Textarea
            {...register('notes')}
            label={t('ferias:dialog.fields.notes.label')}
            placeholder={t('ferias:dialog.fields.notes.placeholder')}
            error={errors.notes?.message}
            rows={2}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('ferias:dialog.cancel')}
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingRecord ? t('ferias:dialog.submitEdit') : t('ferias:dialog.submitCreate')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

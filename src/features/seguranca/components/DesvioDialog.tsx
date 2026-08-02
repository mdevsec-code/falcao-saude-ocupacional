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
import {
  DEVIATION_CLASSIFICATION,
  DEVIATION_CLASSIFICATION_LABELS,
  DEVIATION_STATUS,
  DEVIATION_STATUS_LABELS,
} from '@/constants/status';

import {
  deviationFormSchema,
  DEVIATION_LOCATIONS,
  toFormInput,
  type DeviationFormInput,
  type DeviationRecord,
} from '../types';

function emptyValues(): DeviationFormInput {
  return {
    date: '',
    location: DEVIATION_LOCATIONS[0],
    classification: DEVIATION_CLASSIFICATION.COMPORTAMENTAL,
    description: '',
    foreman: undefined,
    responsibleTechnician: undefined,
    action: undefined,
    status: DEVIATION_STATUS.PENDENTE,
  };
}

interface DesvioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRecord: DeviationRecord | null;
  onSubmit: (input: DeviationFormInput) => void;
  isSubmitting: boolean;
}

export function DesvioDialog({
  open,
  onOpenChange,
  editingRecord,
  onSubmit,
  isSubmitting,
}: DesvioDialogProps) {
  const { t } = useTranslation('seguranca');
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeviationFormInput>({
    resolver: zodResolver(deviationFormSchema),
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
            {editingRecord
              ? t('seguranca:desvios.dialog.editTitle')
              : t('seguranca:desvios.dialog.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {editingRecord
              ? t('seguranca:desvios.dialog.editDescription')
              : t('seguranca:desvios.dialog.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} noValidate className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <Input
              {...register('date')}
              type="date"
              label={t('seguranca:desvios.dialog.fields.date')}
              error={errors.date?.message}
              required
            />
            <div>
              <Label htmlFor="desvio-location">
                {t('seguranca:desvios.dialog.fields.location')}
              </Label>
              <Controller
                control={control}
                name="location"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="desvio-location" className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEVIATION_LOCATIONS.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="desvio-classification">
              {t('seguranca:desvios.dialog.fields.classification')}
            </Label>
            <Controller
              control={control}
              name="classification"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="desvio-classification" className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DEVIATION_CLASSIFICATION).map((c) => (
                      <SelectItem key={c} value={c}>
                        {DEVIATION_CLASSIFICATION_LABELS[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <Textarea
            {...register('description')}
            label={t('seguranca:desvios.dialog.fields.description')}
            placeholder={t('seguranca:desvios.dialog.fields.descriptionPlaceholder')}
            error={errors.description?.message}
            rows={2}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              {...register('foreman')}
              label={t('seguranca:desvios.dialog.fields.foreman')}
              placeholder={t('seguranca:desvios.dialog.fields.foremanPlaceholder')}
              hint={t('seguranca:desvios.dialog.fields.optional')}
            />
            <Input
              {...register('responsibleTechnician')}
              label={t('seguranca:desvios.dialog.fields.responsibleTechnician')}
              placeholder={t('seguranca:desvios.dialog.fields.responsibleTechnicianPlaceholder')}
              hint={t('seguranca:desvios.dialog.fields.optional')}
            />
          </div>

          <Textarea
            {...register('action')}
            label={t('seguranca:desvios.dialog.fields.action')}
            placeholder={t('seguranca:desvios.dialog.fields.actionPlaceholder')}
            rows={2}
          />

          <div>
            <Label htmlFor="desvio-status">{t('seguranca:desvios.dialog.fields.status')}</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="desvio-status" className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DEVIATION_STATUS).map((status) => (
                      <SelectItem key={status} value={status}>
                        {DEVIATION_STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('seguranca:desvios.dialog.cancel')}
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingRecord
                ? t('seguranca:desvios.dialog.submitEdit')
                : t('seguranca:desvios.dialog.submitCreate')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

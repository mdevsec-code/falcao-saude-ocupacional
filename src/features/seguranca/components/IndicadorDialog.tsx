import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
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
import { getIntlLocale } from '@/utils/locale';

import {
  indicatorFormSchema,
  toFormInput,
  type IndicatorFormInput,
  type AccidentIndicatorRecord,
} from '../indicatorTypes';

function emptyValues(): IndicatorFormInput {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    employees: 0,
    accidentsWithLeave: 0,
    accidentsWithoutLeave: 0,
    daysLostAccidents: 0,
    daysDebited: 0,
  };
}

interface IndicadorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRecord: AccidentIndicatorRecord | null;
  onSubmit: (input: IndicatorFormInput) => void;
  isSubmitting: boolean;
}

export function IndicadorDialog({
  open,
  onOpenChange,
  editingRecord,
  onSubmit,
  isSubmitting,
}: IndicadorDialogProps) {
  const { t } = useTranslation('seguranca');
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IndicatorFormInput>({
    resolver: zodResolver(indicatorFormSchema),
    mode: 'onTouched',
    defaultValues: emptyValues(),
  });

  useEffect(() => {
    if (!open) return;
    reset(editingRecord ? toFormInput(editingRecord) : emptyValues());
  }, [open, editingRecord, reset]);

  const monthOptions = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(getIntlLocale(), { month: 'long' });
    return Array.from({ length: 12 }, (_, idx) => ({
      value: idx + 1,
      label: formatter.format(new Date(2000, idx, 1)),
    }));
  }, []);

  const submit = handleSubmit((data) => onSubmit(data));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingRecord
              ? t('seguranca:indicadores.dialog.editTitle')
              : t('seguranca:indicadores.dialog.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {editingRecord
              ? t('seguranca:indicadores.dialog.editDescription')
              : t('seguranca:indicadores.dialog.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} noValidate className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="indicador-month">
                {t('seguranca:indicadores.dialog.fields.month')}
              </Label>
              <Controller
                control={control}
                name="month"
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger id="indicador-month" className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {monthOptions.map((m) => (
                        <SelectItem key={m.value} value={String(m.value)}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <Input
              {...register('year', { valueAsNumber: true })}
              type="number"
              label={t('seguranca:indicadores.dialog.fields.year')}
              error={errors.year?.message}
              required
            />
          </div>

          <Input
            {...register('employees', { valueAsNumber: true })}
            type="number"
            min={0}
            label={t('seguranca:indicadores.dialog.fields.employees')}
            hint={t('seguranca:indicadores.dialog.fields.employeesHint')}
            error={errors.employees?.message}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              {...register('accidentsWithLeave', { valueAsNumber: true })}
              type="number"
              min={0}
              label={t('seguranca:indicadores.dialog.fields.accidentsWithLeave')}
              error={errors.accidentsWithLeave?.message}
            />
            <Input
              {...register('accidentsWithoutLeave', { valueAsNumber: true })}
              type="number"
              min={0}
              label={t('seguranca:indicadores.dialog.fields.accidentsWithoutLeave')}
              error={errors.accidentsWithoutLeave?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              {...register('daysLostAccidents', { valueAsNumber: true })}
              type="number"
              min={0}
              label={t('seguranca:indicadores.dialog.fields.daysLostAccidents')}
              error={errors.daysLostAccidents?.message}
            />
            <Input
              {...register('daysDebited', { valueAsNumber: true })}
              type="number"
              min={0}
              label={t('seguranca:indicadores.dialog.fields.daysDebited')}
              hint={t('seguranca:indicadores.dialog.fields.daysDebitedHint')}
              error={errors.daysDebited?.message}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('seguranca:indicadores.dialog.cancel')}
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingRecord
                ? t('seguranca:indicadores.dialog.submitEdit')
                : t('seguranca:indicadores.dialog.submitCreate')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

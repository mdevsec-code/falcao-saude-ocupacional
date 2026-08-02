import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
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
  EXAM_CATEGORIES,
  examTypeFormSchema,
  toFormInput,
  type ExamTypeFormInput,
  type ExamTypeRecord,
} from '../types';

function emptyValues(): ExamTypeFormInput {
  return {
    name: '',
    category: 'Complementar',
    defaultDurationMin: 30,
    periodicityMonths: undefined,
    active: true,
    description: undefined,
  };
}

interface ExamTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRecord: ExamTypeRecord | null;
  onSubmit: (input: ExamTypeFormInput) => void;
  isSubmitting: boolean;
}

export function ExamTypeDialog({
  open,
  onOpenChange,
  editingRecord,
  onSubmit,
  isSubmitting,
}: ExamTypeDialogProps) {
  const { t } = useTranslation('exams');
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExamTypeFormInput>({
    resolver: zodResolver(examTypeFormSchema),
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingRecord ? t('exams:dialog.editTitle') : t('exams:dialog.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {editingRecord
              ? t('exams:dialog.editDescription')
              : t('exams:dialog.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} noValidate className="space-y-4">
          <Input
            {...register('name')}
            label={t('exams:dialog.fields.name.label')}
            placeholder={t('exams:dialog.fields.name.placeholder')}
            error={errors.name?.message}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="exam-category">{t('exams:dialog.fields.category.label')}</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="exam-category" className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXAM_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <Input
              {...register('defaultDurationMin')}
              type="number"
              label={t('exams:dialog.fields.duration.label')}
              error={errors.defaultDurationMin?.message}
              required
            />
          </div>

          <Input
            {...register('periodicityMonths')}
            type="number"
            label={t('exams:dialog.fields.periodicity.label')}
            placeholder={t('exams:dialog.fields.periodicity.placeholder')}
            hint={t('exams:dialog.fields.periodicity.hint')}
            error={errors.periodicityMonths?.message}
          />

          <Textarea
            {...register('description')}
            label={t('exams:dialog.fields.description.label')}
            placeholder={t('exams:dialog.fields.description.placeholder')}
            error={errors.description?.message}
            rows={2}
          />

          <Controller
            control={control}
            name="active"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox id="exam-active" checked={field.value} onCheckedChange={field.onChange} />
                <label htmlFor="exam-active" className="text-sm text-ink">
                  {t('exams:dialog.fields.active')}
                </label>
              </div>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('exams:dialog.cancel')}
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingRecord ? t('exams:dialog.submitEdit') : t('exams:dialog.submitCreate')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

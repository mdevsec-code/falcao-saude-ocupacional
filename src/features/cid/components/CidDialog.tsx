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
import type { CidCategory } from '@/constants/cid';

import { cidFormSchema, toFormInput, type CidFormInput, type CidCustomEntry } from '../types';

const CATEGORIES: CidCategory[] = [
  'Osteomuscular',
  'Auditivo',
  'Respiratório',
  'Saúde Mental',
  'Dermatológico',
  'Traumatismos e Acidentes',
  'Exposição Ocupacional',
];

function emptyValues(): CidFormInput {
  return { code: '', description: '', category: 'Osteomuscular' };
}

interface CidDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRecord: CidCustomEntry | null;
  onSubmit: (input: CidFormInput) => void;
  isSubmitting: boolean;
}

export function CidDialog({
  open,
  onOpenChange,
  editingRecord,
  onSubmit,
  isSubmitting,
}: CidDialogProps) {
  const { t } = useTranslation('cid');
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CidFormInput>({
    resolver: zodResolver(cidFormSchema),
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
            {editingRecord ? t('cid:dialog.editTitle') : t('cid:dialog.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {editingRecord ? t('cid:dialog.editDescription') : t('cid:dialog.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} noValidate className="space-y-4">
          <Input
            {...register('code')}
            label={t('cid:dialog.fields.code')}
            placeholder={t('cid:dialog.fields.codePlaceholder')}
            error={errors.code?.message}
            className="font-mono uppercase"
            required
          />

          <Textarea
            {...register('description')}
            label={t('cid:dialog.fields.description')}
            placeholder={t('cid:dialog.fields.descriptionPlaceholder')}
            error={errors.description?.message}
            rows={2}
            required
          />

          <div>
            <Label htmlFor="cid-category">{t('cid:dialog.fields.category')}</Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="cid-category" className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('cid:dialog.cancel')}
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingRecord ? t('cid:dialog.submitEdit') : t('cid:dialog.submitCreate')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

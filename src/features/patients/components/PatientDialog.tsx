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
import { PATIENT_STATUS, PATIENT_STATUS_LABELS } from '@/constants/status';

import {
  patientFormSchema,
  SECTORS,
  toFormInput,
  type PatientFormInput,
  type PatientRecord,
} from '../types';

function emptyValues(): PatientFormInput {
  return {
    name: '',
    cpf: '',
    birthDate: '',
    phone: undefined,
    email: undefined,
    sector: SECTORS[0],
    role: '',
    admissionDate: '',
    status: PATIENT_STATUS.ATIVO,
    notes: undefined,
  };
}

interface PatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRecord: PatientRecord | null;
  onSubmit: (input: PatientFormInput) => void;
  isSubmitting: boolean;
}

export function PatientDialog({
  open,
  onOpenChange,
  editingRecord,
  onSubmit,
  isSubmitting,
}: PatientDialogProps) {
  const { t } = useTranslation('patients');
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormInput>({
    resolver: zodResolver(patientFormSchema),
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
            {editingRecord ? t('patients:dialog.editTitle') : t('patients:dialog.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {editingRecord
              ? t('patients:dialog.editDescription')
              : t('patients:dialog.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} noValidate className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          <Input
            {...register('name')}
            label={t('patients:dialog.fields.name.label')}
            placeholder={t('patients:dialog.fields.name.placeholder')}
            error={errors.name?.message}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              {...register('cpf')}
              label={t('patients:dialog.fields.cpf.label')}
              placeholder={t('patients:dialog.fields.cpf.placeholder')}
              error={errors.cpf?.message}
              required
            />
            <Input
              {...register('birthDate')}
              type="date"
              label={t('patients:dialog.fields.birthDate.label')}
              error={errors.birthDate?.message}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              {...register('phone')}
              label={t('patients:dialog.fields.phone.label')}
              placeholder={t('patients:dialog.fields.phone.placeholder')}
              error={errors.phone?.message}
              hint={t('patients:dialog.fields.optional')}
            />
            <Input
              {...register('email')}
              type="email"
              label={t('patients:dialog.fields.email.label')}
              placeholder={t('patients:dialog.fields.email.placeholder')}
              error={errors.email?.message}
              hint={t('patients:dialog.fields.optional')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="patient-sector">{t('patients:dialog.fields.sector.label')}</Label>
              <Controller
                control={control}
                name="sector"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="patient-sector" className="mt-1 w-full">
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
              label={t('patients:dialog.fields.role.label')}
              placeholder={t('patients:dialog.fields.role.placeholder')}
              error={errors.role?.message}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              {...register('admissionDate')}
              type="date"
              label={t('patients:dialog.fields.admissionDate.label')}
              error={errors.admissionDate?.message}
              required
            />

            <div>
              <Label htmlFor="patient-status">{t('patients:dialog.fields.status.label')}</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="patient-status" className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(PATIENT_STATUS).map((status) => (
                        <SelectItem key={status} value={status}>
                          {PATIENT_STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <Textarea
            {...register('notes')}
            label={t('patients:dialog.fields.notes.label')}
            placeholder={t('patients:dialog.fields.notes.placeholder')}
            error={errors.notes?.message}
            rows={2}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('patients:dialog.cancel')}
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingRecord ? t('patients:dialog.submitEdit') : t('patients:dialog.submitCreate')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

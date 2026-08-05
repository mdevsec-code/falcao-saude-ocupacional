import { useEffect } from 'react';
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
import { ALL_ROLES, ROLE_LABELS, ROLES } from '@/constants/roles';

import { buildUserFormSchema, toFormInput, type UserFormInput, type UserRecord } from '../types';

function emptyValues(): UserFormInput {
  return { name: '', email: '', role: ROLES.RECEPCAO, status: 'active', password: '' };
}

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRecord: UserRecord | null;
  onSubmit: (input: UserFormInput) => void;
  isSubmitting: boolean;
}

export function UserDialog({
  open,
  onOpenChange,
  editingRecord,
  onSubmit,
  isSubmitting,
}: UserDialogProps) {
  const { t } = useTranslation('users');
  const isCreate = !editingRecord;
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormInput>({
    resolver: zodResolver(buildUserFormSchema(isCreate)),
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
            {editingRecord ? t('users:dialog.editTitle') : t('users:dialog.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {editingRecord
              ? t('users:dialog.editDescription')
              : t('users:dialog.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} noValidate className="space-y-4">
          <Input
            {...register('name')}
            label={t('users:form.fullName')}
            placeholder={t('users:form.fullNamePlaceholder')}
            error={errors.name?.message}
            required
          />

          <Input
            {...register('email')}
            type="email"
            label={t('users:form.email')}
            placeholder={t('users:form.emailPlaceholder')}
            error={errors.email?.message}
            required
          />

          {isCreate && (
            <Input
              {...register('password')}
              type="password"
              label={t('users:form.password')}
              placeholder={t('users:form.passwordPlaceholder')}
              error={errors.password?.message}
              required
            />
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="user-role">{t('users:form.role')}</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="user-role" className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label htmlFor="user-status">{t('users:form.status')}</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="user-status" className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('users:status.active')}</SelectItem>
                      <SelectItem value="inactive">{t('users:status.inactive')}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('users:actions.cancel')}
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingRecord ? t('users:actions.saveChanges') : t('users:actions.createUser')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

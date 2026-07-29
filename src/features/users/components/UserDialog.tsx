import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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

import { toFormInput, userFormSchema, type UserFormInput, type UserRecord } from '../types';

function emptyValues(): UserFormInput {
  return { name: '', email: '', role: ROLES.RECEPCAO, status: 'active' };
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
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormInput>({
    resolver: zodResolver(userFormSchema),
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
          <DialogTitle>{editingRecord ? 'Editar usuário' : 'Novo usuário'}</DialogTitle>
          <DialogDescription>
            {editingRecord
              ? 'Atualize os dados de acesso do usuário.'
              : 'Cadastre um novo usuário e defina seu perfil de acesso.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} noValidate className="space-y-4">
          <Input
            {...register('name')}
            label="Nome completo"
            placeholder="Nome do usuário"
            error={errors.name?.message}
            required
          />

          <Input
            {...register('email')}
            type="email"
            label="E-mail"
            placeholder="usuario@falcao.com"
            error={errors.email?.message}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="user-role">Perfil de acesso</Label>
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
              <Label htmlFor="user-status">Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="user-status" className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingRecord ? 'Salvar alterações' : 'Criar usuário'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

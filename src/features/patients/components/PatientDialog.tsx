import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
          <DialogTitle>{editingRecord ? 'Editar paciente' : 'Novo paciente'}</DialogTitle>
          <DialogDescription>
            {editingRecord
              ? 'Atualize os dados cadastrais do paciente.'
              : 'Preencha os dados para cadastrar um novo paciente.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} noValidate className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          <Input
            {...register('name')}
            label="Nome completo"
            placeholder="Nome do paciente"
            error={errors.name?.message}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              {...register('cpf')}
              label="CPF"
              placeholder="000.000.000-00"
              error={errors.cpf?.message}
              required
            />
            <Input
              {...register('birthDate')}
              type="date"
              label="Data de nascimento"
              error={errors.birthDate?.message}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              {...register('phone')}
              label="Telefone"
              placeholder="11987654321"
              error={errors.phone?.message}
              hint="Opcional"
            />
            <Input
              {...register('email')}
              type="email"
              label="E-mail"
              placeholder="paciente@email.com"
              error={errors.email?.message}
              hint="Opcional"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="patient-sector">Setor</Label>
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
              label="Função/Cargo"
              placeholder="Ex.: Pedreiro"
              error={errors.role?.message}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              {...register('admissionDate')}
              type="date"
              label="Data de admissão"
              error={errors.admissionDate?.message}
              required
            />

            <div>
              <Label htmlFor="patient-status">Status</Label>
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
            label="Observações"
            placeholder="Detalhes adicionais (opcional)"
            error={errors.notes?.message}
            rows={2}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingRecord ? 'Salvar alterações' : 'Cadastrar paciente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

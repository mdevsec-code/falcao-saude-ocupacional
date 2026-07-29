import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle } from 'lucide-react';

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

import { hasConflict } from '../lib/calendar';
import {
  appointmentFormSchema,
  DOCTORS,
  toFormInput,
  type AppointmentFormInput,
  type AppointmentRecord,
} from '../types';
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_LABELS } from '@/constants/status';

const DURATIONS = [15, 30, 45, 60, 90, 120] as const;

function todayISODate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function defaultValuesFor(defaultDate?: Date, defaultExamType = ''): AppointmentFormInput {
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    patientName: '',
    phone: undefined,
    examType: defaultExamType,
    doctor: DOCTORS[0],
    status: APPOINTMENT_STATUS.AGENDADO,
    date: defaultDate
      ? `${defaultDate.getFullYear()}-${pad(defaultDate.getMonth() + 1)}-${pad(defaultDate.getDate())}`
      : todayISODate(),
    time: '09:00',
    durationMin: 30,
    notes: undefined,
  };
}

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRecord: AppointmentRecord | null;
  defaultDate?: Date;
  allRecords: readonly AppointmentRecord[];
  examTypes: readonly string[];
  onSubmit: (input: AppointmentFormInput) => void;
  isSubmitting: boolean;
}

export function AppointmentDialog({
  open,
  onOpenChange,
  editingRecord,
  defaultDate,
  allRecords,
  examTypes,
  onSubmit,
  isSubmitting,
}: AppointmentDialogProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormInput>({
    resolver: zodResolver(appointmentFormSchema),
    mode: 'onTouched',
    defaultValues: defaultValuesFor(defaultDate, examTypes[0]),
  });

  useEffect(() => {
    if (!open) return;
    reset(editingRecord ? toFormInput(editingRecord) : defaultValuesFor(defaultDate, examTypes[0]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editingRecord]);

  const [date, time, durationMin, doctor] = watch(['date', 'time', 'durationMin', 'doctor']);

  const conflict = useMemo(() => {
    if (!date || !time || !doctor) return false;
    const startsAt = `${date}T${time}:00`;
    if (Number.isNaN(new Date(startsAt).getTime())) return false;
    return hasConflict(
      allRecords,
      { doctor, startsAt, durationMin: Number(durationMin) || 0 },
      editingRecord?.id,
    );
  }, [allRecords, date, time, durationMin, doctor, editingRecord?.id]);

  const submit = handleSubmit((data) => {
    if (conflict) return;
    onSubmit(data);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingRecord ? 'Editar agendamento' : 'Novo agendamento'}</DialogTitle>
          <DialogDescription>
            {editingRecord
              ? 'Atualize os dados da consulta.'
              : 'Preencha os dados para agendar uma nova consulta.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} noValidate className="space-y-4">
          <Input
            {...register('patientName')}
            label="Paciente"
            placeholder="Nome completo"
            error={errors.patientName?.message}
            required
          />

          <Input
            {...register('phone')}
            label="Telefone (WhatsApp)"
            placeholder="11987654321"
            error={errors.phone?.message}
            hint="Opcional — usado para retorno via WhatsApp"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="apt-exam">Tipo de exame</Label>
              <Controller
                control={control}
                name="examType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="apt-exam" className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {examTypes.map((exam) => (
                        <SelectItem key={exam} value={exam}>
                          {exam}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label htmlFor="apt-doctor">Médico</Label>
              <Controller
                control={control}
                name="doctor"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="apt-doctor" className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCTORS.map((doc) => (
                        <SelectItem key={doc} value={doc}>
                          {doc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Input
              {...register('date')}
              type="date"
              label="Data"
              error={errors.date?.message}
              className="col-span-2 sm:col-span-1"
              required
            />
            <Input
              {...register('time')}
              type="time"
              label="Horário"
              error={errors.time?.message}
              className="col-span-2 sm:col-span-1"
              required
            />
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="apt-duration">Duração</Label>
              <Controller
                control={control}
                name="durationMin"
                render={({ field }) => (
                  <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                    <SelectTrigger id="apt-duration" className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATIONS.map((d) => (
                        <SelectItem key={d} value={String(d)}>
                          {d} min
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="apt-status">Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="apt-status" className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(APPOINTMENT_STATUS).map((status) => (
                        <SelectItem key={status} value={status}>
                          {APPOINTMENT_STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {conflict && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger"
            >
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Este médico já tem um agendamento nesse horário. Ajuste a data/hora ou escolha outro
              profissional.
            </p>
          )}

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
            <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={conflict}>
              {editingRecord ? 'Salvar alterações' : 'Criar agendamento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

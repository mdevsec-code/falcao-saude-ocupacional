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
import { APPOINTMENT_CONCLUSION, APPOINTMENT_CONCLUSION_LABELS } from '@/constants/status';
import { ALL_DUTY_TYPES, DUTY_TYPE_LABELS, ROLE_DEFAULT_DUTIES, type DutyType } from '@/constants/duties';
import type { PatientRecord } from '@/features/patients/types';

import {
  attendanceFormSchema,
  DOCTORS,
  toFormInput,
  type AttendanceFormInput,
  type AttendanceRecord,
  type DutyFitness,
} from '../types';

type DutyStatus = 'not_assessed' | 'fit' | 'unfit';

function todayISODate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function defaultDutyFitnessForRole(role?: string): DutyFitness[] {
  if (!role) return [];
  const duties = ROLE_DEFAULT_DUTIES[role] ?? [];
  return duties.map((duty) => ({ duty, fit: true }));
}

function emptyValues(
  defaultPatientId?: string,
  role?: string,
  defaultExamType = '',
): AttendanceFormInput {
  return {
    patientId: defaultPatientId ?? '',
    examType: defaultExamType,
    doctor: DOCTORS[0],
    conclusion: APPOINTMENT_CONCLUSION.APTO,
    attendanceDate: todayISODate(),
    restrictionNotes: undefined,
    notes: undefined,
    dutyFitness: defaultDutyFitnessForRole(role),
  };
}

function statusOf(dutyFitness: DutyFitness[], duty: DutyType): DutyStatus {
  const entry = dutyFitness.find((d) => d.duty === duty);
  if (!entry) return 'not_assessed';
  return entry.fit ? 'fit' : 'unfit';
}

function withStatus(dutyFitness: DutyFitness[], duty: DutyType, status: DutyStatus): DutyFitness[] {
  const rest = dutyFitness.filter((d) => d.duty !== duty);
  if (status === 'not_assessed') return rest;
  return [...rest, { duty, fit: status === 'fit' }];
}

interface AttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRecord: AttendanceRecord | null;
  patients: readonly PatientRecord[];
  examTypes: readonly string[];
  onSubmit: (input: AttendanceFormInput) => void;
  isSubmitting: boolean;
}

export function AttendanceDialog({
  open,
  onOpenChange,
  editingRecord,
  patients,
  examTypes,
  onSubmit,
  isSubmitting,
}: AttendanceDialogProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AttendanceFormInput>({
    resolver: zodResolver(attendanceFormSchema),
    mode: 'onTouched',
    defaultValues: emptyValues(undefined, undefined, examTypes[0]),
  });

  useEffect(() => {
    if (!open) return;
    reset(editingRecord ? toFormInput(editingRecord) : emptyValues(undefined, undefined, examTypes[0]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editingRecord, reset]);

  const conclusion = watch('conclusion');
  const dutyFitness = watch('dutyFitness');
  const submit = handleSubmit((data) => onSubmit(data));

  function handlePatientChange(patientId: string) {
    setValue('patientId', patientId, { shouldValidate: true, shouldDirty: true });
    if (editingRecord) return; // não sobrescreve avaliação já registrada ao editar
    const patient = patients.find((p) => p.id === patientId);
    setValue('dutyFitness', defaultDutyFitnessForRole(patient?.role));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingRecord ? 'Editar atendimento' : 'Novo atendimento'}</DialogTitle>
          <DialogDescription>
            {editingRecord
              ? 'Atualize os dados do atendimento.'
              : 'Registre um atendimento clínico realizado.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} noValidate className="max-h-[75vh] space-y-4 overflow-y-auto pr-1">
          <div>
            <Label htmlFor="att-patient">Paciente</Label>
            <Controller
              control={control}
              name="patientId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={handlePatientChange}>
                  <SelectTrigger id="att-patient" className="mt-1 w-full">
                    <SelectValue placeholder="Selecione o paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.patientId && <p className="mt-1 text-xs text-danger">{errors.patientId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="att-exam">Tipo de exame</Label>
              <Controller
                control={control}
                name="examType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="att-exam" className="mt-1 w-full">
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
              <Label htmlFor="att-doctor">Médico</Label>
              <Controller
                control={control}
                name="doctor"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="att-doctor" className="mt-1 w-full">
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

          <div className="grid grid-cols-2 gap-3">
            <Input
              {...register('attendanceDate')}
              type="date"
              label="Data do atendimento"
              error={errors.attendanceDate?.message}
              required
            />

            <div>
              <Label htmlFor="att-conclusion">Conclusão</Label>
              <Controller
                control={control}
                name="conclusion"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="att-conclusion" className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(APPOINTMENT_CONCLUSION).map((c) => (
                        <SelectItem key={c} value={c}>
                          {APPOINTMENT_CONCLUSION_LABELS[c]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div>
            <Label>Aptidão por atividade de risco</Label>
            <p className="mt-0.5 text-xs text-ink-soft">
              Avalie a aptidão do colaborador para as atividades relevantes à sua função.
            </p>
            <div className="mt-2 space-y-1.5 rounded-md border border-border p-2">
              {ALL_DUTY_TYPES.map((duty) => (
                <div
                  key={duty}
                  className="flex items-center justify-between gap-3 rounded px-1.5 py-1 odd:bg-hover/50"
                >
                  <span className="text-xs text-ink">{DUTY_TYPE_LABELS[duty]}</span>
                  <Select
                    value={statusOf(dutyFitness, duty)}
                    onValueChange={(status) =>
                      setValue('dutyFitness', withStatus(dutyFitness, duty, status as DutyStatus))
                    }
                  >
                    <SelectTrigger className="h-8 w-40 shrink-0 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_assessed">Não avaliado</SelectItem>
                      <SelectItem value="fit">Apto</SelectItem>
                      <SelectItem value="unfit">Inapto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          {conclusion === APPOINTMENT_CONCLUSION.APTO_COM_RESTRICAO && (
            <Textarea
              {...register('restrictionNotes')}
              label="Restrições"
              placeholder="Descreva a restrição aplicada"
              error={errors.restrictionNotes?.message}
              rows={2}
            />
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
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingRecord ? 'Salvar alterações' : 'Registrar atendimento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

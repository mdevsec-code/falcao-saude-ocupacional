import { Pencil, Trash2, Stethoscope, User } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/feedback/EmptyState';
import { DAY_LABEL_FMT, recordsOnDay } from '../lib/calendar';
import { STATUS_BADGE_VARIANT, APPOINTMENT_STATUS_LABELS } from '../lib/status';
import type { AppointmentRecord } from '../types';

const TIME_FMT = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });

interface DayViewProps {
  dayAnchor: Date;
  records: readonly AppointmentRecord[];
  onEditAppointment: (record: AppointmentRecord) => void;
  onDeleteAppointment: (record: AppointmentRecord) => void;
}

export function DayView({ dayAnchor, records, onEditAppointment, onDeleteAppointment }: DayViewProps) {
  const dayRecords = recordsOnDay(records, dayAnchor);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold capitalize text-ink">{DAY_LABEL_FMT.format(dayAnchor)}</h3>

      {dayRecords.length === 0 ? (
        <EmptyState
          title="Nenhum agendamento neste dia"
          description="Use o botão “Novo agendamento” para criar um horário."
        />
      ) : (
        <div className="space-y-2">
          {dayRecords.map((record) => (
            <div
              key={record.id}
              className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-md bg-brand-gold-50 text-2xs font-semibold text-brand-gold-700">
                  {TIME_FMT.format(new Date(record.startsAt))}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{record.patientName}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-soft">
                    <span className="flex items-center gap-1">
                      <Stethoscope className="h-3 w-3" aria-hidden="true" />
                      {record.examType}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" aria-hidden="true" />
                      {record.doctor}
                    </span>
                    <span>· {record.durationMin} min</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:justify-end">
                <Badge variant={STATUS_BADGE_VARIANT[record.status]} size="sm">
                  {APPOINTMENT_STATUS_LABELS[record.status]}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Editar agendamento"
                  onClick={() => onEditAppointment(record)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-danger hover:text-danger"
                  aria-label="Remover agendamento"
                  onClick={() => onDeleteAppointment(record)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { cn } from '@/utils/cn';
import { getWeekDays, isSameDay, recordsOnDay, WEEKDAY_SHORT_FMT } from '../lib/calendar';
import { AppointmentChip } from './AppointmentChip';
import type { AppointmentRecord } from '../types';

interface WeekViewProps {
  weekAnchor: Date;
  records: readonly AppointmentRecord[];
  onSelectDay: (date: Date) => void;
  onEditAppointment: (record: AppointmentRecord) => void;
}

export function WeekView({ weekAnchor, records, onSelectDay, onEditAppointment }: WeekViewProps) {
  const days = getWeekDays(weekAnchor);
  const today = new Date();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
      {days.map((day) => {
        const dayRecords = recordsOnDay(records, day);
        const isToday = isSameDay(day, today);

        return (
          <div
            key={day.toISOString()}
            className={cn(
              'flex min-h-[220px] flex-col gap-2 rounded-md border border-border p-2',
              isToday && 'border-brand-gold-300 bg-brand-gold-50/40',
            )}
          >
            <button
              type="button"
              onClick={() => onSelectDay(day)}
              className="flex items-center justify-between rounded px-1 py-0.5 text-left hover:bg-hover"
            >
              <span className="text-2xs font-semibold uppercase tracking-wide text-ink-soft">
                {WEEKDAY_SHORT_FMT.format(day)}
              </span>
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                  isToday ? 'bg-brand-gold-500 text-white' : 'text-ink',
                )}
              >
                {day.getDate()}
              </span>
            </button>

            <div className="flex flex-1 flex-col gap-1">
              {dayRecords.length === 0 && (
                <p className="pt-2 text-center text-2xs text-muted">Sem agendamentos</p>
              )}
              {dayRecords.map((record) => (
                <AppointmentChip key={record.id} record={record} onClick={onEditAppointment} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

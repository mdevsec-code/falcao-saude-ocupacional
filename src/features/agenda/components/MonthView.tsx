import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { getMonthGrid, groupByDay, formatWeekdayShort } from '../lib/calendar';
import { AppointmentChip } from './AppointmentChip';
import type { AppointmentRecord } from '../types';

function getWeekdayHeaders(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2026, 6, 5 + i); // domingo 05/jul/2026 → sáb 11/jul/2026
    return formatWeekdayShort(d);
  });
}

const MAX_VISIBLE = 3;

interface MonthViewProps {
  monthAnchor: Date;
  records: readonly AppointmentRecord[];
  onSelectDay: (date: Date) => void;
  onEditAppointment: (record: AppointmentRecord) => void;
}

export function MonthView({
  monthAnchor,
  records,
  onSelectDay,
  onEditAppointment,
}: MonthViewProps) {
  const { t } = useTranslation('agenda');
  const grid = getMonthGrid(monthAnchor);
  const byDay = groupByDay(records);
  const weekdays = getWeekdayHeaders();

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="grid grid-cols-7 border-b border-border bg-hover/50">
        {weekdays.map((day) => (
          <div
            key={day}
            className="px-2 py-2 text-center text-2xs font-semibold uppercase tracking-wide text-ink-soft"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {grid.map((cell) => {
          const key = `${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}`;
          const dayKey = `${cell.date.getFullYear()}-${String(cell.date.getMonth() + 1).padStart(2, '0')}-${String(cell.date.getDate()).padStart(2, '0')}`;
          const dayRecords = (byDay.get(dayKey) ?? [])
            .slice()
            .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
          const visible = dayRecords.slice(0, MAX_VISIBLE);
          const overflow = dayRecords.length - visible.length;

          return (
            <div
              key={key}
              className={cn(
                'flex min-h-[104px] flex-col gap-1 border-b border-r border-border p-1.5 last:border-r-0',
                !cell.inCurrentMonth && 'bg-hover/30',
              )}
            >
              <button
                type="button"
                onClick={() => onSelectDay(cell.date)}
                className={cn(
                  'self-start rounded-full px-1.5 text-xs font-semibold hover:bg-hover',
                  cell.isToday && 'bg-brand-gold-500 text-white hover:bg-brand-gold-700',
                  !cell.inCurrentMonth && !cell.isToday && 'text-muted',
                  cell.inCurrentMonth && !cell.isToday && 'text-ink',
                )}
              >
                {cell.date.getDate()}
              </button>

              <div className="flex flex-col gap-1">
                {visible.map((record) => (
                  <AppointmentChip key={record.id} record={record} onClick={onEditAppointment} />
                ))}
                {overflow > 0 && (
                  <button
                    type="button"
                    onClick={() => onSelectDay(cell.date)}
                    className="text-left text-2xs font-semibold text-brand-gold-700 hover:underline"
                  >
                    {t('agenda:card.more', { count: overflow })}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

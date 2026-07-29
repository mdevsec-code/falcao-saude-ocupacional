import { cn } from '@/utils/cn';
import { STATUS_CHIP_CLASSES } from '../lib/status';
import type { AppointmentRecord } from '../types';

const TIME_FMT = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });

interface AppointmentChipProps {
  record: AppointmentRecord;
  onClick: (record: AppointmentRecord) => void;
  className?: string;
}

export function AppointmentChip({ record, onClick, className }: AppointmentChipProps) {
  const time = TIME_FMT.format(new Date(record.startsAt));

  return (
    <button
      type="button"
      onClick={() => onClick(record)}
      className={cn(
        'block w-full truncate rounded border px-1.5 py-0.5 text-left text-2xs font-medium',
        'transition-colors duration-fast hover:brightness-95 focus:outline-none focus-visible:shadow-focus',
        STATUS_CHIP_CLASSES[record.status],
        className,
      )}
      title={`${time} · ${record.patientName} · ${record.examType}`}
    >
      <span className="font-semibold">{time}</span> {record.patientName}
    </button>
  );
}

import { cn } from '@/utils/cn';
import { STATUS_CHIP_CLASSES } from '../lib/status';
import { formatTime } from '@/utils/format';
import type { AppointmentRecord } from '../types';

interface AppointmentChipProps {
  record: AppointmentRecord;
  onClick: (record: AppointmentRecord) => void;
  className?: string;
}

export function AppointmentChip({ record, onClick, className }: AppointmentChipProps) {
  const time = formatTime(record.startsAt);

  return (
    <button
      type="button"
      onClick={() => onClick(record)}
      className={cn(
        'text-2xs block w-full truncate rounded border px-1.5 py-0.5 text-left font-medium',
        'duration-fast focus-visible:shadow-focus transition-colors hover:brightness-95 focus:outline-hidden',
        STATUS_CHIP_CLASSES[record.status],
        className,
      )}
      title={`${time} · ${record.patientName} · ${record.examType}`}
    >
      <span className="font-semibold">{time}</span> {record.patientName}
    </button>
  );
}

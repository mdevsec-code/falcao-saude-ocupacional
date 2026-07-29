import { ChevronLeft, ChevronRight, Plus, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { cn } from '@/utils/cn';
import { DOCTORS } from '../types';
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_LABELS } from '@/constants/status';
import type { AgendaFilters, AgendaView } from '../types';

const ALL_VALUE = '__all';

const VIEW_LABELS: Record<AgendaView, string> = {
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
};

interface CalendarToolbarProps {
  view: AgendaView;
  onViewChange: (view: AgendaView) => void;
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  filters: AgendaFilters;
  onFiltersChange: (patch: Partial<AgendaFilters>) => void;
  onCreate: () => void;
  examTypes: readonly string[];
}

export function CalendarToolbar({
  view,
  onViewChange,
  label,
  onPrev,
  onNext,
  onToday,
  filters,
  onFiltersChange,
  onCreate,
  examTypes,
}: CalendarToolbarProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onToday}>
            Hoje
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrev}
              aria-label="Período anterior"
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              aria-label="Próximo período"
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="flex items-center gap-2 text-lg font-semibold capitalize text-ink">
            <CalendarDays className="h-4 w-4 text-brand-gold-700" aria-hidden="true" />
            {label}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-md border border-border bg-surface p-0.5">
            {(Object.keys(VIEW_LABELS) as AgendaView[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onViewChange(v)}
                className={cn(
                  'rounded px-3 py-1.5 text-xs font-semibold transition-colors duration-fast',
                  view === v ? 'bg-brand-gold-500 text-white' : 'text-ink-soft hover:bg-hover',
                )}
                aria-pressed={view === v}
              >
                {VIEW_LABELS[v]}
              </button>
            ))}
          </div>

          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={onCreate}>
            Novo agendamento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <Label htmlFor="agenda-filter-doctor">Médico</Label>
          <Select
            value={filters.doctor ?? ALL_VALUE}
            onValueChange={(v) => onFiltersChange({ doctor: v === ALL_VALUE ? undefined : v })}
          >
            <SelectTrigger id="agenda-filter-doctor" className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>Todos</SelectItem>
              {DOCTORS.map((doc) => (
                <SelectItem key={doc} value={doc}>
                  {doc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="agenda-filter-exam">Tipo de exame</Label>
          <Select
            value={filters.examType ?? ALL_VALUE}
            onValueChange={(v) => onFiltersChange({ examType: v === ALL_VALUE ? undefined : v })}
          >
            <SelectTrigger id="agenda-filter-exam" className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>Todos</SelectItem>
              {examTypes.map((exam) => (
                <SelectItem key={exam} value={exam}>
                  {exam}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="agenda-filter-status">Status</Label>
          <Select
            value={filters.status ?? ALL_VALUE}
            onValueChange={(v) =>
              onFiltersChange({
                status: v === ALL_VALUE ? undefined : (v as AgendaFilters['status']),
              })
            }
          >
            <SelectTrigger id="agenda-filter-status" className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>Todos</SelectItem>
              {Object.values(APPOINTMENT_STATUS).map((status) => (
                <SelectItem key={status} value={status}>
                  {APPOINTMENT_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

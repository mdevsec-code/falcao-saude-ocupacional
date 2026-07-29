import { Filter, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { PATIENT_STATUS, PATIENT_STATUS_LABELS } from '@/constants/status';
import { SECTORS } from '../types';
import type { PatientFilters } from '../types';

const ALL_VALUE = '__all';

interface FiltersBarProps {
  filters: PatientFilters;
  onChange: (patch: Partial<PatientFilters>) => void;
  onClearAll: () => void;
}

export function FiltersBar({ filters, onChange, onClearAll }: FiltersBarProps) {
  const chips: { key: keyof PatientFilters; label: string }[] = [];
  if (filters.sector) chips.push({ key: 'sector', label: `Setor: ${filters.sector}` });
  if (filters.status) chips.push({ key: 'status', label: `Status: ${PATIENT_STATUS_LABELS[filters.status]}` });
  if (filters.busca) chips.push({ key: 'busca', label: `Busca: "${filters.busca}"` });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-ink-soft" aria-hidden="true" />
        <span className="text-sm font-semibold text-ink">Filtros</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="patients-filter-busca">Busca</Label>
          <Input
            id="patients-filter-busca"
            className="mt-1"
            placeholder="Nome, CPF ou função…"
            leftIcon={<Search className="h-4 w-4" />}
            value={filters.busca ?? ''}
            onChange={(e) => onChange({ busca: e.target.value || undefined })}
          />
        </div>

        <div>
          <Label htmlFor="patients-filter-sector">Setor</Label>
          <Select
            value={filters.sector ?? ALL_VALUE}
            onValueChange={(v) => onChange({ sector: v === ALL_VALUE ? undefined : v })}
          >
            <SelectTrigger id="patients-filter-sector" className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>Todos</SelectItem>
              {SECTORS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="patients-filter-status">Status</Label>
          <Select
            value={filters.status ?? ALL_VALUE}
            onValueChange={(v) =>
              onChange({ status: v === ALL_VALUE ? undefined : (v as PatientFilters['status']) })
            }
          >
            <SelectTrigger id="patients-filter-status" className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>Todos</SelectItem>
              {Object.values(PATIENT_STATUS).map((status) => (
                <SelectItem key={status} value={status}>
                  {PATIENT_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
          {chips.map((chip) => (
            <Badge key={chip.key} variant="outline" className="gap-1.5 pr-1.5">
              {chip.label}
              <button
                type="button"
                onClick={() => onChange({ [chip.key]: undefined })}
                aria-label={`Remover filtro ${chip.label}`}
                className="rounded-full p-0.5 hover:bg-hover"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Limpar tudo
          </Button>
        </div>
      )}
    </div>
  );
}

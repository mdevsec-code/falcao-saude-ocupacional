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
import type { FilterDefinition } from '../hooks/useAtestadoFilters';
import type { AtestadoFilters } from '../types';

interface FiltersBarProps {
  definitions: FilterDefinition[];
  filters: AtestadoFilters;
  dateRange: [string | null, string | null];
  onChange: (patch: Partial<AtestadoFilters>) => void;
  onClearAll: () => void;
}

const ALL_VALUE = '__all';

export function FiltersBar({ definitions, filters, dateRange, onChange, onClearAll }: FiltersBarProps) {
  const [minDate, maxDate] = dateRange;

  const chips: { key: keyof AtestadoFilters; label: string }[] = [];
  definitions.forEach((def) => {
    const value = filters[def.key];
    if (value) chips.push({ key: def.key, label: `${def.label}: ${value}` });
  });
  if (filters.dataInicio) chips.push({ key: 'dataInicio', label: `A partir de ${filters.dataInicio}` });
  if (filters.dataFim) chips.push({ key: 'dataFim', label: `Até ${filters.dataFim}` });
  if (filters.busca) chips.push({ key: 'busca', label: `Busca: "${filters.busca}"` });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-ink-soft" aria-hidden="true" />
        <span className="text-sm font-semibold text-ink">Filtros</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {definitions.map((def) => (
          <div key={def.key}>
            <Label htmlFor={`atestados-filter-${def.key}`}>{def.label}</Label>
            <Select
              value={filters[def.key] ?? ALL_VALUE}
              onValueChange={(v) => onChange({ [def.key]: v === ALL_VALUE ? undefined : v })}
            >
              <SelectTrigger id={`atestados-filter-${def.key}`} className="mt-1 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>Todos</SelectItem>
                {def.options.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        <div>
          <Label htmlFor="atestados-filter-busca">Busca</Label>
          <Input
            id="atestados-filter-busca"
            className="mt-1"
            placeholder="Colaborador, função, CID, médico…"
            leftIcon={<Search className="h-4 w-4" />}
            value={filters.busca ?? ''}
            onChange={(e) => onChange({ busca: e.target.value || undefined })}
          />
        </div>

        <div>
          <Label htmlFor="atestados-filter-inicio">Período (início)</Label>
          <div className="mt-1 flex gap-2">
            <Input
              id="atestados-filter-inicio"
              type="date"
              min={minDate ?? undefined}
              max={maxDate ?? undefined}
              value={filters.dataInicio ?? ''}
              onChange={(e) => onChange({ dataInicio: e.target.value || undefined })}
            />
            <Input
              aria-label="Até"
              type="date"
              min={minDate ?? undefined}
              max={maxDate ?? undefined}
              value={filters.dataFim ?? ''}
              onChange={(e) => onChange({ dataFim: e.target.value || undefined })}
            />
          </div>
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

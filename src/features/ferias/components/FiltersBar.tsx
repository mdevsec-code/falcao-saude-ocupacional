import { Filter, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
import { VACATION_STATUS, VACATION_STATUS_LABELS } from '@/constants/status';
import { SECTORS } from '../types';
import type { VacationFilters } from '../types';

const ALL_VALUE = '__all';

interface FiltersBarProps {
  filters: VacationFilters;
  onChange: (patch: Partial<VacationFilters>) => void;
  onClearAll: () => void;
}

export function FiltersBar({ filters, onChange, onClearAll }: FiltersBarProps) {
  const { t } = useTranslation('ferias');
  const chips: { key: keyof VacationFilters; label: string }[] = [];
  if (filters.sector)
    chips.push({
      key: 'sector',
      label: t('ferias:filters.chipSector', { value: filters.sector }),
    });
  if (filters.status)
    chips.push({
      key: 'status',
      label: t('ferias:filters.chipStatus', { value: VACATION_STATUS_LABELS[filters.status] }),
    });
  if (filters.busca)
    chips.push({ key: 'busca', label: t('ferias:filters.chipSearch', { value: filters.busca }) });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-ink-soft" aria-hidden="true" />
        <span className="text-sm font-semibold text-ink">{t('ferias:filters.title')}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="ferias-filter-busca">{t('ferias:filters.search.label')}</Label>
          <Input
            id="ferias-filter-busca"
            className="mt-1"
            placeholder={t('ferias:filters.search.placeholder')}
            leftIcon={<Search className="h-4 w-4" />}
            value={filters.busca ?? ''}
            onChange={(e) => onChange({ busca: e.target.value || undefined })}
          />
        </div>

        <div>
          <Label htmlFor="ferias-filter-sector">{t('ferias:filters.sector.label')}</Label>
          <Select
            value={filters.sector ?? ALL_VALUE}
            onValueChange={(v) => onChange({ sector: v === ALL_VALUE ? undefined : v })}
          >
            <SelectTrigger id="ferias-filter-sector" className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>{t('ferias:filters.all')}</SelectItem>
              {SECTORS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="ferias-filter-status">{t('ferias:filters.status.label')}</Label>
          <Select
            value={filters.status ?? ALL_VALUE}
            onValueChange={(v) =>
              onChange({ status: v === ALL_VALUE ? undefined : (v as VacationFilters['status']) })
            }
          >
            <SelectTrigger id="ferias-filter-status" className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>{t('ferias:filters.all')}</SelectItem>
              {Object.values(VACATION_STATUS).map((status) => (
                <SelectItem key={status} value={status}>
                  {VACATION_STATUS_LABELS[status]}
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
                aria-label={t('ferias:filters.removeChipAria', { label: chip.label })}
                className="rounded-full p-0.5 hover:bg-hover"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            {t('ferias:filters.clearAll')}
          </Button>
        </div>
      )}
    </div>
  );
}

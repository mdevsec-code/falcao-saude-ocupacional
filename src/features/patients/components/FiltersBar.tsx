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
  const { t } = useTranslation('patients');
  const chips: { key: keyof PatientFilters; label: string }[] = [];
  if (filters.sector)
    chips.push({
      key: 'sector',
      label: t('patients:filters.chipSector', { value: filters.sector }),
    });
  if (filters.status)
    chips.push({
      key: 'status',
      label: t('patients:filters.chipStatus', { value: PATIENT_STATUS_LABELS[filters.status] }),
    });
  if (filters.busca)
    chips.push({ key: 'busca', label: t('patients:filters.chipSearch', { value: filters.busca }) });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-ink-soft" aria-hidden="true" />
        <span className="text-sm font-semibold text-ink">{t('patients:filters.title')}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="patients-filter-busca">{t('patients:filters.search.label')}</Label>
          <Input
            id="patients-filter-busca"
            className="mt-1"
            placeholder={t('patients:filters.search.placeholder')}
            leftIcon={<Search className="h-4 w-4" />}
            value={filters.busca ?? ''}
            onChange={(e) => onChange({ busca: e.target.value || undefined })}
          />
        </div>

        <div>
          <Label htmlFor="patients-filter-sector">{t('patients:filters.sector.label')}</Label>
          <Select
            value={filters.sector ?? ALL_VALUE}
            onValueChange={(v) => onChange({ sector: v === ALL_VALUE ? undefined : v })}
          >
            <SelectTrigger id="patients-filter-sector" className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>{t('patients:filters.all')}</SelectItem>
              {SECTORS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="patients-filter-status">{t('patients:filters.status.label')}</Label>
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
              <SelectItem value={ALL_VALUE}>{t('patients:filters.all')}</SelectItem>
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
                aria-label={t('patients:filters.removeChipAria', { label: chip.label })}
                className="rounded-full p-0.5 hover:bg-hover"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            {t('patients:filters.clearAll')}
          </Button>
        </div>
      )}
    </div>
  );
}

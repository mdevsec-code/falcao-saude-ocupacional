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
import {
  DEVIATION_CLASSIFICATION,
  DEVIATION_CLASSIFICATION_LABELS,
  DEVIATION_STATUS,
  DEVIATION_STATUS_LABELS,
} from '@/constants/status';
import { DEVIATION_LOCATIONS } from '../types';
import type { DeviationFilters } from '../types';

const ALL_VALUE = '__all';

interface DesviosFiltersBarProps {
  filters: DeviationFilters;
  onChange: (patch: Partial<DeviationFilters>) => void;
  onClearAll: () => void;
}

export function DesviosFiltersBar({ filters, onChange, onClearAll }: DesviosFiltersBarProps) {
  const { t } = useTranslation('seguranca');
  const chips: { key: keyof DeviationFilters; label: string }[] = [];
  if (filters.location)
    chips.push({
      key: 'location',
      label: t('seguranca:desvios.filters.chipLocation', { value: filters.location }),
    });
  if (filters.classification)
    chips.push({
      key: 'classification',
      label: t('seguranca:desvios.filters.chipClassification', {
        value: DEVIATION_CLASSIFICATION_LABELS[filters.classification],
      }),
    });
  if (filters.status)
    chips.push({
      key: 'status',
      label: t('seguranca:desvios.filters.chipStatus', {
        value: DEVIATION_STATUS_LABELS[filters.status],
      }),
    });
  if (filters.busca)
    chips.push({
      key: 'busca',
      label: t('seguranca:desvios.filters.chipSearch', { value: filters.busca }),
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-ink-soft" aria-hidden="true" />
        <span className="text-sm font-semibold text-ink">
          {t('seguranca:desvios.filters.title')}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="desvios-filter-busca">
            {t('seguranca:desvios.filters.search.label')}
          </Label>
          <Input
            id="desvios-filter-busca"
            className="mt-1"
            placeholder={t('seguranca:desvios.filters.search.placeholder')}
            leftIcon={<Search className="h-4 w-4" />}
            value={filters.busca ?? ''}
            onChange={(e) => onChange({ busca: e.target.value || undefined })}
          />
        </div>

        <div>
          <Label htmlFor="desvios-filter-location">
            {t('seguranca:desvios.filters.location.label')}
          </Label>
          <Select
            value={filters.location ?? ALL_VALUE}
            onValueChange={(v) => onChange({ location: v === ALL_VALUE ? undefined : v })}
          >
            <SelectTrigger id="desvios-filter-location" className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>{t('seguranca:desvios.filters.all')}</SelectItem>
              {DEVIATION_LOCATIONS.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="desvios-filter-classification">
            {t('seguranca:desvios.filters.classification.label')}
          </Label>
          <Select
            value={filters.classification ?? ALL_VALUE}
            onValueChange={(v) =>
              onChange({
                classification:
                  v === ALL_VALUE ? undefined : (v as DeviationFilters['classification']),
              })
            }
          >
            <SelectTrigger id="desvios-filter-classification" className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>{t('seguranca:desvios.filters.all')}</SelectItem>
              {Object.values(DEVIATION_CLASSIFICATION).map((c) => (
                <SelectItem key={c} value={c}>
                  {DEVIATION_CLASSIFICATION_LABELS[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="desvios-filter-status">
            {t('seguranca:desvios.filters.status.label')}
          </Label>
          <Select
            value={filters.status ?? ALL_VALUE}
            onValueChange={(v) =>
              onChange({ status: v === ALL_VALUE ? undefined : (v as DeviationFilters['status']) })
            }
          >
            <SelectTrigger id="desvios-filter-status" className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>{t('seguranca:desvios.filters.all')}</SelectItem>
              {Object.values(DEVIATION_STATUS).map((status) => (
                <SelectItem key={status} value={status}>
                  {DEVIATION_STATUS_LABELS[status]}
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
                aria-label={t('seguranca:desvios.filters.removeChipAria', { label: chip.label })}
                className="rounded-full p-0.5 hover:bg-hover"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            {t('seguranca:desvios.filters.clearAll')}
          </Button>
        </div>
      )}
    </div>
  );
}

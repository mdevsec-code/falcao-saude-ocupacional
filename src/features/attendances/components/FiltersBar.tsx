import { Filter, X } from 'lucide-react';
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
import { APPOINTMENT_CONCLUSION, APPOINTMENT_CONCLUSION_LABELS } from '@/constants/status';
import { DOCTORS } from '../types';
import type { AttendanceFilters } from '../types';
import type { PatientRecord } from '@/features/patients/types';

const ALL_VALUE = '__all';

interface FiltersBarProps {
  patients: readonly PatientRecord[];
  examTypes: readonly string[];
  filters: AttendanceFilters;
  onChange: (patch: Partial<AttendanceFilters>) => void;
  onClearAll: () => void;
}

export function FiltersBar({
  patients,
  examTypes,
  filters,
  onChange,
  onClearAll,
}: FiltersBarProps) {
  const { t } = useTranslation('attendances');
  const chips: { key: keyof AttendanceFilters; label: string }[] = [];
  if (filters.patientId) {
    const patient = patients.find((p) => p.id === filters.patientId);
    chips.push({
      key: 'patientId',
      label: t('attendances:filters.chips.patient', { name: patient?.name ?? filters.patientId }),
    });
  }
  if (filters.doctor) {
    chips.push({
      key: 'doctor',
      label: t('attendances:filters.chips.doctor', { name: filters.doctor }),
    });
  }
  if (filters.examType) {
    chips.push({
      key: 'examType',
      label: t('attendances:filters.chips.exam', { name: filters.examType }),
    });
  }
  if (filters.conclusion) {
    chips.push({
      key: 'conclusion',
      label: t('attendances:filters.chips.conclusion', {
        name: APPOINTMENT_CONCLUSION_LABELS[filters.conclusion],
      }),
    });
  }
  if (filters.dataInicio) {
    chips.push({
      key: 'dataInicio',
      label: t('attendances:filters.chips.from', { date: filters.dataInicio }),
    });
  }
  if (filters.dataFim) {
    chips.push({
      key: 'dataFim',
      label: t('attendances:filters.chips.until', { date: filters.dataFim }),
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-ink-soft" aria-hidden="true" />
        <span className="text-sm font-semibold text-ink">{t('attendances:filters.heading')}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Label htmlFor="att-filter-patient">{t('attendances:filters.fields.patient')}</Label>
          <Select
            value={filters.patientId ?? ALL_VALUE}
            onValueChange={(v) => onChange({ patientId: v === ALL_VALUE ? undefined : v })}
          >
            <SelectTrigger id="att-filter-patient" className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>{t('attendances:filters.options.all')}</SelectItem>
              {patients.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="att-filter-doctor">{t('attendances:filters.fields.doctor')}</Label>
          <Select
            value={filters.doctor ?? ALL_VALUE}
            onValueChange={(v) => onChange({ doctor: v === ALL_VALUE ? undefined : v })}
          >
            <SelectTrigger id="att-filter-doctor" className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>{t('attendances:filters.options.all')}</SelectItem>
              {DOCTORS.map((doc) => (
                <SelectItem key={doc} value={doc}>
                  {doc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="att-filter-exam">{t('attendances:filters.fields.examType')}</Label>
          <Select
            value={filters.examType ?? ALL_VALUE}
            onValueChange={(v) => onChange({ examType: v === ALL_VALUE ? undefined : v })}
          >
            <SelectTrigger id="att-filter-exam" className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>{t('attendances:filters.options.all')}</SelectItem>
              {examTypes.map((exam) => (
                <SelectItem key={exam} value={exam}>
                  {exam}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="att-filter-conclusion">
            {t('attendances:filters.fields.conclusion')}
          </Label>
          <Select
            value={filters.conclusion ?? ALL_VALUE}
            onValueChange={(v) =>
              onChange({
                conclusion: v === ALL_VALUE ? undefined : (v as AttendanceFilters['conclusion']),
              })
            }
          >
            <SelectTrigger id="att-filter-conclusion" className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>
                {t('attendances:filters.options.allFeminine')}
              </SelectItem>
              {Object.values(APPOINTMENT_CONCLUSION).map((c) => (
                <SelectItem key={c} value={c}>
                  {APPOINTMENT_CONCLUSION_LABELS[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="att-filter-inicio">{t('attendances:filters.fields.periodStart')}</Label>
          <div className="mt-1 flex gap-2">
            <Input
              id="att-filter-inicio"
              type="date"
              value={filters.dataInicio ?? ''}
              onChange={(e) => onChange({ dataInicio: e.target.value || undefined })}
            />
            <Input
              aria-label={t('attendances:filters.fields.periodEndAria')}
              type="date"
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
                aria-label={t('attendances:filters.chips.removeAria', { label: chip.label })}
                className="rounded-full p-0.5 hover:bg-hover"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            {t('attendances:filters.actions.clearAll')}
          </Button>
        </div>
      )}
    </div>
  );
}

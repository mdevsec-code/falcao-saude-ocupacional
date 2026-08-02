import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/Input';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import { getInitials } from '@/utils/format';
import { STATUS_BADGE_VARIANT as PATIENT_STATUS_BADGE_VARIANT } from '@/features/patients/lib/status';
import { PATIENT_STATUS_LABELS } from '@/constants/status';
import type { PatientRecord } from '@/features/patients/types';

interface PatientListPanelProps {
  patients: readonly PatientRecord[];
  selectedId: string | null;
  onSelect: (patient: PatientRecord) => void;
}

export function PatientListPanel({ patients, selectedId, onSelect }: PatientListPanelProps) {
  const { t } = useTranslation('records');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return patients;
    const q = search.toLowerCase();
    return patients.filter((p) => p.name.toLowerCase().includes(q) || p.cpf.includes(q));
  }, [patients, search]);

  return (
    <div className="flex h-full flex-col rounded-md border border-border bg-surface">
      <div className="border-b border-border p-3">
        <Input
          placeholder={t('records:search.placeholder')}
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="p-4 text-center text-sm text-ink-soft">{t('records:list.empty')}</p>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((patient) => (
              <li key={patient.id}>
                <button
                  type="button"
                  onClick={() => onSelect(patient)}
                  className={cn(
                    'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors duration-fast hover:bg-hover',
                    selectedId === patient.id && 'bg-brand-gold-50/70',
                  )}
                >
                  <Avatar>
                    <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{patient.name}</p>
                    <p className="truncate text-xs text-ink-soft">{patient.role}</p>
                  </div>
                  <Badge variant={PATIENT_STATUS_BADGE_VARIANT[patient.status]} size="sm">
                    {PATIENT_STATUS_LABELS[patient.status]}
                  </Badge>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

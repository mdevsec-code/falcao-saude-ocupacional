import { Briefcase, Calendar, IdCard, Phone } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { EmptyState } from '@/components/feedback/EmptyState';
import { formatCPF, formatDate, formatPhoneBR, getInitials } from '@/utils/format';
import { PATIENT_STATUS_LABELS } from '@/constants/status';
import { STATUS_BADGE_VARIANT as PATIENT_STATUS_BADGE_VARIANT } from '@/features/patients/lib/status';
import type { PatientRecord } from '@/features/patients/types';
import type { AttendanceRecord } from '@/features/attendances/types';

import { AttendanceTimeline } from './AttendanceTimeline';

interface PatientRecordPanelProps {
  patient: PatientRecord | null;
  attendances: readonly AttendanceRecord[];
}

export function PatientRecordPanel({ patient, attendances }: PatientRecordPanelProps) {
  if (!patient) {
    return (
      <div className="flex h-full items-center justify-center rounded-md border border-dashed border-border">
        <EmptyState
          title="Selecione um paciente"
          description="Escolha um paciente na lista ao lado para ver o prontuário."
        />
      </div>
    );
  }

  return (
    <div className="h-full space-y-6 overflow-y-auto rounded-md border border-border bg-surface p-5 scrollbar-thin">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-sm">{getInitials(patient.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">{patient.name}</h2>
            <p className="text-sm text-ink-soft">
              {patient.role} · {patient.sector}
            </p>
          </div>
        </div>
        <Badge variant={PATIENT_STATUS_BADGE_VARIANT[patient.status]}>
          {PATIENT_STATUS_LABELS[patient.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div className="flex items-center gap-2 text-ink-soft">
          <IdCard className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{formatCPF(patient.cpf)}</span>
        </div>
        <div className="flex items-center gap-2 text-ink-soft">
          <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{patient.phone ? formatPhoneBR(patient.phone) : '—'}</span>
        </div>
        <div className="flex items-center gap-2 text-ink-soft">
          <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Admissão: {formatDate(patient.admissionDate) ?? '—'}</span>
        </div>
        <div className="flex items-center gap-2 text-ink-soft">
          <Briefcase className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{attendances.length} atendimento(s)</span>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Histórico de atendimentos</h3>
        <AttendanceTimeline records={attendances} />
      </div>
    </div>
  );
}

import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Stethoscope } from 'lucide-react';

import { PlaceholderPage } from '@/components/common/PlaceholderPage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { WhatsappReturnButton } from '../components/WhatsappReturnButton';
import { brand } from '@/config/brand';
import { formatDate } from '@/utils/format';

interface AppointmentFixture {
  id: string;
  date: string;
  patient: string;
  exam: string;
  status: AppointmentStatus;
  phone: string;
}

const APPOINTMENT_FIXTURES: readonly AppointmentFixture[] = [
  {
    id: 'apt-001',
    date: '2026-07-15T08:30:00Z',
    patient: 'Maria Silva Santos',
    exam: 'ASO Periódico',
    status: 'agendado',
    phone: '11987654321',
  },
  {
    id: 'apt-002',
    date: '2026-07-15T09:30:00Z',
    patient: 'João Pedro Almeida',
    exam: 'Retorno — Audiometria',
    status: 'agendado',
    phone: '11912345678',
  },
  {
    id: 'apt-003',
    date: '2026-07-15T10:30:00Z',
    patient: 'Ana Carolina Souza',
    exam: 'ASO Admissional',
    status: 'faltou',
    phone: '',
  },
  {
    id: 'apt-004',
    date: '2026-07-15T11:30:00Z',
    patient: 'Carlos Eduardo Pereira',
    exam: 'ASO Demissional',
    status: 'agendado',
    phone: '11955554444',
  },
  {
    id: 'apt-005',
    date: '2026-07-15T14:00:00Z',
    patient: 'Patrícia Mendes',
    exam: 'ASO Periódico',
    status: 'agendado',
    phone: '11944443333',
  },
];

type AppointmentStatus = 'agendado' | 'realizado' | 'cancelado' | 'faltou';

const STATUS_TONE: Record<AppointmentStatus, 'success' | 'warning' | 'danger' | 'neutral'> = {
  agendado: 'neutral',
  realizado: 'success',
  cancelado: 'warning',
  faltou: 'danger',
};

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  agendado: 'Agendado',
  realizado: 'Realizado',
  cancelado: 'Cancelado',
  faltou: 'Faltou',
};

export function AppointmentsPage() {
  const { t } = useTranslation('appointments');

  return (
    <PlaceholderPage
      title="Agendamentos"
      description="Visualize e gerencie a agenda da clínica. Abaixo, um demonstrativo do módulo com ações de retorno por WhatsApp já habilitadas."
    >
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand-gold-700" />
                Agenda de hoje
              </CardTitle>
              <CardDescription>
                {APPOINTMENT_FIXTURES.length} consultas · {brand.shortName}
              </CardDescription>
            </div>
            <Badge variant="brand" size="sm">
              Demonstração
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {APPOINTMENT_FIXTURES.map((apt) => {
            const date = new Date(apt.date);
            const time = new Intl.DateTimeFormat('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            }).format(date);
            const returnMessage = t('whatsappReturn.message', {
              company: brand.legalName,
              exam: apt.exam,
            });

            return (
              <div
                key={apt.id}
                className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-gold-50 text-brand-gold-700">
                    <Stethoscope className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{apt.patient}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-ink-soft">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {time} · {formatDate(apt.date)}
                      <span aria-hidden="true">·</span>
                      {apt.exam}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:justify-end">
                  <Badge variant={STATUS_TONE[apt.status]} size="sm">
                    {STATUS_LABEL[apt.status]}
                  </Badge>
                  <WhatsappReturnButton
                    contact={apt.phone ? { name: apt.patient, phone: apt.phone } : undefined}
                    message={returnMessage}
                    size="sm"
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </PlaceholderPage>
  );
}

export default AppointmentsPage;

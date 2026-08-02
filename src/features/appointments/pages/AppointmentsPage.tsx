import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Stethoscope } from 'lucide-react';

import { PlaceholderPage } from '@/components/common/PlaceholderPage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { WhatsappReturnButton } from '../components/WhatsappReturnButton';
import { useAppointments } from '@/features/agenda/hooks/useAppointments';
import { recordsOnDay } from '@/features/agenda/lib/calendar';
import { STATUS_BADGE_VARIANT, APPOINTMENT_STATUS_LABELS } from '@/features/agenda/lib/status';
import { brand } from '@/config/brand';
import { formatDate, formatTime } from '@/utils/format';

export function AppointmentsPage() {
  const { t } = useTranslation('appointments');
  const { data: appointments, isLoading } = useAppointments();
  const todayAppointments = recordsOnDay(appointments ?? [], new Date());

  return (
    <PlaceholderPage title={t('appointments:title')} description={t('appointments:description')}>
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand-gold-700" />
                {t('appointments:today.title')}
              </CardTitle>
              <CardDescription>
                {t('appointments:today.subtitle', {
                  count: todayAppointments.length,
                  brand: brand.shortName,
                })}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-16 w-full" />
              ))}
            </div>
          )}

          {!isLoading && todayAppointments.length === 0 && (
            <EmptyState
              title={t('appointments:empty.title')}
              description={t('appointments:empty.description')}
              className="border-none bg-transparent py-8"
            />
          )}

          {!isLoading &&
            todayAppointments.map((apt) => {
              const returnMessage = t('whatsappReturn.message', {
                company: brand.legalName,
                exam: apt.examType,
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
                      <p className="truncate text-sm font-semibold text-ink">{apt.patientName}</p>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-ink-soft">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        {formatTime(apt.startsAt)} · {formatDate(apt.startsAt)}
                        <span aria-hidden="true">·</span>
                        {apt.examType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:justify-end">
                    <Badge variant={STATUS_BADGE_VARIANT[apt.status]} size="sm">
                      {APPOINTMENT_STATUS_LABELS[apt.status]}
                    </Badge>
                    <WhatsappReturnButton
                      contact={apt.phone ? { name: apt.patientName, phone: apt.phone } : undefined}
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

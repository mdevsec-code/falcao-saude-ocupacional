import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { PageHeader } from '@/components/layout/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/Button';
import { usePatients } from '@/features/patients/hooks/usePatients';
import { useAttendances } from '@/features/attendances/hooks/useAttendances';
import type { PatientRecord } from '@/features/patients/types';

import { PatientListPanel } from '../components/PatientListPanel';
import { PatientRecordPanel } from '../components/PatientRecordPanel';

export function RecordsPage() {
  const { t } = useTranslation('records');
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('patientId');

  const {
    data: allPatients,
    isLoading: patientsLoading,
    isError: patientsError,
    refetch: refetchPatients,
  } = usePatients();
  const {
    data: allAttendances,
    isLoading: attendancesLoading,
    isError: attendancesError,
    refetch: refetchAttendances,
  } = useAttendances();

  const patients = useMemo(() => allPatients ?? [], [allPatients]);
  const attendances = useMemo(() => allAttendances ?? [], [allAttendances]);

  const selectedPatient = useMemo(
    () => patients.find((p) => p.id === selectedId) ?? null,
    [patients, selectedId],
  );

  const patientAttendances = useMemo(
    () => attendances.filter((a) => a.patientId === selectedId),
    [attendances, selectedId],
  );

  const isLoading = patientsLoading || attendancesLoading;
  const isError = patientsError || attendancesError;

  function handleSelect(patient: PatientRecord) {
    setSearchParams({ patientId: patient.id });
  }

  return (
    <>
      <PageHeader
        eyebrow={t('records:page.eyebrow')}
        title={t('records:page.title')}
        description={t('records:page.description')}
      />

      <div className="px-6 py-8 sm:px-8">
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
            <Skeleton className="h-[560px] w-full" />
            <Skeleton className="h-[560px] w-full" />
          </div>
        )}

        {isError && (
          <ErrorState
            title={t('records:error.title')}
            description={t('records:error.description')}
            action={
              <Button
                variant="outline"
                onClick={() => {
                  void refetchPatients();
                  void refetchAttendances();
                }}
              >
                {t('records:actions.retry')}
              </Button>
            }
          />
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr] lg:items-start">
            <div className="h-[560px]">
              <PatientListPanel
                patients={patients}
                selectedId={selectedId}
                onSelect={handleSelect}
              />
            </div>
            <div className="h-[560px]">
              <PatientRecordPanel patient={selectedPatient} attendances={patientAttendances} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default RecordsPage;

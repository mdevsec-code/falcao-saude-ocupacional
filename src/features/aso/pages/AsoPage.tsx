import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AlertTriangle, FileText, Search, ShieldCheck, Users } from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import { StatTile } from '@/components/data-display/StatTile';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Separator } from '@/components/ui/Separator';
import { usePatients } from '@/features/patients/hooks/usePatients';
import { useAttendances } from '@/features/attendances/hooks/useAttendances';
import { ROUTE_PATHS } from '@/constants/routes';
import { ALL_DUTY_TYPES, DUTY_TYPE_SHORT_LABELS } from '@/constants/duties';

import { getLatestFitnessByDuty, hasAnyUnfitDuty } from '../lib/fitness';
import { FitnessBadge } from '../components/FitnessBadge';

export function AsoPage() {
  const { t } = useTranslation('aso');
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

  const [search, setSearch] = useState('');
  const [onlyUnfit, setOnlyUnfit] = useState(false);

  const patients = useMemo(() => allPatients ?? [], [allPatients]);
  const attendances = useMemo(() => allAttendances ?? [], [allAttendances]);

  const isLoading = patientsLoading || attendancesLoading;
  const isError = patientsError || attendancesError;

  const board = useMemo(() => {
    return patients
      .map((patient) => ({
        patient,
        fitness: getLatestFitnessByDuty(attendances, patient.id),
      }))
      .filter((row) => Object.keys(row.fitness).length > 0);
  }, [patients, attendances]);

  const kpis = useMemo(() => {
    const withUnfit = board.filter((row) => hasAnyUnfitDuty(row.fitness)).length;
    return {
      avaliados: board.length,
      semRestricao: board.length - withUnfit,
      comInaptidao: withUnfit,
    };
  }, [board]);

  const filteredBoard = useMemo(() => {
    const q = search.trim().toLowerCase();
    return board.filter((row) => {
      if (onlyUnfit && !hasAnyUnfitDuty(row.fitness)) return false;
      if (q && !row.patient.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [board, search, onlyUnfit]);

  return (
    <>
      <PageHeader
        eyebrow={t('aso:page.eyebrow')}
        title={t('aso:page.title')}
        description={t('aso:page.description')}
      />

      <div className="space-y-8 px-6 py-8 sm:px-8">
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-[112px] w-full" />
            ))}
          </div>
        )}

        {isError && (
          <ErrorState
            title={t('aso:error.title')}
            description={t('aso:error.description')}
            action={
              <Button
                variant="outline"
                onClick={() => {
                  void refetchPatients();
                  void refetchAttendances();
                }}
              >
                {t('aso:actions.retry')}
              </Button>
            }
          />
        )}

        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatTile
                label={t('aso:kpis.evaluated')}
                value={kpis.avaliados}
                icon={<Users className="h-4 w-4" />}
              />
              <StatTile
                label={t('aso:kpis.noRestriction')}
                value={kpis.semRestricao}
                icon={<ShieldCheck className="h-4 w-4" />}
              />
              <StatTile
                label={t('aso:kpis.someUnfit')}
                value={kpis.comInaptidao}
                icon={<AlertTriangle className="h-4 w-4" />}
              />
            </div>

            <Separator />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Input
                className="max-w-xs"
                placeholder={t('aso:filters.searchPlaceholder')}
                leftIcon={<Search className="h-4 w-4" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                variant={onlyUnfit ? 'primary' : 'outline'}
                size="sm"
                leftIcon={<AlertTriangle className="h-4 w-4" />}
                onClick={() => setOnlyUnfit((v) => !v)}
              >
                {t('aso:filters.onlyUnfit')}
              </Button>
            </div>

            {filteredBoard.length === 0 ? (
              <EmptyState title={t('aso:empty.title')} description={t('aso:empty.description')} />
            ) : (
              <div className="overflow-x-auto rounded-md border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-brand-gold-50/60 text-ink">
                    <tr>
                      <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                        {t('aso:table.employee')}
                      </th>
                      {ALL_DUTY_TYPES.map((duty) => (
                        <th
                          key={duty}
                          className="px-2 py-2 text-center text-xs font-semibold uppercase tracking-wider text-ink-soft"
                        >
                          {DUTY_TYPE_SHORT_LABELS[duty]}
                        </th>
                      ))}
                      <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                        {t('aso:table.record')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-surface">
                    {filteredBoard.map(({ patient, fitness }) => (
                      <tr key={patient.id} className="hover:bg-hover">
                        <td className="px-3 py-2">
                          <p className="font-medium text-ink">{patient.name}</p>
                          <p className="text-xs text-ink-soft">{patient.role}</p>
                        </td>
                        {ALL_DUTY_TYPES.map((duty) => (
                          <td key={duty} className="px-2 py-2 text-center">
                            <FitnessBadge fit={fitness[duty]} />
                          </td>
                        ))}
                        <td className="px-3 py-2">
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label={t('aso:actions.viewRecord')}
                          >
                            <Link to={`${ROUTE_PATHS.PRONTUARIOS}?patientId=${patient.id}`}>
                              <FileText className="h-4 w-4" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default AsoPage;

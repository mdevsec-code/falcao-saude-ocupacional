import {
  FileHeart,
  CalendarX,
  Users,
  Building2,
  Clock,
  Repeat,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StatTile } from '@/components/data-display/StatTile';
import type { AtestadoKpis } from '../types';

function directionOf(value: number | null): 'up' | 'down' | 'flat' {
  if (value === null || Number.isNaN(value) || value === 0) return 'flat';
  return value > 0 ? 'up' : 'down';
}

interface KpiGridProps {
  kpis: AtestadoKpis;
}

export function KpiGrid({ kpis }: KpiGridProps) {
  const { t } = useTranslation('atestados');

  const tiles: {
    label: string;
    value: string;
    icon: LucideIcon;
    delta?: { value: string; direction: 'up' | 'down' | 'flat' };
  }[] = [
    {
      label: t('atestados:kpis.total'),
      value: kpis.total.toLocaleString('pt-BR'),
      icon: FileHeart,
      delta:
        kpis.variation !== null
          ? {
              value: `${Math.abs(kpis.variation).toFixed(1)}%`,
              direction: directionOf(kpis.variation),
            }
          : undefined,
    },
    {
      label: t('atestados:kpis.totalDias'),
      value: kpis.totalDias.toLocaleString('pt-BR'),
      icon: CalendarX,
    },
    {
      label: t('atestados:kpis.colaboradores'),
      value: kpis.colaboradoresUnicos.toLocaleString('pt-BR'),
      icon: Users,
    },
    {
      label: t('atestados:kpis.setorTop'),
      value: kpis.setorTopEntry ? kpis.setorTopEntry[0] : '—',
      icon: Building2,
    },
    {
      label: t('atestados:kpis.sla'),
      value: kpis.mediaSla !== null ? `${kpis.mediaSla.toFixed(1)} dia(s)` : '—',
      icon: Clock,
    },
    {
      label: t('atestados:kpis.recorrencia'),
      value: `${kpis.taxaRecorrencia.toFixed(1)}%`,
      icon: Repeat,
    },
  ];

  return (
    <section
      aria-labelledby="atestados-kpi-title"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <h2 id="atestados-kpi-title" className="sr-only">
        {t('atestados:kpis.srHeading')}
      </h2>
      {tiles.map((tile) => (
        <StatTile
          key={tile.label}
          label={tile.label}
          value={tile.value}
          delta={tile.delta}
          icon={<tile.icon className="h-4 w-4" />}
        />
      ))}
    </section>
  );
}

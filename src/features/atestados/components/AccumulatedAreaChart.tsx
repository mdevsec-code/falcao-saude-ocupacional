import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/utils/format';
import type { AtestadoRecord } from '../types';

const AXIS_TICK = { fill: 'rgb(var(--color-text-secondary))', fontSize: 12 };
const GRID_STROKE = 'rgb(var(--color-border))';

interface AccumulatedAreaChartProps {
  records: readonly AtestadoRecord[];
}

export function AccumulatedAreaChart({ records }: AccumulatedAreaChartProps) {
  const { t } = useTranslation('atestados');
  const data = useMemo(() => {
    const byDate: Record<string, number> = {};
    records.forEach((r) => {
      if (r.inicioAtestado)
        byDate[r.inicioAtestado] = (byDate[r.inicioAtestado] ?? 0) + (r.qntDias ?? 0);
    });
    let acc = 0;
    return Object.keys(byDate)
      .sort()
      .map((date) => {
        acc += byDate[date]!;
        return { date, label: formatDate(date) ?? date, acumulado: acc };
      });
  }, [records]);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="atestadosAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--atestados-sequential-400)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="var(--atestados-sequential-400)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={GRID_STROKE} />
        <XAxis
          dataKey="label"
          tick={AXIS_TICK}
          axisLine={{ stroke: GRID_STROKE }}
          tickLine={false}
          interval="preserveStartEnd"
          minTickGap={24}
        />
        <YAxis
          tick={AXIS_TICK}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          width={44}
        />
        <Tooltip
          content={<AreaTooltip unit={t('atestados:chartLabels.accumulated.tooltipUnit')} />}
        />
        <Area
          type="monotone"
          dataKey="acumulado"
          name={t('atestados:chartLabels.accumulated.seriesName')}
          stroke="var(--atestados-sequential-500)"
          strokeWidth={2}
          fill="url(#atestadosAreaFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function AreaTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  unit: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-ink">{label}</p>
      <p className="text-ink-soft">
        <span className="font-semibold text-ink">{payload[0]!.value.toLocaleString('pt-BR')}</span>{' '}
        {unit}
      </p>
    </div>
  );
}

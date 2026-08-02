import { useMemo } from 'react';
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTranslation } from 'react-i18next';

import { getIntlLocale } from '@/utils/locale';
import { frequencyRate, severityRate } from '../lib/metrics';
import type { AccidentIndicatorRecord } from '../indicatorTypes';

interface IndicadoresChartProps {
  records: readonly AccidentIndicatorRecord[];
}

const AXIS_TICK = { fill: 'rgb(var(--color-text-secondary))', fontSize: 12 };
const GRID_STROKE = 'rgb(var(--color-border))';
const FREQUENCY_COLOR = 'rgb(var(--color-brand-gold-700))';
const SEVERITY_COLOR = 'rgb(var(--color-danger))';

export function IndicadoresChart({ records }: IndicadoresChartProps) {
  const { t } = useTranslation('seguranca');
  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(getIntlLocale(), { month: 'short' }),
    [],
  );

  const data = useMemo(
    () =>
      [...records]
        .sort((a, b) => a.month - b.month)
        .map((r) => ({
          month: monthFormatter.format(new Date(2000, r.month - 1, 1)),
          frequencia: frequencyRate(r) ?? 0,
          gravidade: severityRate(r) ?? 0,
        })),
    [records, monthFormatter],
  );

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID_STROKE} />
        <XAxis
          dataKey="month"
          tick={AXIS_TICK}
          axisLine={{ stroke: GRID_STROKE }}
          tickLine={false}
          className="capitalize"
        />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={40} />
        <Tooltip
          contentStyle={{
            background: 'rgb(var(--color-surface))',
            border: `1px solid ${GRID_STROKE}`,
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="frequencia"
          name={t('seguranca:indicadores.chart.frequencyRate')}
          stroke={FREQUENCY_COLOR}
          strokeWidth={2}
          dot={{ r: 4, fill: FREQUENCY_COLOR, strokeWidth: 0 }}
          activeDot={{ r: 5, stroke: 'rgb(var(--color-surface))', strokeWidth: 2 }}
          animationDuration={600}
        />
        <Line
          type="monotone"
          dataKey="gravidade"
          name={t('seguranca:indicadores.chart.severityRate')}
          stroke={SEVERITY_COLOR}
          strokeWidth={2}
          dot={{ r: 4, fill: SEVERITY_COLOR, strokeWidth: 0 }}
          activeDot={{ r: 5, stroke: 'rgb(var(--color-surface))', strokeWidth: 2 }}
          animationDuration={600}
          animationBegin={150}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

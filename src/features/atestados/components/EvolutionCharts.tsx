import { useMemo } from 'react';
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { CompetenciaGroup } from '../types';

interface EvolutionChartsProps {
  groups: CompetenciaGroup[];
}

const AXIS_TICK = { fill: 'rgb(var(--color-text-secondary))', fontSize: 12 };
const GRID_STROKE = 'rgb(var(--color-border))';

export function EvolutionCharts({ groups }: EvolutionChartsProps) {
  const data = useMemo(
    () =>
      groups.map((g) => ({
        competencia: g.key,
        atestados: g.records.length,
        dias: g.records.reduce((s, r) => s + (r.qntDias ?? 0), 0),
      })),
    [groups],
  );

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Nº de Atestados
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={GRID_STROKE} />
            <XAxis dataKey="competencia" tick={AXIS_TICK} axisLine={{ stroke: GRID_STROKE }} tickLine={false} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} width={36} />
            <Tooltip content={<AtestadosTooltip unit="atestado(s)" />} />
            <Line
              type="monotone"
              dataKey="atestados"
              name="Nº de Atestados"
              stroke="var(--atestados-series-1)"
              strokeWidth={2}
              dot={{ r: 4, fill: 'var(--atestados-series-1)', strokeWidth: 0 }}
              activeDot={{ r: 5, stroke: 'rgb(var(--color-surface))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Dias Afastados
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={GRID_STROKE} />
            <XAxis dataKey="competencia" tick={AXIS_TICK} axisLine={{ stroke: GRID_STROKE }} tickLine={false} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} width={36} />
            <Tooltip content={<AtestadosTooltip unit="dia(s)" />} />
            <Line
              type="monotone"
              dataKey="dias"
              name="Dias Afastados"
              stroke="var(--atestados-series-2)"
              strokeWidth={2}
              dot={{ r: 4, fill: 'var(--atestados-series-2)', strokeWidth: 0 }}
              activeDot={{ r: 5, stroke: 'rgb(var(--color-surface))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AtestadosTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
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

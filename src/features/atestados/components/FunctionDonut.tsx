import { useMemo } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { AtestadoRecord } from '../types';
import { topN } from '../lib/kpis';

const SERIES_COLORS = [
  'var(--atestados-series-1)',
  'var(--atestados-series-2)',
  'var(--atestados-series-3)',
  'var(--atestados-series-4)',
  'var(--atestados-series-5)',
  'var(--atestados-series-6)',
  'var(--atestados-series-7)',
];

interface FunctionDonutProps {
  records: readonly AtestadoRecord[];
}

export function FunctionDonut({ records }: FunctionDonutProps) {
  const data = useMemo(() => {
    const top = topN(records, 'funcao', 6);
    const outros = records.length - top.reduce((s, [, count]) => s + count, 0);
    const rows = top.map(([name, value]) => ({ name, value }));
    if (outros > 0) rows.push({ name: 'OUTROS', value: outros });
    return rows;
  }, [records]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="55%"
          outerRadius="85%"
          paddingAngle={2}
          strokeWidth={2}
          stroke="rgb(var(--color-surface))"
        >
          {data.map((entry, idx) => (
            <Cell key={entry.name} fill={SERIES_COLORS[idx % SERIES_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<DonutTooltip total={total} />} />
        <Legend
          verticalAlign="bottom"
          formatter={(value: string) => <span className="text-xs text-ink-soft">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function DonutTooltip({
  active,
  payload,
  total,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  total: number;
}) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0]!;
  const pct = total ? ((value / total) * 100).toFixed(1) : '0.0';
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-ink">{name}</p>
      <p className="text-ink-soft">
        <span className="font-semibold text-ink">{value.toLocaleString('pt-BR')}</span> ({pct}%)
      </p>
    </div>
  );
}

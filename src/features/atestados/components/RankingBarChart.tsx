import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AXIS_TICK = { fill: 'rgb(var(--color-text-secondary))', fontSize: 12 };
const GRID_STROKE = 'rgb(var(--color-border))';

interface RankingBarChartProps {
  data: [string, number][];
  valueLabel: string;
  layout?: 'vertical' | 'horizontal';
  height?: number;
}

/**
 * Barras de ranking (magnitude por categoria) — hue sequencial único,
 * conforme a skill dataviz (`choosing-a-form.md`: "compare magnitude" → sequential).
 */
export function RankingBarChart({
  data,
  valueLabel,
  layout = 'horizontal',
  height = 260,
}: RankingBarChartProps) {
  const rows = data.map(([label, value]) => ({ label, value }));
  const isHorizontalBars = layout === 'vertical'; // recharts usa "vertical" p/ barras deitadas

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={rows}
        layout={layout}
        margin={{ top: 8, right: 16, left: isHorizontalBars ? 8 : 0, bottom: 0 }}
        barCategoryGap={isHorizontalBars ? 8 : '20%'}
      >
        <CartesianGrid
          horizontal={!isHorizontalBars}
          vertical={isHorizontalBars}
          stroke={GRID_STROKE}
        />
        {isHorizontalBars ? (
          <>
            <XAxis
              type="number"
              tick={AXIS_TICK}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="label"
              tick={AXIS_TICK}
              axisLine={false}
              tickLine={false}
              width={140}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey="label"
              tick={AXIS_TICK}
              axisLine={{ stroke: GRID_STROKE }}
              tickLine={false}
            />
            <YAxis
              tick={AXIS_TICK}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={36}
            />
          </>
        )}
        <Tooltip
          cursor={{ fill: 'rgb(var(--color-hover))' }}
          content={<RankingTooltip valueLabel={valueLabel} />}
        />
        <Bar
          dataKey="value"
          name={valueLabel}
          fill="var(--atestados-sequential-400)"
          radius={isHorizontalBars ? [0, 4, 4, 0] : [4, 4, 0, 0]}
          maxBarSize={24}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

function RankingTooltip({
  active,
  payload,
  valueLabel,
}: {
  active?: boolean;
  payload?: { value: number; payload: { label: string } }[];
  valueLabel: string;
}) {
  if (!active || !payload?.length) return null;
  const { value, payload: row } = payload[0]!;
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-ink">{row.label}</p>
      <p className="text-ink-soft">
        <span className="font-semibold text-ink">{value.toLocaleString('pt-BR')}</span> {valueLabel}
      </p>
    </div>
  );
}

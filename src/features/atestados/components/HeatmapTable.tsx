import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { AtestadoRecord, CompetenciaGroup } from '../types';
import { topN } from '../lib/kpis';

interface HeatmapTableProps {
  records: readonly AtestadoRecord[];
  competenciaGroups: CompetenciaGroup[];
}

const SEQUENTIAL_STEPS = [15, 35, 55, 75, 90];

function backgroundFor(value: number, max: number): string | undefined {
  if (value === 0 || max === 0) return undefined;
  const ratio = value / max;
  const idx = Math.min(SEQUENTIAL_STEPS.length - 1, Math.floor(ratio * SEQUENTIAL_STEPS.length));
  return `color-mix(in oklab, var(--atestados-sequential-500) ${SEQUENTIAL_STEPS[idx]}%, transparent)`;
}

export function HeatmapTable({ records, competenciaGroups }: HeatmapTableProps) {
  const { t } = useTranslation('atestados');
  const { setores, competencias, matrix, max } = useMemo(() => {
    const setoresTop = topN(records, 'setor', 8).map(([s]) => s);
    const comps = competenciaGroups.map((c) => c.key);
    const grid = setoresTop.map((s) =>
      comps.map((comp) => records.filter((r) => r.setor === s && r.competencia === comp).length),
    );
    const maxValue = grid.reduce((m, row) => Math.max(m, ...row), 0);
    return { setores: setoresTop, competencias: comps, matrix: grid, max: maxValue };
  }, [records, competenciaGroups]);

  if (setores.length === 0 || competencias.length === 0) {
    return <p className="text-sm text-ink-soft">{t('atestados:heatmap.empty')}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">
              {t('atestados:heatmap.setorHeader')}
            </th>
            {competencias.map((c) => (
              <th
                key={c}
                className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-ink-soft"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {setores.map((setor, rowIdx) => (
            <tr key={setor} className="border-t border-border">
              <td className="px-3 py-2 font-medium text-ink">{setor}</td>
              {matrix[rowIdx]!.map((value, colIdx) => (
                <td key={competencias[colIdx]} className="px-1 py-1 text-center">
                  <div
                    className="mx-auto flex h-9 w-full min-w-[48px] items-center justify-center rounded-md text-xs font-semibold text-ink"
                    style={{ background: backgroundFor(value, max) }}
                  >
                    {value > 0 ? value : <span className="text-ink-soft">—</span>}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

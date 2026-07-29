import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/feedback/EmptyState';
import type { ExamTypeRecord } from '../types';

interface ExamTypesTableProps {
  records: readonly ExamTypeRecord[];
  onEdit: (record: ExamTypeRecord) => void;
  onDelete: (record: ExamTypeRecord) => void;
}

export function ExamTypesTable({ records, onEdit, onDelete }: ExamTypesTableProps) {
  if (records.length === 0) {
    return <EmptyState title="Nenhum tipo de exame cadastrado" description="Crie o primeiro tipo de exame." />;
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-brand-gold-50/60 text-ink">
          <tr>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Nome
            </th>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Categoria
            </th>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Duração
            </th>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Periodicidade
            </th>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Status
            </th>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface">
          {records.map((row) => (
            <tr key={row.id} className="hover:bg-hover">
              <td className="px-3 py-2">
                <p className="font-medium text-ink">{row.name}</p>
                {row.description && <p className="text-xs text-ink-soft">{row.description}</p>}
              </td>
              <td className="px-3 py-2 text-ink">{row.category}</td>
              <td className="px-3 py-2 text-ink">{row.defaultDurationMin} min</td>
              <td className="px-3 py-2 text-ink">
                {row.periodicityMonths ? `A cada ${row.periodicityMonths} meses` : '—'}
              </td>
              <td className="px-3 py-2">
                <Badge variant={row.active ? 'success' : 'neutral'} size="sm">
                  {row.active ? 'Ativo' : 'Inativo'}
                </Badge>
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label="Editar tipo de exame"
                    onClick={() => onEdit(row)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-danger hover:text-danger"
                    aria-label="Remover tipo de exame"
                    onClick={() => onDelete(row)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

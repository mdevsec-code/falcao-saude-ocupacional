import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Search, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ROLE_LABELS } from '@/constants/roles';
import type { UserRecord } from '../types';

const COLUMNS: { key: keyof UserRecord; label: string }[] = [
  { key: 'name', label: 'Nome' },
  { key: 'email', label: 'E-mail' },
  { key: 'role', label: 'Perfil' },
  { key: 'status', label: 'Status' },
];

interface UsersTableProps {
  records: readonly UserRecord[];
  currentUserId?: string;
  onEdit: (record: UserRecord) => void;
  onDelete: (record: UserRecord) => void;
}

export function UsersTable({ records, currentUserId, onEdit, onDelete }: UsersTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof UserRecord>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filteredSorted = useMemo(() => {
    let rows = [...records];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => COLUMNS.some((c) => String(r[c.key] ?? '').toLowerCase().includes(q)));
    }
    rows.sort((a, b) => {
      const va = a[sortKey] ?? '';
      const vb = b[sortKey] ?? '';
      return sortDir === 'asc'
        ? String(va).localeCompare(String(vb), 'pt-BR')
        : String(vb).localeCompare(String(va), 'pt-BR');
    });
    return rows;
  }, [records, search, sortKey, sortDir]);

  function handleSort(key: keyof UserRecord) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  return (
    <div className="space-y-4">
      <Input
        className="max-w-xs"
        placeholder="Pesquisar usuário…"
        leftIcon={<Search className="h-4 w-4" />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredSorted.length === 0 ? (
        <EmptyState title="Nenhum usuário encontrado" description="Ajuste a busca." />
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-gold-50/60 text-ink">
              <tr>
                {COLUMNS.map((c) => (
                  <th
                    key={c.key}
                    className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft"
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(c.key)}
                      className="inline-flex items-center gap-1 hover:text-ink"
                    >
                      {c.label}
                      {sortKey === c.key ? (
                        sortDir === 'asc' ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-40" />
                      )}
                    </button>
                  </th>
                ))}
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {filteredSorted.map((row) => {
                const isSelf = row.id === currentUserId;
                return (
                  <tr key={row.id} className="hover:bg-hover">
                    <td className="px-3 py-2 font-medium text-ink">
                      {row.name}
                      {isSelf && (
                        <span className="ml-2 text-2xs font-normal text-ink-soft">(você)</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-ink">{row.email}</td>
                    <td className="px-3 py-2 text-ink">{ROLE_LABELS[row.role]}</td>
                    <td className="px-3 py-2">
                      <Badge variant={row.status === 'active' ? 'success' : 'neutral'} size="sm">
                        {row.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label="Editar usuário"
                          onClick={() => onEdit(row)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-danger hover:text-danger disabled:text-ink-soft"
                          aria-label="Remover usuário"
                          disabled={isSelf}
                          title={isSelf ? 'Você não pode remover seu próprio usuário' : undefined}
                          onClick={() => onDelete(row)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

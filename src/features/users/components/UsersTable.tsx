import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Search, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ROLE_LABELS } from '@/constants/roles';
import { getIntlLocale } from '@/utils/locale';
import type { UserRecord } from '../types';

const COLUMN_KEYS: (keyof UserRecord)[] = ['name', 'email', 'role', 'status'];

interface UsersTableProps {
  records: readonly UserRecord[];
  currentUserId?: string;
  onEdit: (record: UserRecord) => void;
  onDelete: (record: UserRecord) => void;
}

export function UsersTable({ records, currentUserId, onEdit, onDelete }: UsersTableProps) {
  const { t } = useTranslation('users');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof UserRecord>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const COLUMNS = useMemo(
    () => COLUMN_KEYS.map((key) => ({ key, label: t(`users:table.columns.${key}`) })),
    [t],
  );

  const filteredSorted = useMemo(() => {
    let rows = [...records];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        COLUMNS.some((c) =>
          String(r[c.key] ?? '')
            .toLowerCase()
            .includes(q),
        ),
      );
    }
    rows.sort((a, b) => {
      const va = a[sortKey] ?? '';
      const vb = b[sortKey] ?? '';
      return sortDir === 'asc'
        ? String(va).localeCompare(String(vb), getIntlLocale())
        : String(vb).localeCompare(String(va), getIntlLocale());
    });
    return rows;
  }, [records, search, sortKey, sortDir, COLUMNS]);

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
        placeholder={t('users:table.searchPlaceholder')}
        leftIcon={<Search className="h-4 w-4" />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredSorted.length === 0 ? (
        <EmptyState title={t('users:empty.title')} description={t('users:empty.description')} />
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
                  {t('users:table.columns.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {filteredSorted.map((row, idx) => {
                const isSelf = row.id === currentUserId;
                return (
                  <tr
                    key={row.id}
                    className="animate-slide-up hover:bg-hover"
                    style={{ animationDelay: `${idx * 25}ms`, animationFillMode: 'backwards' }}
                  >
                    <td className="px-3 py-2 font-medium text-ink">
                      {row.name}
                      {isSelf && (
                        <span className="ml-2 text-2xs font-normal text-ink-soft">
                          {t('users:table.youSuffix')}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-ink">{row.email}</td>
                    <td className="px-3 py-2 text-ink">{ROLE_LABELS[row.role]}</td>
                    <td className="px-3 py-2">
                      <Badge variant={row.status === 'active' ? 'success' : 'neutral'} size="sm">
                        {row.status === 'active'
                          ? t('users:status.active')
                          : t('users:status.inactive')}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={t('users:table.editAria')}
                          onClick={() => onEdit(row)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-danger hover:text-danger disabled:text-ink-soft"
                          aria-label={t('users:table.deleteAria')}
                          disabled={isSelf}
                          title={isSelf ? t('users:table.cannotDeleteSelf') : undefined}
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

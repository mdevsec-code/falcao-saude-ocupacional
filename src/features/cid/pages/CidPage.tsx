import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Copy, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { CID_CATALOG, type CidCategory } from '@/constants/cid';
import { getIntlLocale } from '@/utils/locale';

import { useCidCustomEntries } from '../hooks/useCidCustomEntries';
import { useCreateCid, useDeleteCid, useUpdateCid } from '../hooks/useCidMutations';
import { fromFormInput } from '../types';
import type { CidCustomEntry, CidFormInput } from '../types';
import { CidDialog } from '../components/CidDialog';
import { DeleteCidDialog } from '../components/DeleteCidDialog';

const ALL_VALUE = '__all';

const CATEGORIES: CidCategory[] = [
  'Osteomuscular',
  'Auditivo',
  'Respiratório',
  'Saúde Mental',
  'Dermatológico',
  'Traumatismos e Acidentes',
  'Exposição Ocupacional',
];

const CATEGORY_BADGE_VARIANT: Record<CidCategory, BadgeVariant> = {
  Osteomuscular: 'info',
  Auditivo: 'accent',
  Respiratório: 'warning',
  'Saúde Mental': 'brand',
  Dermatológico: 'success',
  'Traumatismos e Acidentes': 'danger',
  'Exposição Ocupacional': 'neutral',
};

interface CidRow {
  code: string;
  description: string;
  category: CidCategory;
  custom: CidCustomEntry | null;
}

export function CidPage() {
  const { t } = useTranslation('cid');
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get('q') ?? '');
  const [category, setCategory] = useState<string>(ALL_VALUE);

  const { data: customEntries, isLoading } = useCidCustomEntries();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CidCustomEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CidCustomEntry | null>(null);

  const createMutation = useCreateCid();
  const updateMutation = useUpdateCid();
  const deleteMutation = useDeleteCid();

  const allEntries = useMemo<CidRow[]>(() => {
    const base: CidRow[] = CID_CATALOG.map((entry) => ({ ...entry, custom: null }));
    const custom: CidRow[] = (customEntries ?? []).map((entry) => ({ ...entry, custom: entry }));
    return [...base, ...custom].sort((a, b) => a.code.localeCompare(b.code, getIntlLocale()));
  }, [customEntries]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allEntries.filter((entry) => {
      if (category !== ALL_VALUE && entry.category !== category) return false;
      if (q && !`${entry.code} ${entry.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allEntries, search, category]);

  async function handleCopyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(t('cid:toast.copySuccess', { code }));
    } catch (err) {
      console.error(err);
    }
  }

  function handleCreate() {
    setEditingRecord(null);
    setDialogOpen(true);
  }

  function handleEdit(record: CidCustomEntry) {
    setEditingRecord(record);
    setDialogOpen(true);
  }

  function handleSubmit(input: CidFormInput) {
    if (editingRecord) {
      updateMutation.mutate(
        { id: editingRecord.id, patch: fromFormInput(input) },
        { onSuccess: () => setDialogOpen(false) },
      );
    } else {
      createMutation.mutate(fromFormInput(input), { onSuccess: () => setDialogOpen(false) });
    }
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  }

  return (
    <>
      <PageHeader
        eyebrow={t('cid:page.eyebrow')}
        title={t('cid:page.title')}
        description={t('cid:page.description')}
        actions={
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
            {t('cid:actions.new')}
          </Button>
        }
      />

      <div className="space-y-6 px-6 py-8 sm:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            className="max-w-xs"
            placeholder={t('cid:search.placeholder')}
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>{t('cid:filter.allCategories')}</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} className="h-10 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title={t('cid:empty.title')} description={t('cid:empty.description')} />
        ) : (
          <>
            <p className="animate-fade-in text-xs text-ink-soft">
              {t('cid:results.count', { count: filtered.length })}
            </p>
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-brand-gold-50/60 text-ink">
                  <tr>
                    <th className="w-24 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                      {t('cid:table.code')}
                    </th>
                    <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                      {t('cid:table.description')}
                    </th>
                    <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                      {t('cid:table.category')}
                    </th>
                    <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                      {t('cid:table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-surface">
                  {filtered.map((entry, idx) => (
                    <tr
                      key={entry.code}
                      className="animate-slide-up hover:bg-hover"
                      style={{
                        animationDelay: `${Math.min(idx, 20) * 15}ms`,
                        animationFillMode: 'backwards',
                      }}
                    >
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => void handleCopyCode(entry.code)}
                          aria-label={t('cid:table.copyAria', { code: entry.code })}
                          className="group inline-flex items-center gap-1.5 rounded-sm font-mono font-semibold text-ink transition-colors hover:text-brand-gold-700 focus-visible:shadow-focus focus-visible:outline-none"
                        >
                          {entry.code}
                          <Copy
                            className="h-3 w-3 text-ink-soft opacity-0 transition-opacity group-hover:opacity-100"
                            aria-hidden="true"
                          />
                        </button>
                      </td>
                      <td className="px-3 py-2 text-ink">{entry.description}</td>
                      <td className="px-3 py-2">
                        <Badge variant={CATEGORY_BADGE_VARIANT[entry.category]} size="sm">
                          {entry.category}
                        </Badge>
                      </td>
                      <td className="px-3 py-2">
                        {entry.custom && (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              aria-label={t('cid:table.editAria')}
                              onClick={() => handleEdit(entry.custom!)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-danger hover:text-danger"
                              aria-label={t('cid:table.deleteAria')}
                              onClick={() => setDeleteTarget(entry.custom)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <p className="text-xs text-ink-soft">{t('cid:page.footnote')}</p>
      </div>

      <CidDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingRecord={editingRecord}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteCidDialog
        record={deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isSubmitting={deleteMutation.isPending}
      />
    </>
  );
}

export default CidPage;

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/feedback/EmptyState';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { CID_CATALOG, type CidCategory } from '@/constants/cid';

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

export function CidPage() {
  const { t } = useTranslation('cid');
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get('q') ?? '');
  const [category, setCategory] = useState<string>(ALL_VALUE);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CID_CATALOG.filter((entry) => {
      if (category !== ALL_VALUE && entry.category !== category) return false;
      if (q && !`${entry.code} ${entry.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, category]);

  return (
    <>
      <PageHeader
        eyebrow={t('cid:page.eyebrow')}
        title={t('cid:page.title')}
        description={t('cid:page.description')}
      />

      <div className="space-y-6 px-6 py-8 sm:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            className="max-w-xs"
            placeholder="Buscar por código ou descrição…"
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>Todas as categorias</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="Nenhum código encontrado" description="Ajuste a busca ou a categoria." />
        ) : (
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-gold-50/60 text-ink">
                <tr>
                  <th className="w-24 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                    Código
                  </th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                    Descrição
                  </th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                    Categoria
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {filtered.map((entry) => (
                  <tr key={entry.code} className="hover:bg-hover">
                    <td className="px-3 py-2 font-mono font-semibold text-ink">{entry.code}</td>
                    <td className="px-3 py-2 text-ink">{entry.description}</td>
                    <td className="px-3 py-2">
                      <Badge variant="outline" size="sm">
                        {entry.category}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-ink-soft">{t('cid:page.footnote')}</p>
      </div>
    </>
  );
}

export default CidPage;

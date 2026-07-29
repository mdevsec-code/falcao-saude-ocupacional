import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Stethoscope, User } from 'lucide-react';

import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks/useDebounce';
import { usePatients } from '@/features/patients/hooks/usePatients';
import { CID_CATALOG } from '@/constants/cid';
import { ROUTE_PATHS } from '@/constants/routes';
import { formatCPF } from '@/utils/format';

const MAX_RESULTS = 5;
const MIN_QUERY_LENGTH = 2;

interface GlobalSearchProps {
  /** Foca o campo ao montar — só use após uma ação explícita do usuário (ex.: abrir a busca mobile). */
  focusOnMount?: boolean;
}

export function GlobalSearch({ focusOnMount }: GlobalSearchProps = {}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { data: patients } = usePatients();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusOnMount) inputRef.current?.focus();
  }, [focusOnMount]);

  const debouncedQuery = useDebounce(query, 200);
  const q = debouncedQuery.trim().toLowerCase();
  const showResults = isOpen && q.length >= MIN_QUERY_LENGTH;

  const patientResults = useMemo(() => {
    if (q.length < MIN_QUERY_LENGTH) return [];
    return (patients ?? [])
      .filter((p) => p.name.toLowerCase().includes(q) || p.cpf.includes(q))
      .slice(0, MAX_RESULTS);
  }, [patients, q]);

  const cidResults = useMemo(() => {
    if (q.length < MIN_QUERY_LENGTH) return [];
    return CID_CATALOG.filter(
      (c) => c.code.toLowerCase().includes(q) || c.description.toLowerCase().includes(q),
    ).slice(0, MAX_RESULTS);
  }, [q]);

  const hasResults = patientResults.length > 0 || cidResults.length > 0;

  function reset() {
    setQuery('');
    setIsOpen(false);
  }

  function goToPatient(patientId: string) {
    reset();
    navigate(`${ROUTE_PATHS.PRONTUARIOS}?patientId=${patientId}`);
  }

  function goToCid(code: string) {
    reset();
    navigate(`${ROUTE_PATHS.CID}?q=${encodeURIComponent(code)}`);
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') reset();
        }}
        placeholder="Buscar paciente ou CID…"
        leftIcon={<Search className="h-4 w-4" />}
        aria-label="Busca global"
        autoComplete="off"
      />

      {showResults && (
        <div className="absolute left-0 right-0 top-full z-dropdown mt-1 max-h-80 overflow-y-auto rounded-md border border-border bg-surface shadow-lg">
          {!hasResults && (
            <p className="px-3 py-3 text-sm text-ink-soft">
              Nenhum resultado para &ldquo;{debouncedQuery}&rdquo;.
            </p>
          )}

          {patientResults.length > 0 && (
            <div className="border-b border-border p-1 last:border-b-0">
              <p className="px-2 py-1 text-2xs font-semibold uppercase tracking-wide text-ink-soft">
                Pacientes
              </p>
              {patientResults.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => goToPatient(p.id)}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-hover"
                >
                  <User className="h-3.5 w-3.5 shrink-0 text-ink-soft" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-ink">{p.name}</span>
                  <span className="shrink-0 font-mono text-xs text-ink-soft">{formatCPF(p.cpf)}</span>
                </button>
              ))}
            </div>
          )}

          {cidResults.length > 0 && (
            <div className="p-1">
              <p className="px-2 py-1 text-2xs font-semibold uppercase tracking-wide text-ink-soft">
                CID
              </p>
              {cidResults.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => goToCid(c.code)}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-hover"
                >
                  <Stethoscope className="h-3.5 w-3.5 shrink-0 text-ink-soft" aria-hidden="true" />
                  <span className="shrink-0 font-mono text-xs font-semibold text-ink">{c.code}</span>
                  <span className="min-w-0 flex-1 truncate text-ink-soft">{c.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

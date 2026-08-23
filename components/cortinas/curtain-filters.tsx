'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { CurtainCard } from '@/components/cortinas/curtain-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LIGHT_BLOCKING_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { CurtainType, LightBlocking } from '@prisma/client';

type CurtainItem = Pick<
  CurtainType,
  | 'id'
  | 'name'
  | 'slug'
  | 'summary'
  | 'category'
  | 'lightBlocking'
  | 'image'
  | 'imageAlt'
  | 'bestRooms'
  | 'materials'
>;

interface CurtainFiltersProps {
  curtains: CurtainItem[];
  categories: string[];
}

const LIGHT_OPTIONS: LightBlocking[] = ['BAIXO', 'MEDIO', 'ALTO', 'BLACKOUT'];

/**
 * Catálogo filtrável de tipos de cortinas.
 *
 * Filtra no cliente porque o conjunto é pequeno (dezenas de itens) e a
 * resposta instantânea vale mais que uma ida ao servidor a cada clique.
 */
export function CurtainFilters({ curtains, categories }: CurtainFiltersProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [light, setLight] = useState<LightBlocking | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return curtains.filter((curtain) => {
      if (category && curtain.category !== category) return false;
      if (light && curtain.lightBlocking !== light) return false;
      if (!term) return true;

      const haystack = [
        curtain.name,
        curtain.summary,
        curtain.category,
        ...curtain.bestRooms,
        ...curtain.materials,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [curtains, query, category, light]);

  const hasFilters = Boolean(query || category || light);

  function clearAll() {
    setQuery('');
    setCategory(null);
    setLight(null);
  }

  return (
    <div>
      {/* Barra de filtros */}
      <div className="rounded-lg border border-border bg-surface p-5 md:p-6">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome, ambiente ou material — ex.: cozinha, linho, blackout"
            className="bg-background pl-10"
            aria-label="Buscar tipos de cortinas"
          />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <fieldset>
            <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Categoria
            </legend>
            <div className="flex flex-wrap gap-2">
              <FilterChip active={category === null} onClick={() => setCategory(null)}>
                Todas
              </FilterChip>
              {categories.map((item) => (
                <FilterChip
                  key={item}
                  active={category === item}
                  onClick={() => setCategory(category === item ? null : item)}
                >
                  {item}
                </FilterChip>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Bloqueio de luz
            </legend>
            <div className="flex flex-wrap gap-2">
              <FilterChip active={light === null} onClick={() => setLight(null)}>
                Qualquer
              </FilterChip>
              {LIGHT_OPTIONS.map((option) => (
                <FilterChip
                  key={option}
                  active={light === option}
                  onClick={() => setLight(light === option ? null : option)}
                >
                  {LIGHT_BLOCKING_LABELS[option].split(' — ')[0]}
                </FilterChip>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-4">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            <strong className="font-semibold text-foreground">{filtered.length}</strong>{' '}
            {filtered.length === 1 ? 'tipo encontrado' : 'tipos encontrados'}
          </p>
          {hasFilters ? (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <X className="h-3.5 w-3.5" />
              Limpar filtros
            </Button>
          ) : null}
        </div>
      </div>

      {/* Resultados */}
      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((curtain, index) => (
            <CurtainCard key={curtain.id} curtain={curtain} priority={index < 3} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-lg border border-dashed border-border py-20 text-center">
          <p className="font-serif text-xl">Nenhum tipo corresponde à busca</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Tente termos mais amplos, como o ambiente (quarto, cozinha) ou o material (linho,
            alumínio, screen).
          </p>
          <Button variant="outline" size="sm" className="mt-6" onClick={clearAll}>
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
}

interface FilterChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function FilterChip({ active, onClick, children }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
        active
          ? 'border-accent bg-accent text-accent-foreground'
          : 'border-border bg-background text-muted-foreground hover:border-accent hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

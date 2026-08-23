'use client';

import { useEffect, useState } from 'react';
import { List } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TocItem } from '@/types';

interface TableOfContentsProps {
  items: TocItem[];
  className?: string;
}

/**
 * Sumário do artigo com destaque da seção em leitura.
 *
 * Usa IntersectionObserver com uma faixa estreita no topo da viewport, o que
 * dá a sensação de que o item ativo acompanha a rolagem.
 */
export function TableOfContents({ items, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-90px 0px -70% 0px', threshold: 0 },
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  return (
    <nav className={cn('text-sm', className)} aria-label="Sumário do artigo">
      <p className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        <List className="h-3.5 w-3.5 text-accent" aria-hidden />
        Neste artigo
      </p>

      <ul className="space-y-1 border-l border-border">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                '-ml-px block border-l-2 py-1.5 pr-2 leading-snug transition-colors',
                item.level === 3 ? 'pl-7 text-[0.8125rem]' : 'pl-4',
                activeId === item.id
                  ? 'border-accent font-medium text-foreground'
                  : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

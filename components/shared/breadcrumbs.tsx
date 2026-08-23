import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Crumb } from '@/types';

interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
}

/**
 * Trilha de navegação.
 * O JSON-LD correspondente é emitido pelo componente JsonLd de cada página,
 * o que ajuda o Google a exibir a hierarquia nos resultados de busca.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Trilha de navegação" className={cn('text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
        <li>
          <Link href="/" className="transition-colors hover:text-foreground">
            Início
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span className={cn(isLast && 'text-foreground')} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  /** Rótulo curto em caixa alta acima do título. */
  kicker?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  /** Nível semântico do título — use h1 apenas uma vez por página. */
  as?: 'h1' | 'h2' | 'h3';
  /** Inverte as cores do texto para uso sobre fundo grafite. */
  invert?: boolean;
  className?: string;
}

/**
 * Cabeçalho de seção com filete dourado, kicker e descrição.
 * É o elemento tipográfico que dá unidade visual a todas as páginas.
 */
export function SectionHeading({
  kicker,
  title,
  description,
  align = 'left',
  as: Tag = 'h2',
  invert = false,
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'max-w-2xl',
        centered && 'mx-auto text-center',
        className,
      )}
    >
      {kicker ? (
        <div className={cn('mb-4 flex items-center gap-3', centered && 'justify-center')}>
          <span className="rule-accent" aria-hidden />
          <span
            className={cn(
              'text-xs font-medium uppercase tracking-[0.22em]',
              invert ? 'text-secondary-foreground/70' : 'text-muted-foreground',
            )}
          >
            {kicker}
          </span>
        </div>
      ) : null}

      <Tag
        className={cn(
          'text-balance font-serif',
          Tag === 'h1' ? 'text-display-md' : 'text-display-sm',
          invert && 'text-secondary-foreground',
        )}
      >
        {title}
      </Tag>

      {description ? (
        <p
          className={cn(
            'mt-4 text-pretty text-base leading-relaxed md:text-lg',
            invert ? 'text-secondary-foreground/75' : 'text-muted-foreground',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

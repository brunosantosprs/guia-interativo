import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn, formatDate } from '@/lib/utils';
import type { PostCardData } from '@/types';

interface PostCardProps {
  post: PostCardData;
  /** `featured` amplia a imagem e o título — usado no primeiro card da home. */
  variant?: 'default' | 'featured' | 'compact';
  priority?: boolean;
  className?: string;
}

/** Card de artigo do blog. */
export function PostCard({ post, variant = 'default', priority = false, className }: PostCardProps) {
  if (variant === 'compact') {
    return (
      <article className={cn('group', className)}>
        <Link href={`/blog/${post.slug}`} className="flex gap-4">
          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md bg-surface">
            <Image
              src={post.coverImage || '/images/og-default.jpg'}
              alt={post.coverImageAlt || post.title}
              fill
              sizes="112px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="min-w-0 flex-1">
            {post.category ? (
              <span className="text-[11px] font-medium uppercase tracking-wide text-accent">
                {post.category.name}
              </span>
            ) : null}
            {/* Mesma razão do card comum, e aqui pesa mais: 14px é pequeno
                demais para uma serifada de alto contraste. */}
            <h3 className="mt-1 line-clamp-2 font-sans text-sm font-semibold leading-snug tracking-[-0.01em] transition-colors group-hover:text-accent">
              {post.title}
            </h3>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {post.readingMinutes} min de leitura
            </p>
          </div>
        </Link>
      </article>
    );
  }

  const featured = variant === 'featured';

  return (
    <article className={cn('card-premium group flex h-full flex-col overflow-hidden', className)}>
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <div
          className={cn(
            'relative overflow-hidden bg-surface',
            featured ? 'aspect-[16/10]' : 'aspect-[16/9]',
          )}
        >
          <Image
            src={post.coverImage || '/images/og-default.jpg'}
            alt={post.coverImageAlt || post.title}
            fill
            priority={priority}
            sizes={featured ? '(max-width: 1024px) 100vw, 60vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          {post.category ? (
            <Badge variant="accent" className="absolute left-3 top-3 shadow-soft">
              {post.category.name}
            </Badge>
          ) : null}
        </div>

        <div className={cn('flex flex-1 flex-col', featured ? 'p-7' : 'p-5')}>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <time dateTime={post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined}>
              {formatDate(post.publishedAt)}
            </time>
            <span className="h-1 w-1 rounded-full bg-border" aria-hidden />
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden />
              {post.readingMinutes} min
            </span>
          </div>

          {/*
            A Playfair fica só no card em destaque, onde o título é grande.
            Ela é uma serifada de alto contraste: os traços finos quase somem
            abaixo de uns 24px, e o título do card comum tem 18px. Ali a
            Inter em semibold lê muito melhor e mantém a hierarquia, porque
            o contraste com o resumo continua vindo do peso e do tamanho.
          */}
          <h3
            className={cn(
              'mt-3 leading-snug transition-colors group-hover:text-accent',
              featured
                ? 'font-serif text-2xl md:text-[1.75rem]'
                : 'font-sans text-[1.0625rem] font-semibold tracking-[-0.01em]',
            )}
          >
            {post.title}
          </h3>

          <p
            className={cn(
              'mt-3 flex-1 leading-relaxed text-muted-foreground',
              featured ? 'line-clamp-3 text-base' : 'line-clamp-3 text-sm',
            )}
          >
            {post.excerpt}
          </p>

          <span className="mt-5 text-sm font-medium text-foreground underline decoration-accent decoration-2 underline-offset-4">
            Ler o guia completo
          </span>
        </div>
      </Link>
    </article>
  );
}

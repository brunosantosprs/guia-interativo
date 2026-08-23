import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LightMeter } from '@/components/cortinas/light-meter';
import { cn } from '@/lib/utils';
import type { CurtainType } from '@prisma/client';

interface CurtainCardProps {
  curtain: Pick<
    CurtainType,
    'name' | 'slug' | 'summary' | 'category' | 'lightBlocking' | 'image' | 'imageAlt' | 'bestRooms'
  >;
  /** Prioriza o carregamento da imagem (usar apenas nos primeiros cards). */
  priority?: boolean;
  className?: string;
}

/** Card de um tipo de cortina, usado nas listagens e nos relacionados. */
export function CurtainCard({ curtain, priority = false, className }: CurtainCardProps) {
  return (
    <article className={cn('card-premium group flex h-full flex-col overflow-hidden', className)}>
      <Link href={`/tipos-de-cortinas/${curtain.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
          <Image
            src={curtain.image || '/images/og-default.jpg'}
            alt={curtain.imageAlt || curtain.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <Badge variant="accent" className="absolute left-3 top-3 shadow-soft">
            {curtain.category}
          </Badge>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="flex items-start justify-between gap-2 font-serif text-lg leading-snug">
            <span className="transition-colors group-hover:text-accent">{curtain.name}</span>
            <ArrowUpRight
              className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
              aria-hidden
            />
          </h3>

          <p className="mt-2.5 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            {curtain.summary}
          </p>

          <div className="mt-5">
            <LightMeter level={curtain.lightBlocking} />
          </div>

          {curtain.bestRooms.length > 0 ? (
            <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Ideal para: </span>
              {curtain.bestRooms.slice(0, 3).join(' · ')}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

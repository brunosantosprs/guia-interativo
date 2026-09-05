import { cn } from '@/lib/utils';
import type { AdConfig } from '@/lib/ads';
import type { AdBlock as AdBlockData } from '@/types';
import { AdSenseSlot } from '@/components/shared/adsense';
import { HtmlAdBlock } from '@/components/shared/html-ad-block';

/**
 * Um bloco de anuncio gerenciado no painel (aba Anuncios), inserido no corpo
 * do artigo — o equivalente ao "bloco" do Ad Inserter do WordPress.
 *
 * Reusa a moldura de components/shared/ad-slot.tsx (rotulo "Publicidade" +
 * altura minima reservada, para nao deslocar o layout / CLS). Dois tipos:
 *  - adsense: reusa AdSenseSlot; so renderiza de fato quando o provedor ativo
 *    e AdSense com clientId e o bloco tem um slot. Fora disso, mostra o espaco
 *    reservado discreto — bom durante a analise do Google e enquanto o autor
 *    ainda nao colou o ID do bloco.
 *  - html: renderiza o codigo colado, com re-execucao de <script> (HtmlAdBlock).
 *    Vazio => nao renderiza nada (nem moldura).
 */

interface AdBlockProps {
  block: AdBlockData;
  ads: AdConfig;
  /** Altura minima reservada, em pixels. */
  minHeight?: number;
  className?: string;
  /** Rotulo exibido acima do bloco. */
  label?: string;
}

/** Moldura comum: rotulo "Publicidade" + o conteudo do anuncio. */
function Moldura({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    // Ver o mesmo comentario em `ad-slot.tsx`: anuncio de largura fixa nao
    // pode alargar a pagina.
    <aside className={cn('w-full max-w-full overflow-hidden', className)} aria-label={label}>
      <p className="mb-1.5 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/60">
        {label}
      </p>
      {children}
    </aside>
  );
}

export function AdBlock({
  block,
  ads,
  minHeight = 280,
  className,
  label = 'Publicidade',
}: AdBlockProps) {
  if (block.type === 'html') {
    // Sem codigo colado ainda: nao ocupa espaco.
    if (!block.html.trim()) return null;
    return (
      <Moldura label={label} className={className}>
        <HtmlAdBlock html={block.html} />
      </Moldura>
    );
  }

  // type === 'adsense': so renderiza com provedor AdSense ativo + slot preenchido.
  const ativo = ads.provider === 'adsense' && ads.clientId && block.adsenseSlot.trim();
  if (!ativo) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-md border border-dashed border-border bg-surface/60 text-center',
          className,
        )}
        style={{ minHeight }}
        aria-hidden="true"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
          Espaço reservado para anúncio
        </span>
      </div>
    );
  }

  return (
    <Moldura label={label} className={className}>
      <AdSenseSlot
        slot={block.adsenseSlot}
        clientId={ads.clientId!}
        format={block.format}
        minHeight={minHeight}
      />
    </Moldura>
  );
}

import { cn } from '@/lib/utils';
import { AD_POSITIONS, type AdPosition } from '@/lib/constants';
import type { AdConfig } from '@/lib/ads';
import { AdSenseScript, AdSenseSlot } from '@/components/shared/adsense';
import { AdManagerScript, AdManagerSlot } from '@/components/shared/ad-manager';
import type { AdFormat } from '@/types';

/**
 * Bloco de anúncio, independente de provedor.
 *
 * As páginas dizem apenas em que posição o anúncio entra; quem decide se
 * ele vem do AdSense, do Ad Manager ou se nem existe é a configuração do
 * site. Isso mantém os onze pontos de inserção alheios à escolha — trocar
 * de provedor é mudar um campo no painel, não editar página por página.
 *
 * Regras que valem para os dois provedores, alinhadas às políticas dos
 * programas: todo bloco é rotulado como "Publicidade", ficando visualmente
 * distinguível do conteúdo editorial, e reserva altura mínima, o que evita
 * deslocamento de layout (CLS).
 */

interface AdSlotProps {
  /** Posição no layout: topBanner, inArticle, sidebar, footer, inFeed. */
  position: AdPosition;
  ads: AdConfig;
  format?: AdFormat;
  /** Altura mínima reservada, em pixels. */
  minHeight?: number;
  className?: string;
  /** Rótulo exibido acima do bloco. */
  label?: string;
}

export function AdSlot({
  position,
  ads,
  format = 'auto',
  minHeight = 280,
  className,
  label = 'Publicidade',
}: AdSlotProps) {
  // Sem provedor ativo: espaço reservado discreto, útil para validar o
  // layout antes da aprovação da conta.
  if (ads.provider === 'none') {
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
        <span className="mt-1 text-[10px] text-muted-foreground/50">{position}</span>
      </div>
    );
  }

  return (
    // `max-w-full overflow-hidden`: o script do AdSense grava uma largura fixa
    // em pixels no iframe. Se ela vier maior que a coluna, ela alarga a pagina
    // inteira no celular em vez de estourar so o anuncio.
    <aside className={cn('w-full max-w-full overflow-hidden', className)} aria-label={label}>
      <p className="mb-1.5 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/60">
        {label}
      </p>

      {ads.provider === 'adsense' ? (
        <AdSenseSlot
          slot={AD_POSITIONS[position].adsenseSlot}
          clientId={ads.clientId!}
          format={format}
          minHeight={minHeight}
        />
      ) : (
        <AdManagerSlot
          position={position}
          networkCode={ads.networkCode!}
          format={format}
          minHeight={minHeight}
        />
      )}
    </aside>
  );
}

/**
 * Script do provedor ativo. Montado uma única vez, no layout raiz.
 *
 * Nenhum script de anúncio é carregado enquanto não houver provedor —
 * evita chamadas inúteis em desenvolvimento e mantém a página limpa
 * durante a análise do AdSense.
 */
export function AdProviderScript({ ads }: { ads: AdConfig }) {
  if (ads.provider === 'adsense') return <AdSenseScript clientId={ads.clientId} />;
  if (ads.provider === 'admanager') return <AdManagerScript networkCode={ads.networkCode} />;
  return null;
}

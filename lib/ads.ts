import type { SiteSettings } from '@prisma/client';
import { AD_POSITIONS, type AdPosition } from '@/lib/constants';
import type { AdBlock, AdFormat } from '@/types';

/**
 * Configuracao de anuncios resolvida uma vez e repassada aos slots.
 *
 * Existe para nao mandar o registro inteiro de SiteSettings para o cliente
 * a cada bloco de anuncio: os componentes de anuncio sao client components,
 * e tudo que recebem por prop viaja no HTML. Aqui viajam tres campos.
 */
export interface AdConfig {
  provider: 'none' | 'adsense' | 'admanager';
  /** AdSense: ca-pub-0000000000000000 */
  clientId: string | null;
  /** Ad Manager: codigo de rede, so numeros */
  networkCode: string | null;
}

export const AD_CONFIG_DESLIGADA: AdConfig = {
  provider: 'none',
  clientId: null,
  networkCode: null,
};

/**
 * Le as configuracoes e decide o que sera exibido.
 *
 * Um provedor escolhido mas sem o identificador correspondente equivale a
 * desligado: melhor o espaco reservado do que um slot quebrado em producao.
 */
export function getAdConfig(settings: SiteSettings): AdConfig {
  const provider = settings.adProvider;

  if (provider === 'adsense' && settings.adsenseClientId) {
    return {
      provider: 'adsense',
      clientId: settings.adsenseClientId,
      networkCode: null,
    };
  }

  if (provider === 'admanager' && settings.adManagerNetworkCode) {
    return {
      provider: 'admanager',
      clientId: null,
      networkCode: settings.adManagerNetworkCode,
    };
  }

  return AD_CONFIG_DESLIGADA;
}

/**
 * Blocos de anuncio configurados no painel (aba Anuncios).
 *
 * Le o campo Json `adBlocks` de SiteSettings, mantem so os ligados e
 * normaliza cada bloco — mesmo padrao de cast dos campos Json de Service
 * (steps/faq). Como so ADMIN grava esse campo (guard na API), confiamos no
 * conteudo; a normalizacao existe apenas para sobreviver a dados antigos ou
 * parciais sem quebrar a renderizacao do artigo.
 */
export function getAdBlocks(settings: SiteSettings): AdBlock[] {
  const raw = settings.adBlocks;
  if (!Array.isArray(raw)) return [];

  return (raw as unknown as Array<Partial<AdBlock> | null>)
    .filter((bloco): bloco is Partial<AdBlock> => !!bloco && typeof bloco === 'object')
    .map(
      (bloco) =>
        ({
          id: String(bloco.id ?? ''),
          name: String(bloco.name ?? ''),
          enabled: bloco.enabled !== false,
          type: bloco.type === 'html' ? 'html' : 'adsense',
          adsenseSlot: String(bloco.adsenseSlot ?? ''),
          format: (bloco.format ?? 'auto') as AdFormat,
          html: String(bloco.html ?? ''),
          placement: bloco.placement === 'manual' ? 'manual' : 'paragraph',
          afterParagraph: Number(bloco.afterParagraph ?? 0),
        }) satisfies AdBlock,
    )
    .filter((bloco) => bloco.id && bloco.enabled);
}

/** Caminho completo da unidade no Ad Manager: /codigo-de-rede/unidade. */
export function adManagerPath(networkCode: string, position: AdPosition): string {
  return `/${networkCode}/${AD_POSITIONS[position].adManagerUnit}`;
}

/**
 * Tamanhos aceitos por formato no Ad Manager.
 *
 * O AdSense descobre o tamanho sozinho pelo espaco disponivel; o GPT nao —
 * ele exige a lista explicita na chamada de defineSlot. Os tamanhos abaixo
 * sao os padroes IAB que cabem em cada posicao do layout.
 */
export const AD_MANAGER_SIZES: Record<AdFormat, [number, number][]> = {
  horizontal: [
    [970, 90],
    [728, 90],
    [468, 60],
    [320, 50],
  ],
  rectangle: [
    [336, 280],
    [300, 250],
    [250, 250],
  ],
  vertical: [
    [300, 600],
    [160, 600],
    [120, 600],
  ],
  fluid: [
    [336, 280],
    [300, 250],
    [320, 100],
  ],
  auto: [
    [336, 280],
    [300, 250],
    [728, 90],
    [320, 50],
  ],
};

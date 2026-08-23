import type { SiteSettings } from '@prisma/client';
import { AD_POSITIONS, type AdPosition } from '@/lib/constants';
import type { AdFormat } from '@/types';

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

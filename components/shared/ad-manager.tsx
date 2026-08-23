'use client';

import Script from 'next/script';
import { useEffect, useId, useRef } from 'react';
import { cn } from '@/lib/utils';
import { AD_MANAGER_SIZES, adManagerPath } from '@/lib/ads';
import type { AdPosition } from '@/lib/constants';
import type { AdFormat } from '@/types';

/**
 * Integração com o Google Ad Manager via GPT (Google Publisher Tag).
 *
 * Diferença central em relação ao AdSense: o AdSense descobre sozinho o
 * tamanho do anúncio pelo espaço disponível, enquanto o GPT exige que cada
 * slot seja declarado em JavaScript, com a lista de tamanhos aceitos, antes
 * de qualquer coisa aparecer. Por isso aqui existe efeito e ciclo de vida —
 * no AdSense basta a tag `<ins>`.
 */

declare global {
  interface Window {
    googletag?: {
      cmd: (() => void)[];
      defineSlot?: (
        path: string,
        sizes: [number, number][],
        divId: string,
      ) => { addService: (service: unknown) => unknown } | null;
      pubads?: () => unknown;
      enableServices?: () => void;
      display?: (divId: string) => void;
      destroySlots?: (slots: unknown[]) => boolean;
    };
  }
}

/** Garante a fila de comandos antes de a biblioteca terminar de carregar. */
function filaGpt(): NonNullable<Window['googletag']> {
  window.googletag = window.googletag || { cmd: [] };
  return window.googletag;
}

/** Carrega o GPT uma única vez. Deve ser montado no layout raiz. */
export function AdManagerScript({ networkCode }: { networkCode?: string | null }) {
  if (!networkCode) return null;

  return (
    <Script
      id="gpt-init"
      async
      src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

interface AdManagerSlotProps {
  position: AdPosition;
  networkCode: string;
  format: AdFormat;
  minHeight: number;
  className?: string;
}

/**
 * Um bloco do Ad Manager.
 *
 * O slot é destruído ao desmontar. Sem isso, navegar entre páginas deixaria
 * definições órfãs acumuladas no googletag, e o mesmo caminho de unidade
 * definido duas vezes faz o GPT recusar a segunda — o anúncio simplesmente
 * não aparece, sem erro visível.
 */
export function AdManagerSlot({
  position,
  networkCode,
  format,
  minHeight,
  className,
}: AdManagerSlotProps) {
  // useId traz ':' , que é inválido em id de elemento para o GPT
  const divId = `gpt-${position}-${useId().replace(/:/g, '')}`;
  const slotRef = useRef<unknown>(null);

  useEffect(() => {
    const googletag = filaGpt();
    const path = adManagerPath(networkCode, position);

    googletag.cmd.push(() => {
      const slot = googletag.defineSlot?.(path, AD_MANAGER_SIZES[format], divId);
      if (!slot || !googletag.pubads) return;

      slot.addService(googletag.pubads());
      googletag.enableServices?.();
      googletag.display?.(divId);
      slotRef.current = slot;
    });

    return () => {
      const slot = slotRef.current;
      if (!slot) return;

      window.googletag?.cmd.push(() => {
        window.googletag?.destroySlots?.([slot]);
      });
      slotRef.current = null;
    };
  }, [divId, format, networkCode, position]);

  return <div id={divId} className={cn('mx-auto', className)} style={{ minHeight }} />;
}

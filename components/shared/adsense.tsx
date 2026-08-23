'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';
import type { AdFormat } from '@/types';

/**
 * Integração com o Google AdSense.
 *
 * O rótulo "Publicidade", o espaço reservado e a escolha de provedor ficam
 * em components/shared/ad-slot.tsx — aqui mora apenas o que é específico do
 * AdSense: o script global e a tag <ins> que ele preenche.
 */

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** Carrega o script global do AdSense. Deve ser montado uma vez no layout. */
export function AdSenseScript({ clientId }: { clientId?: string | null }) {
  if (!clientId) return null;

  return (
    <Script
      id="adsbygoogle-init"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

interface AdSenseSlotProps {
  /** ID do bloco de anúncio gerado no painel do AdSense. */
  slot: string;
  clientId: string;
  format: AdFormat;
  /** Altura mínima reservada, em pixels, para evitar deslocamento de layout. */
  minHeight: number;
}

/** Um bloco do AdSense. O tamanho é decidido pelo próprio AdSense. */
export function AdSenseSlot({ slot, clientId, format, minHeight }: AdSenseSlotProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // Bloqueadores de anúncio podem lançar aqui; falha silenciosa é o correto.
    }
  }, []);

  return (
    <ins
      className="adsbygoogle block"
      style={{ display: 'block', minHeight }}
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}

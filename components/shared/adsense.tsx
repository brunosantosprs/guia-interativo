'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { AdFormat } from '@/types';

/**
 * Integração com o Google AdSense.
 *
 * Regras adotadas (alinhadas às políticas do programa):
 * - Nenhum script é carregado enquanto o AdSense não estiver habilitado nas
 *   configurações do site — evita chamadas inúteis em desenvolvimento.
 * - Todo bloco é rotulado como "Publicidade", deixando o anúncio visualmente
 *   distinguível do conteúdo editorial.
 * - Os slots reservam altura mínima, o que evita layout shift (CLS).
 */

interface AdSenseScriptProps {
  clientId?: string | null;
  enabled?: boolean;
}

/** Carrega o script global do AdSense. Deve ser montado uma vez no layout. */
export function AdSenseScript({ clientId, enabled }: AdSenseScriptProps) {
  if (!enabled || !clientId) return null;

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

interface AdSlotProps {
  /** ID do bloco de anúncio gerado no painel do AdSense. */
  slot: string;
  clientId?: string | null;
  enabled?: boolean;
  format?: AdFormat;
  /** Altura mínima reservada, em pixels, para evitar deslocamento de layout. */
  minHeight?: number;
  className?: string;
  /** Rótulo exibido acima do bloco. */
  label?: string;
}

/**
 * Bloco individual de anúncio.
 *
 * Enquanto o AdSense estiver desabilitado, renderiza um espaço reservado
 * discreto — útil para validar o layout antes da aprovação da conta.
 */
export function AdSlot({
  slot,
  clientId,
  enabled,
  format = 'auto',
  minHeight = 280,
  className,
  label = 'Publicidade',
}: AdSlotProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!enabled || !clientId || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // Bloqueadores de anúncio podem lançar aqui; falha silenciosa é o correto.
    }
  }, [enabled, clientId]);

  if (!enabled || !clientId) {
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
        <span className="mt-1 text-[10px] text-muted-foreground/50">slot {slot}</span>
      </div>
    );
  }

  return (
    <aside className={cn('w-full', className)} aria-label={label}>
      <p className="mb-1.5 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/60">
        {label}
      </p>
      <ins
        className="adsbygoogle block"
        style={{ display: 'block', minHeight }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}

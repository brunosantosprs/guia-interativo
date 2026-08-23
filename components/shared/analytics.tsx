'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    adsbygoogle?: unknown[];
  }
}

interface AnalyticsProps {
  /** ID de medição do GA4 (formato G-XXXXXXXXXX). */
  measurementId?: string | null;
  /** ID do Google Tag Manager, quando utilizado (GTM-XXXXXXX). */
  gtmId?: string | null;
}

/**
 * Reporta cada mudanca de rota como um page_view.
 * O App Router faz navegacao no cliente, entao o GA4 nao dispara page_view
 * automaticamente entre paginas — este efeito cobre essa lacuna.
 */
function PageViewTracker({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!window.gtag) return;
    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    window.gtag('config', measurementId, { page_path: url });
  }, [pathname, searchParams, measurementId]);

  return null;
}

/**
 * Google Analytics 4 + Google Tag Manager.
 * Nada e carregado quando os IDs estao vazios (padrao em desenvolvimento).
 */
export function Analytics({ measurementId, gtmId }: AnalyticsProps) {
  if (!measurementId && !gtmId) return null;

  return (
    <>
      {measurementId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${measurementId}', {
                page_path: window.location.pathname,
                anonymize_ip: true
              });
            `}
          </Script>
          <Suspense fallback={null}>
            <PageViewTracker measurementId={measurementId} />
          </Suspense>
        </>
      ) : null}

      {gtmId ? (
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
      ) : null}
    </>
  );
}

/** Dispara um evento personalizado no GA4 a partir de qualquer componente. */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', name, params ?? {});
}

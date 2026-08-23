import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { getSettings } from '@/lib/settings';
import { SITE } from '@/lib/constants';
import { Analytics } from '@/components/shared/analytics';
import { AdProviderScript } from '@/components/shared/ad-slot';
import { getAdConfig } from '@/lib/ads';
import { Toaster } from '@/components/ui/toaster';

/**
 * Tipografia do projeto.
 * - Inter: interface, textos corridos e dados.
 * - Playfair Display: títulos, o que dá o tom editorial e sofisticado.
 * `display: swap` evita bloqueio de renderização (bom para LCP).
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: settings.defaultMetaTitle || `${settings.siteName} — ${settings.tagline}`,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.defaultMetaDescription || settings.description || SITE.description,
    applicationName: settings.siteName,
    authors: [{ name: settings.siteName, url: SITE.url }],
    creator: settings.siteName,
    publisher: settings.siteName,
    generator: 'Next.js',
    keywords: [
      'cortinas',
      'persianas',
      'tipos de cortinas',
      'blackout',
      'persiana rolô',
      'decoração de interiores',
      'como medir cortina',
      'conforto térmico',
    ],
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: SITE.locale,
      url: SITE.url,
      siteName: settings.siteName,
      title: settings.defaultMetaTitle || settings.siteName,
      description: settings.defaultMetaDescription || settings.description,
      images: [
        {
          url: settings.ogImage || '/images/og-default.jpg',
          width: 1200,
          height: 630,
          alt: settings.siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.defaultMetaTitle || settings.siteName,
      description: settings.defaultMetaDescription || settings.description,
      images: [settings.ogImage || '/images/og-default.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: settings.searchConsoleTag
      ? { google: settings.searchConsoleTag }
      : undefined,
    /**
     * Meta tag de propriedade do AdSense.
     *
     * Sai sempre que houver ID do cliente, mesmo com os anuncios
     * desativados: a verificacao acontece ANTES da aprovacao, justamente
     * quando "Exibir anuncios" ainda esta desligado. Amarrar a tag ao
     * switch impediria o site de ser aprovado.
     */
    other: settings.adsenseClientId
      ? { 'google-adsense-account': settings.adsenseClientId }
      : {},
    category: 'home improvement',
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: SITE.themeColor },
    { media: '(prefers-color-scheme: dark)', color: '#2C2C2C' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const ads = getAdConfig(settings);

  return (
    <html
      lang="pt-BR"
      // A paleta ativa é escolhida no painel administrativo e aplicada aqui.
      data-theme={settings.theme}
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Pré-conexões que reduzem a latência dos scripts do Google */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {ads.provider === 'adsense' ? (
          <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        ) : null}
        {ads.provider === 'admanager' ? (
          <link rel="preconnect" href="https://securepubads.g.doubleclick.net" />
        ) : null}
      </head>
      <body className="min-h-dvh bg-background text-foreground">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-secondary focus:px-4 focus:py-2 focus:text-secondary-foreground"
        >
          Pular para o conteúdo
        </a>

        {children}

        <Toaster />

        <Analytics measurementId={settings.gaMeasurementId} gtmId={settings.gtmId} />
        <AdProviderScript ads={ads} />
      </body>
    </html>
  );
}

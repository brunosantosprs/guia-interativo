import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { SiteSettings } from '@prisma/client';

/**
 * Configuracoes globais do site.
 *
 * O registro e unico (id = "default") e e lido por praticamente todo Server
 * Component. `cache()` garante uma unica consulta por requisicao.
 *
 * Se o banco ainda nao foi populado (primeiro boot, build sem DB), devolvemos
 * um objeto padrao para que o site continue renderizando.
 */
const FALLBACK: SiteSettings = {
  id: 'default',
  siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? 'Guia Interativo',
  tagline: 'O guia definitivo de cortinas e persianas',
  description:
    'Conteúdo aprofundado sobre cortinas e persianas: tipos, tecidos, medidas, instalação, manutenção e a escolha ideal para cada ambiente.',
  logoUrl: '/images/logo.svg',
  faviconUrl: null,
  ogImage: '/images/og-default.jpg',
  theme: 'elegante-neutra',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511999999999',
  whatsappMessage:
    'Olá! Vim pelo site Guia Interativo e gostaria de tirar uma dúvida sobre cortinas.',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'contato@guiainterativo.com',
  phone: null,
  address: null,
  businessHours: 'Segunda a sexta, das 9h às 18h',
  instagram: null,
  facebook: null,
  pinterest: null,
  youtube: null,
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || null,
  adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || null,
  adsenseEnabled: process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true',
  gtmId: null,
  searchConsoleTag: null,
  defaultMetaTitle: 'Guia Interativo — Cortinas e Persianas',
  defaultMetaDescription:
    'Guias técnicos, comparativos e catálogo completo de tipos de cortinas e persianas.',
  updatedAt: new Date(),
};

export const getSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
    return settings ?? FALLBACK;
  } catch {
    // Banco indisponível (ex.: build sem DATABASE_URL): segue com o padrão.
    return FALLBACK;
  }
});

export { FALLBACK as defaultSettings };

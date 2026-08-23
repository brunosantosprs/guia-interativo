import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { SITE } from '@/lib/constants';

/**
 * Sitemap XML gerado dinamicamente a partir do banco.
 * Acessível em /sitemap.xml — envie essa URL ao Google Search Console.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, '');
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/tipos-de-cortinas`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/servicos`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/sobre`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/contato`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
  ];

  try {
    const [posts, curtains, services, pages] = await Promise.all([
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
      prisma.curtainType.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
      prisma.service.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
      prisma.page.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    return [
      ...staticRoutes,
      ...posts.map((post) => ({
        url: `${base}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
      ...curtains.map((curtain) => ({
        url: `${base}/tipos-de-cortinas/${curtain.slug}`,
        lastModified: curtain.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
      ...services.map((service) => ({
        url: `${base}/servicos/${service.slug}`,
        lastModified: service.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
      ...pages.map((page) => ({
        url: `${base}/${page.slug}`,
        lastModified: page.updatedAt,
        changeFrequency: 'yearly' as const,
        priority: 0.3,
      })),
    ];
  } catch {
    // Banco indisponível no build: publica ao menos as rotas fixas.
    return staticRoutes;
  }
}

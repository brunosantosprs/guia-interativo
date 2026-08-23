import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';

/**
 * robots.txt gerado pelo Next.js.
 *
 * O painel administrativo e as rotas de API ficam fora do índice; o restante
 * do site é totalmente rastreável. O Mediapartners-Google (rastreador do
 * AdSense) recebe permissão explícita — sem isso, os anúncios podem ser
 * exibidos de forma menos relevante.
 */
export default function robots(): MetadataRoute.Robots {
  const base = SITE.url.replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/', '/login'],
      },
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

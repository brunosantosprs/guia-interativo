import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { DbPage, dbPageMetadata } from '@/components/shared/db-page';
import type { SlugParams } from '@/types';

/**
 * Rota curinga das páginas criadas no painel administrativo.
 *
 * Segmentos estáticos (/blog, /servicos, /contato...) têm prioridade no
 * roteamento do Next.js, então esta rota só é acionada para slugs que não
 * correspondem a nenhuma página fixa — exatamente o comportamento desejado
 * para o CRUD de Páginas.
 */
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const pages = await prisma.page.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    });
    return pages.map((page) => ({ slug: page.slug }));
  } catch {
    return [];
  }
}

export function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  return dbPageMetadata(params.slug);
}

export default function CustomPage({ params }: SlugParams) {
  return <DbPage slug={params.slug} kicker="Página" />;
}

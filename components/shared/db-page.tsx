import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { markdownToHtml } from '@/lib/markdown';
import { formatDate } from '@/lib/utils';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { SectionHeading } from '@/components/shared/section-heading';
import { JsonLd, breadcrumbSchema } from '@/components/shared/json-ld';

/**
 * Renderizador das páginas gerenciadas pelo painel administrativo
 * (políticas, termos e qualquer página criada em /admin/pages).
 *
 * O conteúdo é markdown gravado no banco e convertido em HTML no servidor.
 */

/** Sem try/catch: falha de banco no build deve quebrar, nao virar 404. */
export async function getDbPage(slug: string) {
  return prisma.page.findFirst({ where: { slug, status: 'PUBLISHED' } });
}

/** Metadata reaproveitada pelas rotas que renderizam páginas do banco. */
export async function dbPageMetadata(slug: string): Promise<Metadata> {
  const page = await getDbPage(slug);
  if (!page) return { title: 'Página não encontrada' };

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.excerpt || undefined,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      type: 'article',
      title: page.metaTitle || page.title,
      description: page.metaDescription || page.excerpt || undefined,
      url: `/${page.slug}`,
    },
  };
}

interface DbPageProps {
  slug: string;
  /** Rótulo curto exibido acima do título. */
  kicker?: string;
}

export async function DbPage({ slug, kicker = 'Documento' }: DbPageProps) {
  const page = await getDbPage(slug);
  if (!page) notFound();

  const html = markdownToHtml(page.content);
  const crumbs = [{ label: page.title, href: `/${page.slug}` }];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <section className="border-b border-border bg-hero-fade">
        <div className="container py-12 md:py-16">
          <Breadcrumbs items={crumbs} className="mb-8" />
          <SectionHeading
            as="h1"
            kicker={kicker}
            title={page.title}
            description={page.excerpt ?? undefined}
          />
        </div>
      </section>

      <section className="container py-14 md:py-16">
        <div className="mx-auto max-w-3xl">
          <article className="prose-editorial" dangerouslySetInnerHTML={{ __html: html }} />

          <p className="mt-14 border-t border-border pt-6 text-xs text-muted-foreground">
            Documento atualizado em {formatDate(page.updatedAt)}.
          </p>
        </div>
      </section>
    </>
  );
}

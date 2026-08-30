import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight, Clock, CalendarDays } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';

import { absoluteUrl, formatDate, initials, toISO } from '@/lib/utils';
import { extractHeadings, extractFaq } from '@/lib/markdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { AdSlot } from '@/components/shared/ad-slot';
import { getAdConfig, getAdBlocks } from '@/lib/ads';
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from '@/components/shared/json-ld';
import { SectionHeading } from '@/components/shared/section-heading';
import { PostContent } from '@/components/blog/post-content';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { ShareButtons } from '@/components/blog/share-buttons';
import { ReadingProgress } from '@/components/blog/reading-progress';
import { PostCard } from '@/components/blog/post-card';
import { AuthorCard } from '@/components/blog/author-card';
import type { PostCardData, SlugParams } from '@/types';

export const revalidate = 1800;

export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    });
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

/**
 * Busca o artigo.
 *
 * Sem try/catch: uma falha de banco no build geraria um 404 silencioso e
 * publicaria a pagina vazia. Melhor quebrar o build.
 */
async function getPost(slug: string) {
  return prisma.post.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          imagePosition: true,
          imageZoom: true,
          bio: true,
        },
      },
      category: true,
      tags: true,
    },
  });
}

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Artigo não encontrado' };

  const url = `/blog/${post.slug}`;

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: post.canonicalUrl || url },
    openGraph: {
      type: 'article',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      url,
      publishedTime: toISO(post.publishedAt),
      modifiedTime: toISO(post.updatedAt),
      authors: [post.author.name],
      tags: post.tags.map((tag) => tag.name),
      images: post.coverImage
        ? [{ url: post.coverImage, alt: post.coverImageAlt ?? post.title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: SlugParams) {
  const [settings, post] = await Promise.all([getSettings(), getPost(params.slug)]);

  const ads = getAdConfig(settings);

  if (!post) notFound();

  // Relacionados: mesma categoria, com fallback para os mais recentes
  const related = await prisma.post
    .findMany({
      where: {
        status: 'PUBLISHED',
        slug: { not: post.slug },
        ...(post.categoryId ? { categoryId: post.categoryId } : {}),
      },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        coverImageAlt: true,
        publishedAt: true,
        readingMinutes: true,
        featured: true,
        category: { select: { name: true, slug: true, color: true } },
        author: { select: { name: true, image: true } },
      },
    })
    .catch(() => []);

  const headings = extractHeadings(post.content);
  // Perguntas frequentes escritas no corpo do artigo viram FAQPage.
  const faq = extractFaq(post.content);
  const crumbs = [
    { label: 'Blog', href: '/blog' },
    ...(post.category
      ? [{ label: post.category.name, href: `/blog?categoria=${post.category.slug}` }]
      : []),
    { label: post.title, href: `/blog/${post.slug}` },
  ];

  return (
    <>
      <ReadingProgress />
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          articleSchema({
            title: post.title,
            description: post.metaDescription || post.excerpt,
            slug: post.slug,
            image: post.coverImage,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt,
            authorName: post.author.name,
            siteName: settings.siteName,
            keywords: post.keywords,
          }),
          ...(faq.length > 0 ? [faqSchema(faq)] : []),
        ]}
      />

      {/* ============ CABEÇALHO ============ */}
      <header className="border-b border-border bg-hero-fade">
        <div className="container py-10 md:py-14">
          <Breadcrumbs items={crumbs} className="mb-8" />

          <div className="mx-auto max-w-3xl">
            {post.category ? (
              <Link href={`/blog?categoria=${post.category.slug}`}>
                <Badge variant="accent">{post.category.name}</Badge>
              </Link>
            ) : null}

            <h1 className="mt-4 text-balance font-serif text-display-md">{post.title}</h1>

            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2.5">
                {post.author.image ? (
                  // Wrapper com overflow-hidden: a aproximação é um scale na
                  // imagem, que sem isso escaparia do círculo.
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border">
                    <Image
                      src={post.author.image}
                      alt={post.author.name}
                      width={72}
                      height={72}
                      className="h-full w-full object-cover"
                      style={{
                        objectPosition: post.author.imagePosition ?? undefined,
                        transform:
                          post.author.imageZoom && post.author.imageZoom !== 1
                            ? `scale(${post.author.imageZoom})`
                            : undefined,
                      }}
                    />
                  </div>
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-xs font-medium">
                    {initials(post.author.name)}
                  </span>
                )}
                <span className="font-medium text-foreground">{post.author.name}</span>
              </div>

              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                <time dateTime={toISO(post.publishedAt)}>{formatDate(post.publishedAt)}</time>
              </span>

              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {post.readingMinutes} min de leitura
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ============ IMAGEM DE CAPA ============ */}
      {post.coverImage ? (
        <div className="container -mt-2 pt-10">
          <div className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden rounded-lg border border-border shadow-elevated">
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt || post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      {/* ============ CORPO ============ */}
      <div className="container py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Sumário */}
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-24">
              <TableOfContents items={headings} />
            </div>
          </aside>

          {/* Artigo */}
          <article className="lg:col-span-6">
            <PostContent
              content={post.content}
              ads={ads}
              blocks={getAdBlocks(settings)}
            />

            {/* Tags */}
            {post.tags.length > 0 ? (
              <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-8">
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="muted">
                    #{tag.name}
                  </Badge>
                ))}
              </div>
            ) : null}

            <ShareButtons
              url={absoluteUrl(`/blog/${post.slug}`)}
              title={post.title}
              className="mt-8"
            />

            <AuthorCard
              nome={post.author.name}
              bio={post.author.bio}
              foto={post.author.image}
              fotoPosicao={post.author.imagePosition}
              fotoZoom={post.author.imageZoom}
              assunto={post.title}
            />

            {/* Aviso editorial — transparência exigida pelo AdSense */}
            <p className="mt-8 rounded-md border border-border bg-background p-4 text-xs leading-relaxed text-muted-foreground">
              Este conteúdo tem caráter informativo e educativo. Não substitui avaliação técnica
              presencial, projeto assinado por profissional habilitado nem orientação médica em
              questões de saúde, alergia ou sono. Preços, percentuais e especificações são
              estimativas de mercado e dados divulgados por fabricantes, sujeitos a variação por
              região, marca e fornecedor. Leia o{' '}
              <Link
                href="/aviso-legal"
                className="underline decoration-accent decoration-2 underline-offset-2 hover:text-foreground"
              >
                Aviso Legal
              </Link>
              . Última atualização em {formatDate(post.updatedAt)}.
            </p>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="space-y-8 lg:sticky lg:top-24">
              <AdSlot
                position="sidebar"
                ads={ads}
                format="rectangle"
                minHeight={600}
              />

              <div className="rounded-lg border border-border bg-surface p-6">
                <p className="font-serif text-lg">Guias essenciais</p>
                <ul className="mt-4 space-y-3 text-sm">
                  {[
                    {
                      href: '/blog/como-medir-janela-para-cortinas-e-persianas',
                      label: 'Como medir a janela sem errar',
                    },
                    {
                      href: '/blog/blackout-screen-ou-double-vision-comparativo',
                      label: 'Blackout, screen ou double vision',
                    },
                    {
                      href: '/blog/erros-mais-comuns-ao-comprar-cortinas',
                      label: 'Os 12 erros mais comuns',
                    },
                    {
                      href: '/tipos-de-cortinas',
                      label: 'Catálogo com 26 tipos',
                    },
                  ].map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ============ RELACIONADOS ============ */}
      {related.length > 0 ? (
        <section className="border-t border-border bg-surface py-16 md:py-20">
          <div className="container">
            <SectionHeading
              kicker="Continue lendo"
              title="Artigos relacionados"
              description="Outros guias que aprofundam o mesmo tema."
            />

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PostCard key={item.id} post={item as PostCardData} />
              ))}
            </div>

            <div className="mt-10">
              <Button asChild variant="outline">
                <Link href="/blog">
                  Ver todos os artigos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

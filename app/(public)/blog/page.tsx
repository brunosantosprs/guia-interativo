import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import { POSTS_PER_PAGE } from '@/lib/constants';
import { cn, slugify } from '@/lib/utils';
import { SectionHeading } from '@/components/shared/section-heading';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { AdSlot } from '@/components/shared/ad-slot';
import { getAdConfig } from '@/lib/ads';
import { JsonLd, breadcrumbSchema } from '@/components/shared/json-ld';
import { PostCard } from '@/components/blog/post-card';
import { BlogSearch } from '@/components/blog/blog-search';
import { Button } from '@/components/ui/button';
import type { PostCardData, SearchParams } from '@/types';

export const revalidate = 1800;

export const metadata: Metadata = {
  title: 'Blog — guias técnicos sobre cortinas e persianas',
  description:
    'Artigos aprofundados sobre cortinas e persianas: como escolher, como medir, comparativos de tecidos, limpeza correta, conforto térmico e automação.',
  alternates: { canonical: '/blog' },
};

const postCardSelect = {
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
} as const;

/**
 * Na página 1 sem filtro, o primeiro artigo vira destaque e sai da grade.
 * Buscando um a mais, a grade continua com POSTS_PER_PAGE itens e a última
 * linha fecha completa — antes ficava um buraco no lugar do destaque.
 */
async function getBlogData(categorySlug?: string, termo?: string, page = 1) {
  try {
    const busca = termo?.trim();

    // O slug é a forma sem acento do título. Buscar nele também faz
    // "quarto de bebe" encontrar "Cortinas para quarto de bebê" — sem
    // depender da extensão unaccent no banco.
    const buscaSlug = busca ? slugify(busca) : '';

    const where = {
      status: 'PUBLISHED' as const,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      // Busca no que descreve o artigo — título, resumo, categoria e tags —
      // e não no corpo inteiro. Os guias são longos e se citam entre si, e
      // procurar no conteúdo devolvia três quartos do acervo para quase
      // qualquer termo do assunto, o que não ajuda ninguém a achar nada.
      ...(busca
        ? {
            OR: [
              { title: { contains: busca, mode: 'insensitive' as const } },
              { excerpt: { contains: busca, mode: 'insensitive' as const } },
              { category: { name: { contains: busca, mode: 'insensitive' as const } } },
              { tags: { some: { name: { contains: busca, mode: 'insensitive' as const } } } },
              ...(buscaSlug
                ? [
                    { slug: { contains: buscaSlug } },
                    { category: { slug: { contains: buscaSlug } } },
                    { tags: { some: { slug: { contains: buscaSlug } } } },
                  ]
                : []),
            ],
          }
        : {}),
    };

    // O destaque só existe na página 1 do índice completo — com categoria ou
    // busca ativa, todos os artigos entram na grade.
    const temDestaque = !categorySlug && !busca;
    const extra = temDestaque ? 1 : 0;

    const [posts, total, categories] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        // A página 1 consome POSTS_PER_PAGE + extra; as seguintes começam
        // depois desse bloco, senão o artigo extra apareceria duas vezes.
        skip: page === 1 ? 0 : (page - 1) * POSTS_PER_PAGE + extra,
        take: page === 1 ? POSTS_PER_PAGE + extra : POSTS_PER_PAGE,
        select: postCardSelect,
      }),
      prisma.post.count({ where }),
      prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: {
          name: true,
          slug: true,
          _count: { select: { posts: { where: { status: 'PUBLISHED' } } } },
        },
      }),
    ]);

    return { posts, total, categories, temDestaque };
  } catch {
    return { posts: [], total: 0, categories: [], temDestaque: false };
  }
}

export default async function BlogPage({ searchParams }: SearchParams) {
  const categorySlug =
    typeof searchParams.categoria === 'string' ? searchParams.categoria : undefined;
  const termo = typeof searchParams.q === 'string' ? searchParams.q.trim() : undefined;
  const page = Number(searchParams.pagina) > 0 ? Number(searchParams.pagina) : 1;

  const [settings, { posts, total, categories, temDestaque }] = await Promise.all([
    getSettings(),
    getBlogData(categorySlug, termo, page),
  ]);

  const ads = getAdConfig(settings);

  // Com destaque, a página 1 consome um artigo a mais que as seguintes.
  const totalPages = temDestaque
    ? total <= POSTS_PER_PAGE + 1
      ? 1
      : 1 + Math.ceil((total - POSTS_PER_PAGE - 1) / POSTS_PER_PAGE)
    : Math.max(1, Math.ceil(total / POSTS_PER_PAGE));

  const activeCategory = categories.find((category) => category.slug === categorySlug);
  const crumbs = [{ label: 'Blog', href: '/blog' }];

  // O primeiro card só ganha destaque na página 1 do índice completo
  const showHero = page === 1 && temDestaque && posts.length > 0;
  const heroPost = showHero ? posts[0] : null;
  const gridPosts = showHero ? posts.slice(1) : posts;

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <section className="border-b border-border bg-hero-fade">
        <div className="container py-12 md:py-16">
          <Breadcrumbs items={crumbs} className="mb-8" />

          <SectionHeading
            as="h1"
            kicker="Blog"
            title={
              activeCategory
                ? `${activeCategory.name}`
                : 'Guias técnicos sobre cortinas e persianas'
            }
            description={
              activeCategory
                ? `Todos os artigos publicados na categoria ${activeCategory.name}.`
                : 'Artigos longos, com tabelas comparativas, checklists e as ressalvas que quase ninguém conta. Escritos para serem consultados, não apenas lidos.'
            }
          />

          <BlogSearch
            termo={termo}
            categoria={categorySlug}
            encontrados={total}
            className="mt-8 max-w-2xl"
          />

          {/* Filtro por categoria */}
          {categories.length > 0 ? (
            <nav className="mt-6 flex flex-wrap gap-2" aria-label="Filtrar por categoria">
              <CategoryChip href={buildHref({ termo })} active={!categorySlug}>
                Todos ({categories.reduce((sum, c) => sum + c._count.posts, 0)})
              </CategoryChip>
              {categories
                .filter((category) => category._count.posts > 0)
                .map((category) => (
                  <CategoryChip
                    key={category.slug}
                    href={buildHref({ termo, categoria: category.slug })}
                    active={categorySlug === category.slug}
                  >
                    {category.name} ({category._count.posts})
                  </CategoryChip>
                ))}
            </nav>
          ) : null}
        </div>
      </section>

      <section className="container py-14 md:py-16">
        {posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-24 text-center">
            <p className="font-serif text-xl">Nenhum artigo encontrado</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {termo
                ? `Nada corresponde a “${termo}”${activeCategory ? ` em ${activeCategory.name}` : ''}. Tente outra palavra, ou volte ao índice completo do blog.`
                : 'Ainda não há conteúdo publicado nesta categoria. Volte ao índice completo do blog.'}
            </p>
            <Button asChild variant="outline" size="sm" className="mt-6">
              <Link href="/blog">Ver todos os artigos</Link>
            </Button>
          </div>
        ) : (
          <>
            {heroPost ? (
              <div className="mb-10">
                <PostCard post={heroPost as PostCardData} variant="featured" priority />
              </div>
            ) : null}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post as PostCardData}
                  priority={!showHero && index < 3}
                />
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 ? (
              <nav
                className="mt-14 flex items-center justify-center gap-2"
                aria-label="Paginação do blog"
              >
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => {
                  const href = buildHref({
                    termo,
                    categoria: categorySlug,
                    pagina: number,
                  });

                  return (
                    <Link
                      key={number}
                      href={href}
                      aria-current={number === page ? 'page' : undefined}
                      className={cn(
                        'flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors',
                        number === page
                          ? 'border-accent bg-accent text-accent-foreground'
                          : 'border-border hover:border-accent hover:text-accent',
                      )}
                    >
                      {number}
                    </Link>
                  );
                })}
              </nav>
            ) : null}
          </>
        )}

        <AdSlot
          position="footer"
          ads={ads}
          format="horizontal"
          minHeight={120}
          className="mt-16"
        />
      </section>
    </>
  );
}

/**
 * Monta o link do blog preservando busca, categoria e página.
 *
 * Centralizado porque os três lugares que geram link — chips de categoria,
 * paginação e o campo de busca — precisam carregar os mesmos parâmetros.
 * Quando cada um montava a URL do seu jeito, filtrar por categoria apagava
 * a busca em andamento.
 */
function buildHref({
  termo,
  categoria,
  pagina,
}: {
  termo?: string;
  categoria?: string;
  pagina?: number;
}): string {
  const query = new URLSearchParams();
  if (termo) query.set('q', termo);
  if (categoria) query.set('categoria', categoria);
  if (pagina && pagina > 1) query.set('pagina', String(pagina));

  return query.toString() ? `/blog?${query.toString()}` : '/blog';
}

function CategoryChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200',
        active
          ? 'border-accent bg-accent text-accent-foreground'
          : 'border-border bg-background text-muted-foreground hover:border-accent hover:text-foreground',
      )}
    >
      {children}
    </Link>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ArrowRight,
  Check,
  Coins,
  Hammer,
  Home,
  Minus,
  Sparkles,
  SprayCan,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import { LIGHT_BLOCKING_LABELS, SITE } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { AdSlot } from '@/components/shared/ad-slot';
import { getAdConfig } from '@/lib/ads';
import { JsonLd, breadcrumbSchema, faqSchema } from '@/components/shared/json-ld';
import { SectionHeading } from '@/components/shared/section-heading';
import { LightMeter } from '@/components/cortinas/light-meter';
import { CurtainCard } from '@/components/cortinas/curtain-card';
import { PostContent } from '@/components/blog/post-content';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { extractHeadings, extractFaq } from '@/lib/markdown';
import type { SlugParams } from '@/types';

export const revalidate = 3600;

/** Gera as rotas estáticas de todos os tipos publicados. */
export async function generateStaticParams() {
  try {
    const curtains = await prisma.curtainType.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    });
    return curtains.map((curtain) => ({ slug: curtain.slug }));
  } catch {
    return [];
  }
}

/**
 * Busca o tipo de cortina.
 *
 * Sem try/catch de proposito: se o banco falhar durante o build, a pagina
 * seria gerada como 404 e publicada vazia sem ninguem perceber. E preferivel
 * que o build quebre e o erro apareca.
 */
async function getCurtain(slug: string) {
  return prisma.curtainType.findFirst({ where: { slug, status: 'PUBLISHED' } });
}

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const curtain = await getCurtain(params.slug);
  if (!curtain) return { title: 'Tipo não encontrado' };

  const url = `/tipos-de-cortinas/${curtain.slug}`;

  return {
    title: curtain.metaTitle || curtain.name,
    description: curtain.metaDescription || curtain.summary,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: curtain.metaTitle || curtain.name,
      description: curtain.metaDescription || curtain.summary,
      url,
      images: curtain.image ? [{ url: curtain.image, alt: curtain.imageAlt ?? curtain.name }] : undefined,
    },
  };
}

export default async function CurtainTypePage({ params }: SlugParams) {
  const [settings, curtain] = await Promise.all([getSettings(), getCurtain(params.slug)]);

  const ads = getAdConfig(settings);

  if (!curtain) notFound();

  // Sumário do guia longo, quando houver conteúdo em markdown.
  const headings = curtain.content?.trim() ? extractHeadings(curtain.content) : [];
  // Perguntas frequentes do guia longo viram FAQPage.
  const faq = curtain.content?.trim() ? extractFaq(curtain.content) : [];

  // Relacionados: mesma categoria primeiro, completando com destaques
  const related = await prisma.curtainType
    .findMany({
      where: {
        status: 'PUBLISHED',
        slug: { not: curtain.slug },
        OR: [{ category: curtain.category }, { lightBlocking: curtain.lightBlocking }],
      },
      orderBy: { order: 'asc' },
      take: 3,
      select: {
        id: true,
        name: true,
        slug: true,
        summary: true,
        category: true,
        lightBlocking: true,
        image: true,
        imageAlt: true,
        bestRooms: true,
      },
    })
    .catch(() => []);

  const crumbs = [
    { label: 'Tipos de Cortinas', href: '/tipos-de-cortinas' },
    { label: curtain.name, href: `/tipos-de-cortinas/${curtain.slug}` },
  ];

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: curtain.name,
    description: curtain.summary,
    image: `${SITE.url}${curtain.image ?? '/images/og-default.jpg'}`,
    category: curtain.category,
    material: curtain.materials.join(', '),
    brand: { '@type': 'Brand', name: settings.siteName },
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          productSchema,
          ...(faq.length > 0 ? [faqSchema(faq)] : []),
        ]}
      />

      {/* ============ CABEÇALHO ============ */}
      <section className="border-b border-border bg-hero-fade">
        <div className="container py-10 md:py-14">
          <Breadcrumbs items={crumbs} className="mb-8" />

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <Badge variant="accent">{curtain.category}</Badge>

              <h1 className="mt-4 text-balance font-serif text-display-md">{curtain.name}</h1>

              <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
                {curtain.summary}
              </p>

              <div className="mt-8 max-w-sm rounded-lg border border-border bg-background p-5">
                <LightMeter level={curtain.lightBlocking} />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {curtain.materials.map((material) => (
                  <Badge key={material} variant="outline">
                    {material}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border shadow-elevated">
                <Image
                  src={curtain.image || '/images/og-default.jpg'}
                  alt={curtain.imageAlt || curtain.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CONTEÚDO ============ */}
      <section className="container py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            {/* Descrição rica */}
            <article className="prose-editorial">
              <h2 className="!mt-0">Como funciona e o que esperar</h2>
              {curtain.description.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </article>

            {/* Vantagens e desvantagens */}
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-background p-6">
                <h2 className="flex items-center gap-2 font-serif text-lg">
                  <Check className="h-4 w-4 text-accent" aria-hidden />
                  Vantagens
                </h2>
                <ul className="mt-4 space-y-3">
                  {curtain.advantages.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-relaxed">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-surface p-6">
                <h2 className="flex items-center gap-2 font-serif text-lg">
                  <Minus className="h-4 w-4 text-muted-foreground" aria-hidden />
                  Desvantagens
                </h2>
                <ul className="mt-4 space-y-3">
                  {curtain.disadvantages.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-relaxed">
                      <Minus
                        className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                        aria-hidden
                      />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Anúncio in-article */}
            <AdSlot
              position="inArticle"
              ads={ads}
              format="fluid"
              minHeight={260}
              className="my-12"
            />

            {/* Quando escolher */}
            <div className="rounded-lg border-l-2 border-accent bg-surface p-7">
              <h2 className="flex items-center gap-2 font-serif text-xl">
                <Sparkles className="h-5 w-5 text-accent" strokeWidth={1.6} aria-hidden />
                Quando escolher este modelo
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{curtain.whenToChoose}</p>
            </div>

            {/* Instalação */}
            {curtain.installation ? (
              <div className="mt-10">
                <h2 className="flex items-center gap-2 font-serif text-xl">
                  <Hammer className="h-5 w-5 text-accent" strokeWidth={1.6} aria-hidden />
                  Instalação
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">{curtain.installation}</p>
              </div>
            ) : null}

            {/* Manutenção */}
            {curtain.maintenance ? (
              <div className="mt-10">
                <h2 className="flex items-center gap-2 font-serif text-xl">
                  <SprayCan className="h-5 w-5 text-accent" strokeWidth={1.6} aria-hidden />
                  Manutenção e limpeza
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">{curtain.maintenance}</p>
                <Link
                  href="/blog/como-limpar-cortinas-e-persianas"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium underline decoration-accent decoration-2 underline-offset-4 hover:text-accent"
                >
                  Guia completo de limpeza por material
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : null}

            {/*
              Guia longo em markdown, quando preenchido no painel.
              Usa o mesmo pipeline do blog: sanitização, sumário e blocos de
              anúncio. Sem conteúdo, a página fica exatamente como antes.
            */}
            {curtain.content?.trim() ? (
              <div className="mt-14 border-t border-border pt-10">
                {headings.length > 2 ? (
                  <div className="mb-10 lg:hidden">
                    <TableOfContents items={headings} />
                  </div>
                ) : null}
                <PostContent content={curtain.content} ads={ads} />
              </div>
            ) : null}

            {/* Aviso editorial — mesma transparência exigida pelo AdSense no blog */}
            <p className="mt-10 rounded-md border border-border bg-background p-4 text-xs leading-relaxed text-muted-foreground">
              Este conteúdo tem caráter informativo e educativo. Não substitui avaliação técnica
              presencial nem projeto assinado por profissional habilitado. Preços, percentuais e
              especificações são estimativas de mercado e dados divulgados por fabricantes,
              sujeitos a variação por região, marca e fornecedor. Leia o{' '}
              <Link
                href="/aviso-legal"
                className="underline decoration-accent decoration-2 underline-offset-2 hover:text-foreground"
              >
                Aviso Legal
              </Link>
              .
            </p>
          </div>

          {/* ============ SIDEBAR ============ */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 lg:space-y-6">
              <div className="rounded-lg border border-border bg-background p-6">
                <h2 className="font-serif text-lg">Ficha técnica</h2>

                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                      Categoria
                    </dt>
                    <dd className="mt-1">{curtain.category}</dd>
                  </div>

                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                      Bloqueio de luz
                    </dt>
                    <dd className="mt-1">{LIGHT_BLOCKING_LABELS[curtain.lightBlocking]}</dd>
                  </div>

                  {curtain.priceRange ? (
                    <div>
                      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                        <Coins className="h-3.5 w-3.5" aria-hidden />
                        Faixa de investimento
                      </dt>
                      <dd className="mt-1">{curtain.priceRange}</dd>
                    </div>
                  ) : null}

                  <div>
                    <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                      <Home className="h-3.5 w-3.5" aria-hidden />
                      Melhores ambientes
                    </dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {curtain.bestRooms.map((room) => (
                        <Badge key={room} variant="muted">
                          {room}
                        </Badge>
                      ))}
                    </dd>
                  </div>
                </dl>

                <Button asChild variant="accent" className="mt-6 w-full">
                  <Link href="/contato">
                    Tirar dúvida sobre este modelo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <AdSlot
                position="sidebar"
                ads={ads}
                format="rectangle"
                minHeight={600}
                className="hidden lg:block"
              />
            </div>
          </aside>
        </div>
      </section>

      {/* ============ RELACIONADOS ============ */}
      {related.length > 0 ? (
        <section className="border-t border-border bg-surface py-16 md:py-20">
          <div className="container">
            <SectionHeading
              kicker="Comparar"
              title="Modelos que costumam ser avaliados junto"
              description="Antes de decidir, vale confrontar alternativas com desempenho ou aplicação parecidos."
            />

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <CurtainCard key={item.id} curtain={item} />
              ))}
            </div>

            <div className="mt-10">
              <Button asChild variant="outline">
                <Link href="/tipos-de-cortinas">
                  Voltar ao catálogo completo
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

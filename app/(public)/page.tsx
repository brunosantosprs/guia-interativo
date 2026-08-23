import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowRight, Blinds, Compass, Ruler, Sparkles, Sun } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';

import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/shared/section-heading';
import { FadeIn, Stagger, StaggerItem } from '@/components/shared/motion';
import { AdSlot } from '@/components/shared/ad-slot';
import { getAdConfig } from '@/lib/ads';
import { Icon } from '@/components/shared/icon';
import { CurtainCard } from '@/components/cortinas/curtain-card';
import { PostCard } from '@/components/blog/post-card';
import type { PostCardData } from '@/types';

/** Revalida a home a cada hora (ISR). */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Cortinas e Persianas — guias técnicos e catálogo completo',
  description:
    'O guia definitivo de cortinas e persianas: 26 tipos detalhados, comparativos técnicos, como medir, como instalar e como escolher para cada ambiente da casa.',
  alternates: { canonical: '/' },
};

async function getHomeData() {
  try {
    const [featuredCurtains, featuredPosts, recentPosts, services, counts] = await Promise.all([
      prisma.curtainType.findMany({
        where: { status: 'PUBLISHED', featured: true },
        orderBy: { order: 'asc' },
        take: 6,
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
      }),
      prisma.post.findMany({
        where: { status: 'PUBLISHED', featured: true },
        orderBy: { publishedAt: 'desc' },
        take: 1,
        select: postCardSelect,
      }),
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 4,
        select: postCardSelect,
      }),
      prisma.service.findMany({
        where: { status: 'PUBLISHED', featured: true },
        orderBy: { order: 'asc' },
        take: 4,
        select: { id: true, title: true, slug: true, shortDescription: true, icon: true },
      }),
      Promise.all([
        prisma.curtainType.count({ where: { status: 'PUBLISHED' } }),
        prisma.post.count({ where: { status: 'PUBLISHED' } }),
        prisma.service.count({ where: { status: 'PUBLISHED' } }),
      ]),
    ]);

    return {
      featuredCurtains,
      featuredPost: featuredPosts[0] ?? null,
      recentPosts,
      services,
      counts: { curtains: counts[0], posts: counts[1], services: counts[2] },
    };
  } catch {
    // Banco indisponível: a home continua renderizando sem as listagens.
    return {
      featuredCurtains: [],
      featuredPost: null,
      recentPosts: [],
      services: [],
      counts: { curtains: 0, posts: 0, services: 0 },
    };
  }
}

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

/** Pilares editoriais exibidos logo abaixo do hero. */
const PILLARS = [
  {
    icon: Blinds,
    title: '26 tipos catalogados',
    description:
      'Cada modelo com descrição técnica, vantagens, desvantagens, ambientes ideais e nível de bloqueio de luz.',
    href: '/tipos-de-cortinas',
    cta: 'Ver o catálogo',
  },
  {
    icon: Ruler,
    title: 'Medidas sem erro',
    description:
      'O método profissional de medição: três pontos de largura, esquadro, transbordo e folga de piso.',
    href: '/blog/como-medir-janela-para-cortinas-e-persianas',
    cta: 'Aprender a medir',
  },
  {
    icon: Sun,
    title: 'Luz e conforto térmico',
    description:
      'Quanto cada tecido bloqueia de verdade e como a janela certa reduz calor e conta de energia.',
    href: '/blog/cortinas-reduzem-calor-e-conta-de-energia',
    cta: 'Entender o desempenho',
  },
];

/** Roteiro rápido de decisão exibido na seção "Por onde começar". */
const DECISION_STEPS = [
  {
    number: '01',
    title: 'Diagnostique o ambiente',
    description:
      'Orientação solar, horário do sol direto, umidade, ruído e uso do cômodo. O problema real da janela determina tudo o que vem depois.',
  },
  {
    number: '02',
    title: 'Escolha o sistema, não o tecido',
    description:
      'Rolô, romana, wave, painel ou persiana de lâminas. O sistema define espaço ocupado, controle de luz e manutenção.',
  },
  {
    number: '03',
    title: 'Meça e defina a instalação',
    description:
      'Dentro ou fora do vão, transbordo lateral, altura acima da janela. É aqui que se ganha ou se perde o bloqueio de luz.',
  },
  {
    number: '04',
    title: 'Só então escolha o tecido',
    description:
      'Fibra, gramatura e solidez à luz, sempre testados com amostra física na luz real do ambiente.',
  },
];

export default async function HomePage() {
  const [settings, data] = await Promise.all([getSettings(), getHomeData()]);

  const ads = getAdConfig(settings);

  return (
    <>
      {/* ================= HERO ================= */}
      {/* Bloco bege cheio: é o primeiro sinal de cor da página */}
      <section className="relative overflow-hidden bg-surface">
        {/* Filete dourado no topo, reforçando a cor de destaque */}
        <span className="absolute inset-x-0 top-0 h-1 bg-accent" aria-hidden />

        <div className="container grid items-center gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-16 lg:py-28">
          <div className="lg:col-span-6">
            <FadeIn>
              <div className="mb-6 flex items-center gap-3">
                <span className="rule-accent" aria-hidden />
                <span className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Guia técnico · Cortinas e persianas
                </span>
              </div>

              <h1 className="text-balance font-serif text-display-lg">
                Escolha a cortina certa com{' '}
                <span className="italic text-accent">critério técnico</span>, não por tentativa
              </h1>

              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                Conteúdo denso e verificado sobre cada tipo de cortina e persiana: o que bloqueia de
                verdade, onde funciona, quanto custa manter e como medir sem errar.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/tipos-de-cortinas">
                    Explorar os {data.counts.curtains || 26} tipos
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/blog">Ler os guias</Link>
                </Button>
              </div>

              <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-secondary/15 pt-8">
                <Stat value={`${data.counts.curtains || 26}`} label="Tipos catalogados" />
                <Stat value={`${data.counts.posts || 10}`} label="Guias publicados" />
                <Stat value={`${data.counts.services || 6}`} label="Serviços técnicos" />
              </dl>
            </FadeIn>
          </div>

          <div className="lg:col-span-6">
            <FadeIn delay={0.15}>
              <div className="relative">
                <div className="relative aspect-[7/5] overflow-hidden rounded-lg border border-border shadow-elevated">
                  <Image
                    src="/images/hero.jpg"
                    alt="Cortina clara filtrando a luz natural em ambiente contemporâneo"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                {/* Cartão flutuante com o dado mais útil do site */}
                <div className="absolute -bottom-6 -left-4 hidden max-w-[260px] rounded-lg border border-border bg-background p-5 shadow-elevated sm:block">
                  <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    <Compass className="h-3.5 w-3.5 text-accent" aria-hidden />
                    Regra de ouro
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">
                    Tecido blackout não garante quarto escuro. O que resolve é o{' '}
                    <strong className="font-semibold">transbordo lateral</strong> de 15 a 20 cm.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ================= PILARES ================= */}
      <section className="container py-16 md:py-20">
        <Stagger className="grid gap-6 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <StaggerItem key={pillar.title}>
              <Link
                href={pillar.href}
                className="card-premium group flex h-full flex-col p-7"
              >
                <pillar.icon className="h-7 w-7 text-accent" strokeWidth={1.5} aria-hidden />
                <h2 className="mt-5 font-serif text-xl">{pillar.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
                <span className="mt-5 flex items-center gap-1.5 text-sm font-medium transition-colors group-hover:text-accent">
                  {pillar.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ================= TIPOS EM DESTAQUE ================= */}
      {data.featuredCurtains.length > 0 ? (
        <section className="border-y border-border bg-surface py-16 md:py-24">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                kicker="Catálogo"
                title="Os tipos que resolvem a maioria dos projetos"
                description="Comece pelos modelos mais versáteis. Cada ficha traz descrição técnica, vantagens, desvantagens e o critério de quando escolher."
              />
              <Button asChild variant="outline">
                <Link href="/tipos-de-cortinas">
                  Ver todos os tipos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.featuredCurtains.map((curtain) => (
                <StaggerItem key={curtain.id} className="h-full">
                  <CurtainCard curtain={curtain} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ) : null}

      {/* ================= ANÚNCIO ================= */}
      <div className="container py-12">
        <AdSlot
          position="topBanner"
          ads={ads}
          format="horizontal"
          minHeight={120}
        />
      </div>

      {/* ================= POR ONDE COMEÇAR ================= */}
      {/* Faixa grafite: quebra a sequência clara e ancora o meio da página */}
      <section className="bg-secondary py-16 text-secondary-foreground md:py-24">
        <div className="container grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              invert
              kicker="Método"
              title="Por onde começar"
              description="A ordem das decisões importa mais do que qualquer preferência estética. Este é o roteiro que profissionais seguem — e que evita os erros mais caros."
            />
            <Button asChild className="mt-8">
              <Link href="/blog/erros-mais-comuns-ao-comprar-cortinas">
                Ver os 12 erros mais comuns
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="lg:col-span-7">
            <Stagger className="space-y-px overflow-hidden rounded-lg border border-secondary-foreground/15">
              {DECISION_STEPS.map((step) => (
                <StaggerItem key={step.number}>
                  <div className="flex gap-6 bg-secondary-foreground/[0.06] p-6 transition-colors hover:bg-secondary-foreground/10 md:p-7">
                    <span className="font-serif text-2xl text-accent" aria-hidden>
                      {step.number}
                    </span>
                    <div>
                      <h3 className="font-serif text-lg text-secondary-foreground">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-secondary-foreground/70">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ================= BLOG ================= */}
      {data.recentPosts.length > 0 ? (
        <section className="border-y border-border bg-surface py-16 md:py-24">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                kicker="Blog"
                title="Guias completos, escritos para serem úteis"
                description="Artigos longos, com tabelas comparativas, checklists e as ressalvas que ninguém costuma contar."
              />
              <Button asChild variant="outline">
                <Link href="/blog">
                  Todos os artigos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-12">
              {data.featuredPost ? (
                <FadeIn className="lg:col-span-7">
                  <PostCard
                    post={data.featuredPost as PostCardData}
                    variant="featured"
                    className="h-full"
                  />
                </FadeIn>
              ) : null}

              <div className="grid gap-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
                {data.recentPosts
                  .filter((post) => post.id !== data.featuredPost?.id)
                  .slice(0, 3)
                  .map((post, index) => (
                    <FadeIn key={post.id} delay={index * 0.08}>
                      <article className="card-premium p-5">
                        <PostCard post={post as PostCardData} variant="compact" />
                      </article>
                    </FadeIn>
                  ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ================= SERVIÇOS ================= */}
      {data.services.length > 0 ? (
        <section className="container py-16 md:py-24">
          <SectionHeading
            kicker="Serviços"
            title="Do diagnóstico à instalação"
            description="Quando o conteúdo não basta, existe execução técnica: consultoria, medição com laudo, instalação, automação e manutenção."
            align="center"
          />

          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.services.map((service) => (
              <StaggerItem key={service.id} className="h-full">
                <Link
                  href={`/servicos/${service.slug}`}
                  className="card-premium group flex h-full flex-col p-6"
                >
                  <Icon name={service.icon} className="h-7 w-7 text-accent" />
                  <h3 className="mt-5 font-serif text-lg leading-snug transition-colors group-hover:text-accent">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 line-clamp-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {service.shortDescription}
                  </p>
                  <span className="mt-5 flex items-center gap-1.5 text-sm font-medium">
                    Ver processo
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link href="/servicos">
                Conhecer todos os serviços
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      ) : null}

      {/* ================= CTA FINAL ================= */}
      <section className="container pb-20 md:pb-28">
        <FadeIn>
          <div className="relative overflow-hidden rounded-lg bg-secondary px-8 py-14 text-center text-secondary-foreground md:px-16 md:py-20">
            <Sparkles
              className="mx-auto h-8 w-8 text-accent"
              strokeWidth={1.4}
              aria-hidden
            />
            <h2 className="mx-auto mt-6 max-w-2xl text-balance font-serif text-display-sm">
              Ainda em dúvida sobre qual solução usar na sua janela?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-secondary-foreground/75">
              Descreva o ambiente — orientação solar, uso e o que incomoda hoje. Respondemos com uma
              recomendação técnica objetiva, sem compromisso.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button asChild variant="accent" size="lg">
                <Link href="/contato">
                  Falar com a equipe
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-secondary-foreground/25 text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground"
              >
                <Link href="/tipos-de-cortinas">Explorar o catálogo</Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="block font-serif text-3xl text-foreground">{value}</span>
        <span className="mt-1 block text-xs leading-snug text-muted-foreground">{label}</span>
      </dd>
    </div>
  );
}

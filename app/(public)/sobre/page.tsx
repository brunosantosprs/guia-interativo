import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  BookOpenCheck,
  MessageSquareQuote,
  Microscope,
  ScrollText,
  ShieldCheck,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import { SectionHeading } from '@/components/shared/section-heading';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { JsonLd, breadcrumbSchema } from '@/components/shared/json-ld';
import { FadeIn, Stagger, StaggerItem } from '@/components/shared/motion';
import { Button } from '@/components/ui/button';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Sobre o Guia Interativo — como produzimos o conteúdo',
  description:
    'Quem somos, como apuramos as informações técnicas sobre cortinas e persianas, nossa política editorial e como a publicidade é tratada no site.',
  alternates: { canonical: '/sobre' },
};

/** Princípios editoriais — reforçam a credibilidade (E-E-A-T) do domínio. */
const PRINCIPLES = [
  {
    icon: Microscope,
    title: 'Precisão antes de opinião',
    description:
      'Números, percentuais e faixas de preço vêm de fichas técnicas de fabricantes, normas aplicáveis e prática de campo. Quando um dado é estimativa, dizemos que é estimativa.',
  },
  {
    icon: ScrollText,
    title: 'Limitações declaradas',
    description:
      'Todo material tem ponto fraco. Cada ficha do catálogo lista desvantagens reais, e nenhum artigo promete que uma cortina resolve o que ela não resolve.',
  },
  {
    icon: ShieldCheck,
    title: 'Publicidade separada do conteúdo',
    description:
      'Os anúncios sustentam o site, mas são sempre visualmente distinguíveis e nunca influenciam uma recomendação técnica. Conteúdo patrocinado, se houver, é identificado.',
  },
  {
    icon: BookOpenCheck,
    title: 'Conteúdo revisado e datado',
    description:
      'Cada artigo mostra a data da última atualização. Preços, tecnologias e normas mudam — e o texto acompanha essa mudança em vez de envelhecer em silêncio.',
  },
];

/** Etapas do processo editorial. */
const PROCESS = [
  {
    number: '01',
    title: 'Pauta a partir de dúvida real',
    description:
      'As pautas nascem de perguntas que aparecem repetidamente em atendimento, em busca orgânica e em fóruns de reforma — não de volume de palavra-chave isolado.',
  },
  {
    number: '02',
    title: 'Apuração técnica',
    description:
      'Consulta a fichas de fabricantes, normas aplicáveis, literatura de conforto ambiental e a prática de instaladores e projetistas.',
  },
  {
    number: '03',
    title: 'Escrita com ressalvas',
    description:
      'O texto explica o mecanismo, não apenas o resultado. Onde há limitação, controvérsia ou variação regional, o artigo diz isso explicitamente.',
  },
  {
    number: '04',
    title: 'Revisão e atualização',
    description:
      'Cada conteúdo é revisado periodicamente. Mudou preço, tecnologia ou recomendação técnica, o artigo é corrigido e a data de atualização muda com ele.',
  },
];

async function getStats() {
  try {
    const [curtains, posts, services] = await Promise.all([
      prisma.curtainType.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.service.count({ where: { status: 'PUBLISHED' } }),
    ]);
    return { curtains, posts, services };
  } catch {
    return { curtains: 26, posts: 10, services: 6 };
  }
}

export default async function SobrePage() {
  const [settings, stats] = await Promise.all([getSettings(), getStats()]);
  const crumbs = [{ label: 'Sobre', href: '/sobre' }];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      {/* ============ CABEÇALHO ============ */}
      <section className="border-b border-border bg-hero-fade">
        <div className="container py-12 md:py-16">
          <Breadcrumbs items={crumbs} className="mb-8" />

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <SectionHeading
                as="h1"
                kicker="Sobre"
                title="Um guia que explica o mecanismo, não só o resultado"
                description="O Guia Interativo nasceu de uma constatação simples: quase todo o conteúdo disponível sobre cortinas ou é catálogo de loja, ou é lista rasa de tendências. Faltava material que explicasse por que um sistema funciona, onde ele falha e como decidir com critério."
              />

              <div className="prose-editorial mt-8 max-w-none">
                <p>
                  Cortina é um dos poucos itens da casa que interfere ao mesmo tempo no sono, na
                  temperatura, no ruído, na conta de energia e na percepção do espaço. Ainda assim,
                  costuma ser escolhida em quinze minutos, pela cor.
                </p>
                <p>
                  Nosso trabalho é entregar, de forma acessível e organizada, a informação que
                  normalmente só circula entre projetistas, instaladores e fabricantes: o que cada
                  material realmente bloqueia, quanto pesa, como se comporta sob sol direto, quanto
                  custa manter e em quais situações ele é a escolha errada.
                </p>
              </div>

              <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8">
                <Stat value={String(stats.curtains)} label="Tipos catalogados" />
                <Stat value={String(stats.posts)} label="Guias publicados" />
                <Stat value={String(stats.services)} label="Serviços técnicos" />
              </dl>
            </div>

            <div className="lg:col-span-5">
              <FadeIn delay={0.1}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border shadow-elevated">
                  <Image
                    src="/images/sobre.jpg"
                    alt="Ambiente com cortina filtrando luz natural"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRINCÍPIOS ============ */}
      <section className="container py-16 md:py-20">
        <SectionHeading
          kicker="Política editorial"
          title="Como decidimos o que publicar"
          description="Quatro compromissos que valem para cada linha do site — inclusive quando cumpri-los custa engajamento."
        />

        <Stagger className="mt-12 grid gap-6 md:grid-cols-2">
          {PRINCIPLES.map((principle) => (
            <StaggerItem key={principle.title}>
              <div className="h-full rounded-lg border border-border bg-background p-7">
                <principle.icon className="h-7 w-7 text-accent" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-5 font-serif text-xl">{principle.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {principle.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ============ PROCESSO ============ */}
      <section className="border-y border-border bg-surface py-16 md:py-24">
        <div className="container grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              kicker="Processo"
              title="Do primeiro rascunho à revisão"
              description="Nenhum artigo do site é gerado no automático. Este é o caminho que cada conteúdo percorre antes de ser publicado."
            />
            <Button asChild className="mt-8">
              <Link href="/blog">
                Ver os guias publicados
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="lg:col-span-7">
            <Stagger className="space-y-px overflow-hidden rounded-lg border border-border">
              {PROCESS.map((step) => (
                <StaggerItem key={step.number}>
                  <div className="flex gap-6 bg-background p-6 md:p-7">
                    <span className="font-serif text-2xl text-accent" aria-hidden>
                      {step.number}
                    </span>
                    <div>
                      <h3 className="font-serif text-lg">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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

      {/* ============ TRANSPARÊNCIA ============ */}
      <section className="container py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            kicker="Transparência"
            title="Como o site se sustenta"
            align="center"
          />

          <div className="prose-editorial mt-8">
            <p>
              O {settings.siteName} é gratuito e sem paywall. A manutenção é custeada por
              publicidade exibida através do Google AdSense e, eventualmente, pela prestação dos
              serviços técnicos descritos na página de{' '}
              <Link href="/servicos">Serviços</Link>.
            </p>
            <p>
              Os blocos de anúncio são sempre rotulados e visualmente separados do texto. Nenhum
              anunciante tem influência sobre as recomendações publicadas, e nenhum artigo é escrito
              para favorecer um fornecedor específico. Se um dia publicarmos conteúdo patrocinado,
              ele será identificado de forma explícita no topo da página.
            </p>
            <p>
              Detalhes sobre cookies, dados coletados e seus direitos estão em{' '}
              <Link href="/politica-de-privacidade">Política de Privacidade</Link>,{' '}
              <Link href="/politica-de-cookies">Política de Cookies</Link> e{' '}
              <Link href="/termos-de-uso">Termos de Uso</Link>.
            </p>
          </div>

          <div className="mt-12 rounded-lg border border-border bg-surface p-8 text-center">
            <MessageSquareQuote
              className="mx-auto h-7 w-7 text-accent"
              strokeWidth={1.5}
              aria-hidden
            />
            <h2 className="mt-4 font-serif text-xl">Encontrou um erro? Conte para a gente</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Correções são bem-vindas e levadas a sério. Se um dado estiver desatualizado ou
              incorreto, avise — verificamos e, se procede, corrigimos com nota de atualização.
            </p>
            <Button asChild variant="accent" className="mt-6">
              <Link href="/contato">
                Enviar uma correção
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
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

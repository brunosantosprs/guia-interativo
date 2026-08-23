import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, Package } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import { ADSENSE_SLOTS } from '@/lib/constants';
import { whatsappLink } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { AdSlot } from '@/components/shared/adsense';
import { Icon } from '@/components/shared/icon';
import { FadeIn } from '@/components/shared/motion';
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  serviceSchema,
} from '@/components/shared/json-ld';
import type { ServiceFaq, ServiceStep, SlugParams } from '@/types';

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const services = await prisma.service.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    });
    return services.map((service) => ({ slug: service.slug }));
  } catch {
    return [];
  }
}

/** Sem try/catch: falha de banco no build deve quebrar, nao virar 404. */
async function getService(slug: string) {
  return prisma.service.findFirst({ where: { slug, status: 'PUBLISHED' } });
}

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const service = await getService(params.slug);
  if (!service) return { title: 'Serviço não encontrado' };

  return {
    title: service.metaTitle || service.title,
    description: service.metaDescription || service.shortDescription,
    alternates: { canonical: `/servicos/${service.slug}` },
    openGraph: {
      type: 'article',
      title: service.metaTitle || service.title,
      description: service.metaDescription || service.shortDescription,
      url: `/servicos/${service.slug}`,
      images: service.image ? [{ url: service.image, alt: service.title }] : undefined,
    },
  };
}

export default async function ServicoPage({ params }: SlugParams) {
  const [settings, service] = await Promise.all([getSettings(), getService(params.slug)]);

  if (!service) notFound();

  const steps = (service.steps as unknown as ServiceStep[]) ?? [];
  const faq = (service.faq as unknown as ServiceFaq[]) ?? [];

  const others = await prisma.service
    .findMany({
      where: { status: 'PUBLISHED', slug: { not: service.slug } },
      orderBy: { order: 'asc' },
      take: 3,
      select: { id: true, title: true, slug: true, shortDescription: true, icon: true },
    })
    .catch(() => []);

  const crumbs = [
    { label: 'Serviços', href: '/servicos' },
    { label: service.title, href: `/servicos/${service.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          serviceSchema({
            title: service.title,
            description: service.shortDescription,
            slug: service.slug,
            siteName: settings.siteName,
          }),
          ...(faq.length > 0 ? [faqSchema(faq)] : []),
        ]}
      />

      {/* ============ CABEÇALHO ============ */}
      <section className="border-b border-border bg-hero-fade">
        <div className="container py-10 md:py-14">
          <Breadcrumbs items={crumbs} className="mb-8" />

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <Icon name={service.icon} className="h-9 w-9 text-accent" />
              <h1 className="mt-4 text-balance font-serif text-display-md">{service.title}</h1>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
                {service.shortDescription}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="accent" size="lg">
                  <a
                    href={whatsappLink(
                      settings.whatsapp,
                      `Olá! Gostaria de um orçamento para o serviço "${service.title}".`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Solicitar orçamento
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/contato">Enviar mensagem</Link>
                </Button>
              </div>

              {service.priceNote ? (
                <p className="mt-6 text-sm text-muted-foreground">{service.priceNote}</p>
              ) : null}
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border shadow-elevated">
                <Image
                  src={service.image || '/images/og-default.jpg'}
                  alt={service.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
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
            <article className="prose-editorial">
              <h2 className="!mt-0">Sobre este serviço</h2>
              {service.description.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </article>

            {/* Processo passo a passo */}
            {steps.length > 0 ? (
              <div className="mt-16">
                <h2 className="font-serif text-display-sm">Como funciona, etapa por etapa</h2>

                <ol className="mt-8 space-y-px overflow-hidden rounded-lg border border-border">
                  {steps.map((step, index) => (
                    <FadeIn key={step.title} delay={index * 0.05} as="li">
                      <div className="flex gap-5 bg-background p-6 transition-colors hover:bg-surface md:gap-7 md:p-7">
                        <span
                          className="font-serif text-2xl leading-none text-accent"
                          aria-hidden
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h3 className="font-serif text-lg leading-snug">
                            {step.title.replace(/^\d+\.\s*/, '')}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </ol>
              </div>
            ) : null}

            <AdSlot
              slot={ADSENSE_SLOTS.inArticle}
              clientId={settings.adsenseClientId}
              enabled={settings.adsenseEnabled}
              format="fluid"
              minHeight={260}
              className="my-14"
            />

            {/* FAQ */}
            {faq.length > 0 ? (
              <div>
                <h2 className="font-serif text-display-sm">Perguntas frequentes</h2>
                <Accordion type="single" collapsible className="mt-6">
                  {faq.map((item, index) => (
                    <AccordionItem key={item.question} value={`faq-${index}`}>
                      <AccordionTrigger className="font-serif text-base md:text-lg">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ) : null}
          </div>

          {/* ============ SIDEBAR ============ */}
          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-24">
              {service.benefits.length > 0 ? (
                <div className="rounded-lg border border-border bg-background p-6">
                  <h2 className="font-serif text-lg">Benefícios</h2>
                  <ul className="mt-4 space-y-3">
                    {service.benefits.map((benefit) => (
                      <li key={benefit} className="flex gap-2.5 text-sm leading-relaxed">
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                          aria-hidden
                        />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {service.deliverables.length > 0 ? (
                <div className="rounded-lg border border-border bg-surface p-6">
                  <h2 className="flex items-center gap-2 font-serif text-lg">
                    <Package className="h-4 w-4 text-accent" aria-hidden />
                    O que você recebe
                  </h2>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <AdSlot
                slot={ADSENSE_SLOTS.sidebar}
                clientId={settings.adsenseClientId}
                enabled={settings.adsenseEnabled}
                format="rectangle"
                minHeight={600}
                className="hidden lg:block"
              />
            </div>
          </aside>
        </div>
      </section>

      {/* ============ OUTROS SERVIÇOS ============ */}
      {others.length > 0 ? (
        <section className="border-t border-border bg-surface py-16 md:py-20">
          <div className="container">
            <h2 className="font-serif text-display-sm">Outros serviços</h2>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((item) => (
                <Link
                  key={item.id}
                  href={`/servicos/${item.slug}`}
                  className="card-premium group flex flex-col p-6"
                >
                  <Icon name={item.icon} className="h-7 w-7 text-accent" />
                  <h3 className="mt-5 font-serif text-lg leading-snug transition-colors group-hover:text-accent">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.shortDescription}
                  </p>
                  <span className="mt-5 flex items-center gap-1.5 text-sm font-medium">
                    Ver detalhes
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

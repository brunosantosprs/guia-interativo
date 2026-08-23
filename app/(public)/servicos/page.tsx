import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';

import { whatsappLink } from '@/lib/utils';
import { SectionHeading } from '@/components/shared/section-heading';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { AdSlot } from '@/components/shared/ad-slot';
import { getAdConfig } from '@/lib/ads';
import { JsonLd, breadcrumbSchema } from '@/components/shared/json-ld';
import { Icon } from '@/components/shared/icon';
import { FadeIn } from '@/components/shared/motion';
import { Button } from '@/components/ui/button';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Serviços — consultoria, medição, instalação e automação',
  description:
    'Serviços técnicos para cortinas e persianas: consultoria e projeto, medição com laudo assinado, instalação profissional, automação, manutenção e confecção sob medida.',
  alternates: { canonical: '/servicos' },
};

async function getServices() {
  try {
    return await prisma.service.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
    });
  } catch {
    return [];
  }
}

export default async function ServicosPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);

  const ads = getAdConfig(settings);
  const crumbs = [{ label: 'Serviços', href: '/servicos' }];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <section className="border-b border-border bg-hero-fade">
        <div className="container py-12 md:py-16">
          <Breadcrumbs items={crumbs} className="mb-8" />

          <SectionHeading
            as="h1"
            kicker="Serviços"
            title="Execução técnica, do diagnóstico à entrega"
            description="Cada serviço tem processo definido, entregáveis claros e critérios objetivos. Nada é improvisado no cliente — o que é padronizado sai igual todas as vezes."
          />
        </div>
      </section>

      {/* Lista de serviços — alterna a orientação a cada item */}
      <section className="container py-14 md:py-20">
        <div className="space-y-16 md:space-y-24">
          {services.map((service, index) => {
            const steps = (service.steps as { title: string; description: string }[]) ?? [];
            const reversed = index % 2 === 1;

            return (
              <FadeIn key={service.id}>
                <article className="grid gap-10 lg:grid-cols-12 lg:gap-14">
                  <div className={reversed ? 'lg:order-2 lg:col-span-5' : 'lg:col-span-5'}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border shadow-soft">
                      <Image
                        src={service.image || '/images/og-default.jpg'}
                        alt={service.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover"
                      />
                    </div>

                    {service.priceNote ? (
                      <p className="mt-4 rounded-md border border-border bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
                        {service.priceNote}
                      </p>
                    ) : null}
                  </div>

                  <div className={reversed ? 'lg:order-1 lg:col-span-7' : 'lg:col-span-7'}>
                    <Icon name={service.icon} className="h-8 w-8 text-accent" />

                    <h2 className="mt-4 font-serif text-display-sm">
                      <Link
                        href={`/servicos/${service.slug}`}
                        className="transition-colors hover:text-accent"
                      >
                        {service.title}
                      </Link>
                    </h2>

                    <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                      {service.shortDescription}
                    </p>

                    {steps.length > 0 ? (
                      <ol className="mt-7 space-y-3">
                        {steps.slice(0, 4).map((step, stepIndex) => (
                          <li key={step.title} className="flex gap-3.5 text-sm">
                            <span
                              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent text-[11px] font-medium text-accent"
                              aria-hidden
                            >
                              {stepIndex + 1}
                            </span>
                            <span>
                              <strong className="font-medium">
                                {step.title.replace(/^\d+\.\s*/, '')}
                              </strong>
                              <span className="text-muted-foreground"> — {step.description}</span>
                            </span>
                          </li>
                        ))}
                      </ol>
                    ) : null}

                    {service.benefits.length > 0 ? (
                      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                        {service.benefits.slice(0, 3).map((benefit) => (
                          <li key={benefit} className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-accent" aria-hidden />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Button asChild>
                        <Link href={`/servicos/${service.slug}`}>
                          Ver o processo completo
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <a
                          href={whatsappLink(
                            settings.whatsapp,
                            `Olá! Gostaria de saber mais sobre o serviço "${service.title}".`,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Pedir orçamento
                        </a>
                      </Button>
                    </div>
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>

        <AdSlot
          position="footer"
          ads={ads}
          format="horizontal"
          minHeight={120}
          className="mt-20"
        />
      </section>
    </>
  );
}

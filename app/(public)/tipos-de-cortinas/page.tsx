import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import { CURTAIN_CATEGORIES, LIGHT_BLOCKING_LABELS } from '@/lib/constants';
import { SectionHeading } from '@/components/shared/section-heading';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { AdSlot } from '@/components/shared/ad-slot';
import { getAdConfig } from '@/lib/ads';
import { JsonLd, breadcrumbSchema } from '@/components/shared/json-ld';
import { CurtainFilters } from '@/components/cortinas/curtain-filters';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Tipos de Cortinas e Persianas — catálogo completo com 26 modelos',
  description:
    'Catálogo técnico com 26 tipos de cortinas e persianas: descrição detalhada, vantagens, desvantagens, melhores ambientes, nível de bloqueio de luz e quando escolher cada modelo.',
  alternates: { canonical: '/tipos-de-cortinas' },
  openGraph: {
    title: 'Tipos de Cortinas e Persianas — catálogo completo',
    description:
      '26 modelos analisados em detalhe: bloqueio de luz, ambientes ideais, manutenção e faixa de investimento.',
    url: '/tipos-de-cortinas',
  },
};

async function getCurtains() {
  try {
    return await prisma.curtainType.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
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
        materials: true,
        maintenance: true,
        priceRange: true,
      },
    });
  } catch {
    return [];
  }
}

export default async function TiposDeCortinasPage() {
  const [settings, curtains] = await Promise.all([getSettings(), getCurtains()]);

  const ads = getAdConfig(settings);

  const crumbs = [{ label: 'Tipos de Cortinas', href: '/tipos-de-cortinas' }];

  // Categorias efetivamente presentes, na ordem canônica definida em constants
  const categories = CURTAIN_CATEGORIES.filter((category) =>
    curtains.some((curtain) => curtain.category === category),
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      {/* Cabeçalho */}
      <section className="border-b border-border bg-hero-fade">
        <div className="container py-12 md:py-16">
          <Breadcrumbs items={crumbs} className="mb-8" />

          <SectionHeading
            as="h1"
            kicker="Catálogo técnico"
            title="Todos os tipos de cortinas e persianas, explicados a fundo"
            description="Cada modelo tem uma ficha completa: como funciona, o que bloqueia de fato, onde rende, onde falha, quanto custa manter e o critério objetivo de quando escolher."
          />

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/blog/cortina-ou-persiana-qual-escolher">
                Cortina ou persiana?
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/blog/blackout-screen-ou-double-vision-comparativo">
                Blackout × screen × double vision
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/blog/como-medir-janela-para-cortinas-e-persianas">
                Como medir a janela
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Catálogo filtrável */}
      <section className="container py-14 md:py-16">
        <CurtainFilters curtains={curtains} categories={[...categories]} />
      </section>

      {/* Anúncio */}
      <div className="container pb-4">
        <AdSlot
          position="inFeed"
          ads={ads}
          format="horizontal"
          minHeight={120}
        />
      </div>

      {/* Tabela comparativa */}
      {curtains.length > 0 ? (
        <section className="border-t border-border bg-surface py-16 md:py-20">
          <div className="container">
            <SectionHeading
              kicker="Comparativo"
              title="Tabela de referência rápida"
              description="Os mesmos dados das fichas, lado a lado, para comparar bloqueio de luz, ambientes recomendados e faixa de investimento sem abrir cada página."
            />

            <div className="mt-10 overflow-hidden rounded-lg border border-border bg-background">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[220px]">Tipo</TableHead>
                    <TableHead className="min-w-[150px]">Categoria</TableHead>
                    <TableHead className="min-w-[190px]">Bloqueio de luz</TableHead>
                    <TableHead className="min-w-[240px]">Melhores ambientes</TableHead>
                    <TableHead className="min-w-[220px]">Faixa de investimento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {curtains.map((curtain) => (
                    <TableRow key={curtain.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/tipos-de-cortinas/${curtain.slug}`}
                          className="underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent"
                        >
                          {curtain.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{curtain.category}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {LIGHT_BLOCKING_LABELS[curtain.lightBlocking]}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {curtain.bestRooms.slice(0, 3).join(', ')}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {curtain.priceRange ?? '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Os valores são estimativas de mercado para o Brasil e variam conforme região,
              fornecedor, tecido escolhido e complexidade da instalação. Use-os como ordem de
              grandeza, nunca como orçamento.
            </p>
          </div>
        </section>
      ) : null}
    </>
  );
}

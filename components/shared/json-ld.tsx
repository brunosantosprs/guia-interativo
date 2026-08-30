import { ESPECIALISTA, SITE } from '@/lib/constants';
import type { Crumb } from '@/types';

/**
 * Dados estruturados (schema.org) em JSON-LD.
 *
 * O Google usa esses blocos para entender o tipo de conteúdo de cada página —
 * artigo, produto, FAQ, trilha de navegação — e para exibir resultados
 * enriquecidos. É também um sinal de qualidade na análise do AdSense.
 */

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // O conteúdo é gerado pelo próprio servidor, nunca por entrada do usuário.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organização + site, emitido no layout raiz. */
export function organizationSchema(siteName: string, logoUrl?: string | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: SITE.url,
    logo: `${SITE.url}${logoUrl ?? '/images/logo.svg'}`,
    description: SITE.description,
    areaServed: 'BR',
    knowsAbout: [
      'Cortinas',
      'Persianas',
      'Decoração de interiores',
      'Conforto térmico',
      'Controle de luz natural',
    ],
  };
}

export function websiteSchema(siteName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: SITE.url,
    inLanguage: SITE.language,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE.url}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbSchema(items: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Início',
        item: SITE.url,
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        ...(item.href ? { item: `${SITE.url}${item.href}` } : {}),
      })),
    ],
  };
}

interface ArticleSchemaInput {
  title: string;
  description: string;
  slug: string;
  image?: string | null;
  publishedAt?: Date | string | null;
  updatedAt?: Date | string | null;
  authorName: string;
  siteName: string;
  keywords?: string[];
}

export function articleSchema(input: ArticleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    image: `${SITE.url}${input.image ?? '/images/og-default.jpg'}`,
    datePublished: input.publishedAt ? new Date(input.publishedAt).toISOString() : undefined,
    dateModified: input.updatedAt ? new Date(input.updatedAt).toISOString() : undefined,
    // Pessoa, e não organização: o Google usa a autoria declarada como
    // sinal de experiência real no assunto, e quem assina aqui é um
    // profissional que atua na área — não uma redação anônima.
    author: {
      '@type': 'Person',
      name: input.authorName,
      jobTitle: ESPECIALISTA.titulo,
      url: `${SITE.url}/sobre`,
      knowsAbout: [
        'cortinas',
        'persianas',
        'controle solar',
        'conforto térmico residencial',
        'instalação e medição de cortinas',
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: input.siteName,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/images/logo.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE.url}/blog/${input.slug}` },
    inLanguage: SITE.language,
    keywords: input.keywords?.join(', '),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

interface ServiceSchemaInput {
  title: string;
  description: string;
  slug: string;
  siteName: string;
}

export function serviceSchema(input: ServiceSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.title,
    description: input.description,
    provider: { '@type': 'Organization', name: input.siteName, url: SITE.url },
    areaServed: 'BR',
    url: `${SITE.url}/servicos/${input.slug}`,
  };
}

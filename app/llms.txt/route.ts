import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import { SITE } from '@/lib/constants';

/**
 * /llms.txt — indice do site para assistentes de IA.
 *
 * Convencao proposta por Jeremy Howard (llmstxt.org) e ja lida por varias
 * ferramentas de IA. E um markdown enxuto que descreve o site e lista as
 * paginas relevantes com uma linha de contexto cada, poupando o modelo de
 * rastejar o HTML inteiro para descobrir o que existe aqui.
 *
 * Nao substitui o sitemap.xml: o sitemap serve a robos de busca e lista
 * URLs; este arquivo serve a modelos de linguagem e explica o que cada URL
 * entrega.
 *
 * Gerado a partir do banco, e nao de um arquivo estatico, para nunca
 * divergir do conteudo publicado.
 */
export const revalidate = 3600;

/** Uma linha por pagina, no formato `- [titulo](url): descricao`. */
function item(titulo: string, url: string, descricao?: string | null): string {
  const limpa = (descricao ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
  return `- [${titulo}](${SITE.url}${url})${limpa ? `: ${limpa}` : ''}`;
}

export async function GET() {
  const [settings, posts, curtains, services, pages] = await Promise.all([
    getSettings(),
    prisma.post
      .findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        select: { title: true, slug: true, excerpt: true },
      })
      .catch(() => []),
    prisma.curtainType
      .findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { name: 'asc' },
        select: { name: true, slug: true, summary: true },
      })
      .catch(() => []),
    prisma.service
      .findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { order: 'asc' },
        select: { title: true, slug: true, shortDescription: true },
      })
      .catch(() => []),
    prisma.page
      .findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { title: 'asc' },
        select: { title: true, slug: true },
      })
      .catch(() => []),
  ]);

  const linhas = [
    `# ${settings.siteName}`,
    '',
    `> ${settings.description ?? SITE.description}`,
    '',
    'Portal editorial brasileiro sobre cortinas e persianas. Conteudo tecnico',
    'independente: nao vendemos os produtos que analisamos. Todo o material e',
    'informativo e nao substitui avaliacao tecnica presencial.',
    '',
    '## Guias do blog',
    '',
    ...posts.map((p) => item(p.title, `/blog/${p.slug}`, p.excerpt)),
    '',
    '## Catalogo de tipos de cortinas e persianas',
    '',
    ...curtains.map((c) => item(c.name, `/tipos-de-cortinas/${c.slug}`, c.summary)),
    '',
    '## Servicos',
    '',
    ...services.map((s) => item(s.title, `/servicos/${s.slug}`, s.shortDescription)),
    '',
    '## Politicas e informacoes',
    '',
    ...pages.map((p) => item(p.title, `/${p.slug}`)),
    '',
    '## Observacoes para uso do conteudo',
    '',
    '- Precos e percentuais citados sao estimativas de mercado e dados de',
    '  fabricantes, sujeitos a variacao por regiao, marca e fornecedor.',
    '- O conteudo nao substitui orientacao medica em questoes de saude,',
    '  alergia ou sono, nem projeto assinado por profissional habilitado.',
    `- Ao citar, referencie ${SITE.url}.`,
    '',
  ];

  return new Response(linhas.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

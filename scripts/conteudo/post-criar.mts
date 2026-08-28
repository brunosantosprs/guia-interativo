import { readFileSync } from 'node:fs';
import { prisma } from '../../lib/prisma';

/**
 * Cria um post novo a partir de um arquivo JSON com a ficha e um .md com o corpo.
 *
 * uso: npm run post:criar -- <ficha.json> [--aplicar]
 *
 * Formato da ficha:
 *   {
 *     "slug": "cortinas-para-sala-de-estar",
 *     "title": "...",
 *     "excerpt": "...",
 *     "metaTitle": "...",           // ate 70 caracteres
 *     "metaDescription": "...",     // ate 170 caracteres
 *     "keywords": ["...", "..."],
 *     "categoria": "ambientes",     // slug da categoria
 *     "tags": ["ambientes", "..."], // cria as que nao existirem
 *     "coverImage": "/images/blog/....jpg",
 *     "coverImageAlt": "...",
 *     "corpo": "caminho/para/corpo.md"
 *   }
 *
 * Sem --aplicar roda em simulacao: valida tudo e mostra o resumo, sem gravar.
 * Recusa criar se o slug ja existir — para editar, use post:enriquecer.
 */
interface Ficha {
  slug: string;
  title: string;
  excerpt: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  categoria: string;
  tags?: string[];
  coverImage?: string;
  coverImageAlt?: string;
  corpo: string;
}

/** Slug sem acento, no mesmo padrao usado pelo restante do projeto. */
function slugify(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const [arquivo, ...flags] = process.argv.slice(2);
  if (!arquivo) throw new Error('uso: npm run post:criar -- <ficha.json> [--aplicar]');

  const f = JSON.parse(readFileSync(arquivo, 'utf8')) as Ficha;
  const corpo = readFileSync(f.corpo, 'utf8').trim();

  const existente = await prisma.post.findUnique({ where: { slug: f.slug } });
  if (existente) throw new Error(`ja existe post com o slug "${f.slug}" — use post:enriquecer`);

  const categoria = await prisma.category.findUnique({ where: { slug: f.categoria } });
  if (!categoria) throw new Error(`categoria nao encontrada: ${f.categoria}`);

  // Autor padrao do site; o mesmo usado nos posts existentes.
  const autor = await prisma.user.findFirst({ where: { name: 'Redação Guia Interativo' } });
  if (!autor) throw new Error('autor "Redação Guia Interativo" nao encontrado');

  const palavras = corpo.trim().split(/\s+/).length;
  const secoes = (corpo.match(/^## /gm) ?? []).length;
  const tabelas = (corpo.match(/^\|[\s:|-]+\|$/gm) ?? []).length;
  const links = (corpo.match(/\]\(\//g) ?? []).length;
  const temFaq = /^## Perguntas frequentes/im.test(corpo);

  console.log(`${f.title}`);
  console.log(`  slug:      /blog/${f.slug}`);
  console.log(`  categoria: ${categoria.name}`);
  console.log(`  corpo:     ${palavras} palavras | ${secoes} secoes | ${tabelas} tabelas | ${links} links | FAQ ${temFaq ? 'sim' : 'NAO'}`);
  console.log(`  metaTitle: ${(f.metaTitle ?? '').length}/70`);
  console.log(`  metaDesc:  ${(f.metaDescription ?? '').length}/170`);

  const avisos: string[] = [];
  if (palavras < 2000) avisos.push(`corpo com ${palavras} palavras, abaixo de 2000`);
  if (!temFaq) avisos.push('sem secao "## Perguntas frequentes" — o FAQPage nao sera gerado');
  if ((f.metaTitle ?? '').length > 70) avisos.push('metaTitle acima de 70 caracteres');
  if ((f.metaDescription ?? '').length > 170) avisos.push('metaDescription acima de 170 caracteres');
  if (avisos.length) console.log('\n  ATENCAO:\n' + avisos.map((a) => `    - ${a}`).join('\n'));

  if (!flags.includes('--aplicar')) {
    console.log('\nSIMULACAO — nada gravado. Rode de novo com --aplicar.');
    return;
  }

  await prisma.post.create({
    data: {
      slug: f.slug,
      title: f.title,
      excerpt: f.excerpt,
      content: corpo,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      readingMinutes: Math.max(1, Math.round(palavras / 200)),
      metaTitle: f.metaTitle,
      metaDescription: f.metaDescription,
      keywords: f.keywords ?? [],
      coverImage: f.coverImage,
      coverImageAlt: f.coverImageAlt,
      authorId: autor.id,
      categoryId: categoria.id,
      /**
       * Casa pela coluna `name`, nao pelo slug.
       *
       * As duas sao unicas no banco, mas o slug de uma tag existente pode ter
       * sido gerado com regra diferente da nossa — "decoração" ja esta salva
       * com slug "decoracao", sem acento. Procurar por slug nao acha, o
       * connectOrCreate tenta criar, e o banco recusa pelo nome duplicado.
       */
      tags: {
        connectOrCreate: (f.tags ?? []).map((nome) => ({
          where: { name: nome },
          create: { name: nome, slug: slugify(nome) },
        })),
      },
    },
  });

  console.log(`\nOK: publicado em /blog/${f.slug}`);
}

main()
  .catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

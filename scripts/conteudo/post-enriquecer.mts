import { readFileSync } from 'node:fs';
import { prisma } from '../../lib/prisma';

/**
 * uso: npm run post:enriquecer -- <slug> <midFile|-> <faqFile|-> [marker]
 * - midFile: secoes inseridas ANTES do marker (ou '-' para pular)
 * - faqFile: secoes anexadas ao FIM (ou '-' para pular)
 * - marker : titulo exato antes do qual o mid entra (obrigatorio se midFile != '-')
 * So mexe em content e readingMinutes do post com esse slug.
 */
async function main() {
  const [slug, midArg, faqArg, marker] = process.argv.slice(2);
  if (!slug) throw new Error('informe o slug');

  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) throw new Error(`post nao encontrado: ${slug}`);

  const antes = post.content.length;
  let content = post.content;

  if (midArg && midArg !== '-') {
    const mid = readFileSync(midArg, 'utf8').trim();
    if (!marker) throw new Error('marker obrigatorio quando ha midFile');
    const ocorrencias = content.split(marker).length - 1;
    if (ocorrencias !== 1) {
      throw new Error(`marker deve aparecer exatamente 1x (achei ${ocorrencias}): ${marker}`);
    }
    content = content.replace(marker, `${mid}\n\n${marker}`);
  }

  if (faqArg && faqArg !== '-') {
    const faq = readFileSync(faqArg, 'utf8').trim();
    content = `${content.trimEnd()}\n\n${faq}\n`;
  }

  const palavras = content.trim().split(/\s+/).length;
  const readingMinutes = Math.max(1, Math.round(palavras / 200));

  await prisma.post.update({
    where: { slug },
    data: { content, readingMinutes },
  });

  console.log(`OK: ${slug}`);
  console.log(`  caracteres: ${antes} -> ${content.length}  (+${content.length - antes})`);
  console.log(`  palavras:   ${palavras}   | leituraMin: ${post.readingMinutes} -> ${readingMinutes}`);
}

main()
  .catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

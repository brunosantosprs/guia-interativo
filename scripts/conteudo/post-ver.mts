import { prisma } from '../../lib/prisma';

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.log('uso: npm run post:ver -- <slug>');
    return;
  }
  const p = await prisma.post.findUnique({ where: { slug } });
  if (!p) {
    console.log(`Post nao encontrado: ${slug}`);
    return;
  }
  console.log(`TITULO: ${p.title}`);
  console.log(`EXCERPT: ${p.excerpt}`);
  console.log(`META-DESC: ${p.metaDescription ?? '—'}`);
  console.log(`CONTENT (${p.content.length} chars):`);
  console.log('==================================================');
  console.log(p.content);
  console.log('==================================================');
}

main().finally(() => prisma.$disconnect());

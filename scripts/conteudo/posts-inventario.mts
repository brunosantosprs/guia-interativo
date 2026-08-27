import { prisma } from '../../lib/prisma';

async function main() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'asc' } });
  console.log('WORD COUNTS (meta: >= 2000 palavras)\n');
  let faltam = 0;
  for (const [i, p] of posts.entries()) {
    const palavras = p.content.trim().split(/\s+/).length;
    const ok = palavras >= 2000;
    if (!ok) faltam++;
    console.log(
      `#${String(i + 1).padStart(2)} ${ok ? 'OK ' : '<< '} ${String(palavras).padStart(5)} palavras  ${p.slug}`,
    );
  }
  console.log(`\n${faltam} de ${posts.length} ainda abaixo de 2000 palavras.`);
}

main().finally(() => prisma.$disconnect());

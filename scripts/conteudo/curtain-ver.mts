import { prisma } from '../../lib/prisma';

/**
 * Mostra a ficha estruturada de um ou mais tipos de cortina.
 *
 * uso: npm run curtain:ver -- <slug> [<slug> ...]
 *
 * Serve para escrever o guia longo sem repetir o que a ficha ja diz — a
 * regra do projeto e que o guia preencha lacuna, nunca reescreva a ficha.
 */
const w = (s?: string | null) => (s && s.trim() ? s.trim().split(/\s+/).length : 0);

async function main() {
  const slugs = process.argv.slice(2);
  if (!slugs.length) throw new Error('uso: npm run curtain:ver -- <slug> [<slug> ...]');

  for (const slug of slugs) {
    const c = await prisma.curtainType.findUnique({ where: { slug } });
    if (!c) {
      console.log(`\n?? nao encontrado: ${slug}`);
      continue;
    }

    const ficha =
      w(c.summary) + w(c.description) + w(c.whenToChoose) + w(c.installation) + w(c.maintenance);

    console.log(`\n${'='.repeat(78)}`);
    console.log(`${c.name}  (${slug})`);
    console.log(`${c.category} | luz ${c.lightBlocking} | ${c.priceRange ?? 'sem faixa'}`);
    console.log(`ficha: ${ficha} palavras | guia atual: ${w(c.content)} palavras`);
    console.log('='.repeat(78));
    console.log(`\nRESUMO\n${c.summary}`);
    console.log(`\nDESCRICAO\n${c.description}`);
    console.log(`\nQUANDO ESCOLHER\n${c.whenToChoose}`);
    if (c.installation) console.log(`\nINSTALACAO\n${c.installation}`);
    if (c.maintenance) console.log(`\nMANUTENCAO\n${c.maintenance}`);
    console.log(`\nMATERIAIS: ${c.materials.join(' | ')}`);
    console.log(`VANTAGENS: ${c.advantages.join(' | ')}`);
    console.log(`DESVANTAGENS: ${c.disadvantages.join(' | ')}`);
    console.log(`AMBIENTES: ${c.bestRooms.join(' | ')}`);
  }
}

main()
  .catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

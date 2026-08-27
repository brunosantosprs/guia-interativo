import { prisma } from '../../lib/prisma';

/**
 * Progresso dos guias longos dos tipos de cortina.
 * uso: npm run curtains:auditoria
 */
const w = (s?: string | null) => (s && s.trim() ? s.trim().split(/\s+/).length : 0);

async function main() {
  const tipos = await prisma.curtainType.findMany({ orderBy: { slug: 'asc' } });
  let prontos = 0;
  const pendentes: string[] = [];

  console.log('  ficha  guia  TOTAL  sec tab FAQ   slug');
  console.log('  ' + '-'.repeat(72));
  for (const t of tipos) {
    const ficha =
      w(t.summary) + w(t.description) + w(t.whenToChoose) + w(t.installation) + w(t.maintenance) +
      [...t.materials, ...t.advantages, ...t.disadvantages, ...t.bestRooms].reduce((n, x) => n + w(x), 0);
    const guia = w(t.content);
    const total = ficha + guia;
    const sec = (t.content?.match(/^## /gm) ?? []).length;
    const tab = (t.content?.match(/^\|[\s:|-]+\|$/gm) ?? []).length;
    const faq = /## Perguntas frequentes/i.test(t.content ?? '');
    if (total >= 2000) prontos++; else pendentes.push(t.slug);
    console.log(
      `  ${String(ficha).padStart(5)}  ${String(guia).padStart(4)}  ${String(total).padStart(5)}  ` +
      `${String(sec).padStart(3)} ${String(tab).padStart(3)} ${faq ? 'sim' : ' - '}  ` +
      `${total >= 2000 ? 'OK ' : '<< '} ${t.slug}`,
    );
  }
  console.log(`\n  ${prontos}/${tipos.length} acima de 2000 palavras`);
  if (pendentes.length) console.log(`  faltam: ${pendentes.length}`);
}
main().catch((e) => console.error(e.message)).finally(() => prisma.$disconnect());

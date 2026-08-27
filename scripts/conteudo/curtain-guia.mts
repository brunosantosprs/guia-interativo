import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { prisma } from '../../lib/prisma';

/**
 * Grava o guia longo (markdown) de um tipo de cortina.
 *
 * uso: npm run curtain:guia -- <slug> <arquivo.md> [--aplicar]
 *      npm run curtain:guia -- <slug>                  (so mostra o estado)
 *
 * Sem --aplicar roda em simulacao. Com --aplicar, salva uma copia do
 * conteudo anterior em .backups-conteudo/ antes de gravar — a pasta e
 * ignorada pelo git e e a unica forma de desfazer, porque o conteudo mora
 * no banco de producao.
 */
const w = (s?: string | null) => (s && s.trim() ? s.trim().split(/\s+/).length : 0);

async function main() {
  const [slug, arquivo, ...flags] = process.argv.slice(2);
  if (!slug) throw new Error('uso: npm run curtain:guia -- <slug> <arquivo.md> [--aplicar]');

  const c = await prisma.curtainType.findUnique({ where: { slug } });
  if (!c) throw new Error(`tipo de cortina nao encontrado: ${slug}`);

  const fichaAtual =
    w(c.summary) +
    w(c.description) +
    w(c.whenToChoose) +
    w(c.installation) +
    w(c.maintenance) +
    [...c.materials, ...c.advantages, ...c.disadvantages, ...c.bestRooms].reduce(
      (n, x) => n + w(x),
      0,
    );

  if (!arquivo) {
    console.log(`${c.name}  (${slug})`);
    console.log(`  ficha estruturada: ${fichaAtual} palavras`);
    console.log(`  guia longo:        ${w(c.content)} palavras`);
    return;
  }

  const novo = readFileSync(arquivo, 'utf8').trim();
  const secoes = (novo.match(/^## /gm) ?? []).length;
  const tabelas = (novo.match(/^\|[\s:|-]+\|$/gm) ?? []).length;
  const links = (novo.match(/\]\(\//g) ?? []).length;
  const total = fichaAtual + w(novo);

  console.log(`${c.name}  (${slug})`);
  console.log(`  ficha estruturada: ${fichaAtual} palavras`);
  console.log(`  guia novo:         ${w(novo)} palavras | ${secoes} secoes | ${tabelas} tabelas | ${links} links`);
  console.log(`  TOTAL DA PAGINA:   ${total} palavras ${total >= 2000 ? '(meta atingida)' : '<< abaixo de 2000'}`);

  if (!flags.includes('--aplicar')) {
    console.log('\nSIMULACAO — nada gravado. Rode de novo com --aplicar.');
    return;
  }

  mkdirSync('.backups-conteudo', { recursive: true });
  const carimbo = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  writeFileSync(
    `.backups-conteudo/curtain-${slug}.${carimbo}.bak.md`,
    c.content ?? '(sem guia anterior)',
    'utf8',
  );

  await prisma.curtainType.update({ where: { slug }, data: { content: novo } });
  console.log(`\nOK: guia gravado em /tipos-de-cortinas/${slug}`);
}

main()
  .catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

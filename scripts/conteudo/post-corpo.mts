import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { prisma } from '../../lib/prisma';

/**
 * Grava o corpo de um post a partir de um arquivo markdown.
 *
 * uso: npm run post:corpo -- <slug> <arquivo.md> [--aplicar]
 *      npm run post:corpo -- <slug>                (so mostra o estado)
 *
 * Existia `post:substituir` para troca cirurgica de trechos e
 * `curtain:guia` para gravar o corpo inteiro de uma ficha, mas nao havia o
 * equivalente do segundo para posts. Na reescrita editorial o texto muda
 * por inteiro, e aplicar isso como dezenas de pares de busca-e-troca seria
 * fragil e lento.
 *
 * Sem --aplicar roda em simulacao. Com --aplicar, salva o conteudo anterior
 * em .backups-conteudo/ antes de gravar — a pasta e ignorada pelo git e e a
 * unica forma de desfazer, porque o conteudo mora no banco de producao.
 */

const PASTA_BACKUP = '.backups-conteudo';

const contar = (s?: string | null) => (s && s.trim() ? s.trim().split(/\s+/).length : 0);

/** Metricas que o padrao editorial cobra, para conferir antes de gravar. */
function medir(md: string) {
  const linhas = md.split('\n');
  return {
    palavras: contar(md),
    secoes: linhas.filter((l) => /^##\s/.test(l)).length,
    tabelas: linhas.filter((l) => /^\|/.test(l) && /\|.*\|/.test(l)).length > 0
      ? linhas.filter((l) => /^\|\s*-+/.test(l) || /^\|[-\s|]+\|$/.test(l)).length
      : 0,
    links: (md.match(/\]\(\//g) ?? []).length,
    faq: (md.match(/^\*\*[^*]+\?\*\*$/gm) ?? []).length,
  };
}

async function main() {
  const [slug, arquivo, ...flags] = process.argv.slice(2);
  if (!slug) throw new Error('uso: npm run post:corpo -- <slug> <arquivo.md> [--aplicar]');

  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) throw new Error(`post nao encontrado: ${slug}`);

  console.log(`\n${post.title}  (${slug})`);
  console.log(`  status: ${post.status}`);
  console.log(`  corpo atual: ${contar(post.content)} palavras`);

  if (!arquivo) return;

  const novo = readFileSync(arquivo, 'utf8').trim();
  const m = medir(novo);

  console.log(
    `  corpo novo:  ${m.palavras} palavras | ${m.secoes} secoes | ${m.tabelas} tabelas | ${m.links} links | ${m.faq} perguntas`,
  );

  if (m.palavras < 2000) {
    console.log(`\n  ATENCAO: abaixo de 2000 palavras, o minimo do padrao editorial.`);
  }

  if (!flags.includes('--aplicar')) {
    console.log('\nSIMULACAO — nada gravado. Rode de novo com --aplicar.');
    return;
  }

  if (!existsSync(PASTA_BACKUP)) mkdirSync(PASTA_BACKUP, { recursive: true });
  const carimbo = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const destino = join(PASTA_BACKUP, `post-${slug}.${carimbo}.bak.md`);
  writeFileSync(destino, post.content ?? '', 'utf8');
  console.log(`\n  backup: ${destino}`);

  await prisma.post.update({ where: { slug }, data: { content: novo } });
  console.log(`OK: corpo gravado em /blog/${slug}`);
}

main()
  .catch((erro) => {
    console.error(erro instanceof Error ? erro.message : erro);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

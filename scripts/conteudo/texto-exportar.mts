import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { prisma } from '../../lib/prisma';

/**
 * Extrai para arquivo o markdown de um post ou de uma ficha.
 *
 * uso: npm run texto:exportar -- <slug> [<slug> ...] [--saida <pasta>]
 *
 * O conteudo mora no banco, e revisar texto longo exige ter o arquivo em
 * maos: para ler inteiro, comparar versoes e rodar o auditor no que ainda
 * nao foi gravado. Sem isso a unica leitura possivel e pelo painel, uma
 * tela por vez.
 *
 * Procura primeiro em posts; nao achando, procura nas fichas. O nome do
 * arquivo recebe o prefixo do tipo, para nao misturar os dois na pasta.
 */

const PASTA_PADRAO = '.conteudo-trabalho';

async function main() {
  const args = process.argv.slice(2);
  const iSaida = args.indexOf('--saida');
  const pasta = iSaida >= 0 ? args[iSaida + 1] : PASTA_PADRAO;
  // iValor fica em -1 quando nao ha --saida. Usar iSaida + 1 direto
  // descartaria o argumento de indice 0, ou seja, o primeiro slug.
  const iValor = iSaida >= 0 ? iSaida + 1 : -1;
  const slugs = args.filter((a, i) => !a.startsWith('--') && i !== iValor);

  if (!slugs.length) {
    throw new Error('uso: npm run texto:exportar -- <slug> [<slug> ...] [--saida <pasta>]');
  }

  for (const slug of slugs) {
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { slug: true, title: true, content: true },
    });

    const ficha = post
      ? null
      : await prisma.curtainType.findUnique({
          where: { slug },
          select: { slug: true, name: true, content: true },
        });

    if (!post && !ficha) {
      console.log(`  ?? nao encontrado em posts nem em fichas: ${slug}`);
      continue;
    }

    const tipo = post ? 'post' : 'ficha';
    const conteudo = (post?.content ?? ficha?.content ?? '').trim();
    const titulo = post?.title ?? ficha?.name ?? slug;

    const destino = join(pasta, `${tipo}--${slug}.md`);
    mkdirSync(dirname(destino), { recursive: true });
    writeFileSync(destino, `${conteudo}\n`, 'utf8');

    const palavras = conteudo ? conteudo.split(/\s+/).length : 0;
    console.log(`  ${destino}  (${palavras} palavras)  ${titulo}`);
  }
}

main()
  .catch((erro) => {
    console.error(erro instanceof Error ? erro.message : erro);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

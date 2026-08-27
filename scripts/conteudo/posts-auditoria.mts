import { prisma } from '../../lib/prisma';

/**
 * Auditoria de qualidade dos posts.
 *
 * Vai alem da contagem de palavras: mede se o texto e realmente
 * segmentado (secoes curtas, subtitulos frequentes) e se traz
 * elementos praticos (tabelas, passo a passo, listas, FAQ).
 *
 * uso: npm run posts:auditoria
 */

interface Auditoria {
  slug: string;
  palavras: number;
  secoes: number;
  subsecoes: number;
  palavrasPorSecao: number;
  maiorBloco: number;
  tabelas: number;
  passos: number;
  itensLista: number;
  negritos: number;
  temFaq: boolean;
}

function auditar(slug: string, content: string): Auditoria {
  const linhas = content.split('\n');
  const palavras = content.trim().split(/\s+/).length;

  const secoes = linhas.filter((l) => /^##\s/.test(l)).length;
  const subsecoes = linhas.filter((l) => /^###\s/.test(l)).length;

  /**
   * Maior trecho continuo sem nenhuma quebra visual — mede "paredao de texto".
   *
   * Quebram o bloco: subtitulos (## / ###), itens de lista, passos numerados,
   * linhas de tabela e paragrafos que ABREM em negrito (o padrao das perguntas
   * do FAQ). Sem isso a secao de perguntas frequentes era contada como um
   * unico bloco gigante, o que dava um numero falso.
   */
  const quebra = (l: string) =>
    /^#{2,3}\s/.test(l) || // subtitulo
    /^[-*]\s/.test(l) || // lista
    /^\d+\.\s/.test(l) || // passo numerado
    /^\|/.test(l) || // tabela
    /^\*\*/.test(l); // paragrafo que abre em negrito (pergunta do FAQ)

  let maiorBloco = 0;
  let blocoAtual = 0;
  for (const bruta of linhas) {
    const l = bruta.trim();
    if (quebra(l)) {
      maiorBloco = Math.max(maiorBloco, blocoAtual);
      blocoAtual = l.split(/\s+/).length;
    } else if (l) {
      blocoAtual += l.split(/\s+/).length;
    }
  }
  maiorBloco = Math.max(maiorBloco, blocoAtual);

  // Tabelas: conta cabecalhos de tabela markdown (linha de separacao |---|).
  const tabelas = linhas.filter((l) => /^\|[\s:|-]+\|$/.test(l.trim())).length;
  const passos = linhas.filter((l) => /^\d+\.\s/.test(l.trim())).length;
  const itensLista = linhas.filter((l) => /^[-*]\s/.test(l.trim())).length;
  const negritos = (content.match(/\*\*[^*]+\*\*/g) ?? []).length;
  const temFaq = /##\s*Perguntas frequentes/i.test(content);

  return {
    slug,
    palavras,
    secoes,
    subsecoes,
    palavrasPorSecao: secoes ? Math.round(palavras / secoes) : palavras,
    maiorBloco,
    tabelas,
    passos,
    itensLista,
    negritos,
    temFaq,
  };
}

/** Nota simples de 0 a 100, so para ordenar o que precisa de atencao. */
function nota(a: Auditoria): number {
  let n = 0;
  n += Math.min(30, (a.palavras / 2000) * 30); // volume
  n += Math.min(20, (a.secoes / 12) * 20); // segmentacao
  n += a.maiorBloco <= 120 ? 15 : a.maiorBloco <= 200 ? 8 : 0; // sem paredao
  n += Math.min(10, a.tabelas * 5); // tabela comparativa
  n += Math.min(10, (a.passos / 8) * 10); // passo a passo
  n += Math.min(10, (a.itensLista / 20) * 10); // listas
  n += a.temFaq ? 5 : 0; // FAQ
  return Math.round(n);
}

function barra(n: number): string {
  const cheio = Math.round(n / 10);
  return '#'.repeat(cheio).padEnd(10, '.');
}

async function main() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'asc' } });
  const linhas = posts.map((p) => auditar(p.slug, p.content));

  console.log('AUDITORIA DE QUALIDADE DOS POSTS\n');
  console.log(
    'nota  '.padEnd(18) +
      'palav  secoes  p/sec  maiorBloco  tab  passos  lista  FAQ   slug',
  );
  console.log('-'.repeat(110));

  const ordenadas = [...linhas].sort((a, b) => nota(a) - nota(b));
  for (const a of ordenadas) {
    const n = nota(a);
    console.log(
      `${barra(n)} ${String(n).padStart(3)}  ` +
        `${String(a.palavras).padStart(5)}  ` +
        `${String(a.secoes).padStart(6)}  ` +
        `${String(a.palavrasPorSecao).padStart(5)}  ` +
        `${String(a.maiorBloco).padStart(10)}  ` +
        `${String(a.tabelas).padStart(3)}  ` +
        `${String(a.passos).padStart(6)}  ` +
        `${String(a.itensLista).padStart(5)}  ` +
        `${a.temFaq ? 'sim' : '-  '}   ` +
        a.slug,
    );
  }

  const abaixo2000 = linhas.filter((a) => a.palavras < 2000).length;
  const semFaq = linhas.filter((a) => !a.temFaq).length;
  const semTabela = linhas.filter((a) => a.tabelas === 0).length;
  const semPasso = linhas.filter((a) => a.passos === 0).length;
  const comParedao = linhas.filter((a) => a.maiorBloco > 200).length;

  console.log('\nRESUMO');
  console.log(`  ${abaixo2000}/${linhas.length} abaixo de 2000 palavras`);
  console.log(`  ${semFaq}/${linhas.length} sem secao de perguntas frequentes`);
  console.log(`  ${semTabela}/${linhas.length} sem nenhuma tabela`);
  console.log(`  ${semPasso}/${linhas.length} sem nenhum passo a passo numerado`);
  console.log(`  ${comParedao}/${linhas.length} com bloco de texto acima de 200 palavras sem subtitulo`);
}

main()
  .catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

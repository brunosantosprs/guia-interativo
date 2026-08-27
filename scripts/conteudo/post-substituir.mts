import { readFileSync } from 'node:fs';
import { prisma } from '../../lib/prisma';

/**
 * Substituicao de texto em um post, com trava de seguranca.
 *
 * uso: npm run post:substituir -- <slug> <arquivo.json> [--aplicar]
 *
 * O arquivo JSON e uma lista de pares:
 *   [{ "de": "texto atual", "para": "texto novo", "vezes": 1 }]
 *
 * `vezes` e obrigatorio e precisa bater exatamente com o numero de
 * ocorrencias encontradas — se divergir, nada e gravado. Isso evita
 * substituir em lugar errado quando o trecho aparece mais de uma vez.
 *
 * Sem --aplicar, roda em modo simulacao e apenas mostra o que mudaria.
 */
interface Troca {
  de: string;
  para: string;
  vezes: number;
}

function contar(texto: string, agulha: string): number {
  return texto.split(agulha).length - 1;
}

/** Mostra o trecho ao redor da ocorrencia, para conferencia visual. */
function contexto(texto: string, agulha: string, margem = 60): string {
  const i = texto.indexOf(agulha);
  if (i === -1) return '';
  const ini = Math.max(0, i - margem);
  const fim = Math.min(texto.length, i + agulha.length + margem);
  return `...${texto.slice(ini, fim).replace(/\n/g, ' ')}...`;
}

async function main() {
  const [slug, arquivo, ...flags] = process.argv.slice(2);
  if (!slug || !arquivo) throw new Error('uso: npm run post:substituir -- <slug> <arquivo.json> [--aplicar]');

  const aplicar = flags.includes('--aplicar');
  const trocas = JSON.parse(readFileSync(arquivo, 'utf8')) as Troca[];

  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) throw new Error(`post nao encontrado: ${slug}`);

  let content = post.content;
  const antes = content.length;

  for (const [i, t] of trocas.entries()) {
    const achadas = contar(content, t.de);
    if (achadas !== t.vezes) {
      throw new Error(
        `troca #${i + 1}: esperava ${t.vezes} ocorrencia(s), encontrei ${achadas}\n  trecho: "${t.de.slice(0, 80)}"`,
      );
    }
    console.log(`troca #${i + 1}  (${achadas}x)`);
    console.log(`  antes: ${contexto(content, t.de)}`);
    content = content.split(t.de).join(t.para);
    console.log(`  depois: ${contexto(content, t.para)}\n`);
  }

  const palavras = content.trim().split(/\s+/).length;

  if (!aplicar) {
    console.log(`SIMULACAO — nada foi gravado. Rode de novo com --aplicar.`);
    console.log(`  caracteres: ${antes} -> ${content.length}`);
    return;
  }

  await prisma.post.update({
    where: { slug },
    data: { content, readingMinutes: Math.max(1, Math.round(palavras / 200)) },
  });
  console.log(`OK: ${slug}`);
  console.log(`  caracteres: ${antes} -> ${content.length}  (${content.length - antes >= 0 ? '+' : ''}${content.length - antes})`);
}

main()
  .catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

import { readFileSync } from 'node:fs';
import { prisma } from '../../lib/prisma';

/**
 * Audita um texto contra os padroes que denunciam escrita de maquina.
 *
 * uso: npm run texto:auditar -- <arquivo.md>       antes de publicar
 *      npm run texto:auditar -- --slug <slug>      um post ja no banco
 *      npm run texto:auditar -- --tudo             o acervo inteiro
 *
 * Por que existe: numa auditoria de 78 textos deste blog, os problemas que
 * mais denunciavam texto gerado nao eram os cliches obvios — eram numeros.
 * Travessao usado 21 vezes por artigo, a formula "nao e X, e Y" repetida em
 * 52 lugares, e a mesma frase-gancho ("A consequencia pratica:") abrindo
 * paragrafo em 14 artigos diferentes. Nada disso aparece relendo um artigo
 * sozinho; so aparece contando.
 *
 * Os limites abaixo saem dessa auditoria, nao de teoria.
 */

interface Regra {
  nome: string;
  /** Quantas ocorrencias sao aceitaveis por artigo. */
  limite: number;
  re: RegExp;
  porque: string;
  /**
   * Conta so em texto corrido, ignorando tabela, lista e titulo.
   *
   * Faz diferenca grande no travessao: em tabela ele separa coluna e em
   * lista abre a explicacao do item — usos normais, que nada tem a ver com
   * a pausa dramatica do meio do paragrafo. Contando tudo junto, a media
   * dava 9,6 por artigo; so no texto corrido, 2,7.
   */
  soCorrido?: boolean;
}

const REGRAS: Regra[] = [
  {
    nome: 'travessao em texto corrido',
    limite: 6,
    re: /—/g,
    soCorrido: true,
    porque:
      'a pausa dramatica e a assinatura mais reconhecivel de texto gerado. ' +
      'Troque por virgula, ponto ou dois-pontos; guarde o travessao para aposto de verdade',
  },
  {
    nome: 'formula "nao e X, e Y"',
    limite: 1,
    re: /[Nn]ão (é|são|foi)[^.!?\n]{5,70}?\s*(?::|—|,)\s*(é|são|mas|e sim)\s+/g,
    porque:
      'corrigir uma crenca com essa construcao funciona uma vez por texto. ' +
      'Repetida, vira molde. Diga direto: "Quem isola e o ar preso no tecido"',
  },
  {
    nome: 'conectivo formal',
    limite: 2,
    re: /\b(Além disso|Ademais|Outrossim|Nesse sentido|Nesse contexto|Diante disso|Dessa forma|Dessa maneira|Desse modo|Vale ressaltar|Cabe destacar|Em suma|Em síntese|Sobretudo|Consequentemente|Por conseguinte)\b/gi,
    porque: 'na fala ninguem usa. Ponto final e uma frase nova resolvem melhor',
  },
  {
    nome: 'abertura cliche',
    limite: 0,
    re: /No mundo (atual|moderno|de hoje)|cenário cada vez mais|Nos dias de hoje|É inegável|Não é segredo|Vivemos (em uma|numa) era|Com o avanço d|Você já parou para pensar|Imagine só/gi,
    porque: 'abra com uma situacao concreta que o leitor reconheca da propria casa',
  },
  {
    nome: 'adjetivo vazio',
    limite: 0,
    re: /excelência|expertise|know-how|qualidade (excepcional|incomparável)|resultados (surpreendentes|expressivos)|soluções personalizadas|altamente qualificad|atendimento (diferenciado|humanizado)|trajetória (sólida|consolidada)/gi,
    porque: 'nao dizem nada verificavel. Troque por um numero ou um exemplo',
  },
  {
    nome: 'venda generica',
    limite: 0,
    re: /chegou ao lugar certo|não deixe (essa|a) oportunidade|[Ee]ntre em contato hoje|anos de experiência no mercado|comprometid[oa] em oferecer|conte com quem entende|[Tt]ransforme (sua|seu)|a escolha certa para/gi,
    porque: 'o convite ao servico ja aparece sozinho no rodape do artigo',
  },
  {
    nome: 'fechamento padronizado',
    limite: 0,
    re: /Portanto, não espere|Em resumo,|Para concluir|[Pp]ronto para dar o próximo passo|O momento é agora|portas estão abertas/g,
    porque: 'termine com o ultimo conselho util, sem despedida',
  },
  {
    nome: 'metafora motivacional',
    limite: 0,
    re: /[Aa] jornada d[eo]|[Dd]esbloque(ar|ia)|todo o potencial|novo patamar|revolucionar|reinventar/g,
    porque: 'o assunto e cortina, nao superacao',
  },
  {
    nome: 'palavra carimbo',
    limite: 0,
    re: /\brobust[oa]s?\b|\babrangente\b|\bnorteador|\bnorteia\b|\bpanorama\b|\bvertente\b|\bfomentar\b|\bengajamento\b|\bpeça-chave\b|\bpapel fundamental\b/gi,
    porque: 'troque por "reforcado", "firme", "completo" — palavras que descrevem',
  },
  {
    nome: 'voz passiva',
    limite: 1,
    re: /\b(é|são|foi|foram) (oferecid|proporcionad|disponibilizad)[oa]s?\b/gi,
    porque: 'quem faz a acao some. Escreva quem faz o que',
  },
  {
    nome: 'emoji decorativo',
    limite: 0,
    re: /[✅\u{1F680}\u{1F4A1}\u{1F525}✨\u{1F44D}\u{1F3AF}]/gu,
    porque: 'o site nao usa emoji em texto editorial',
  },
  {
    nome: 'espaco antes de pontuacao',
    limite: 0,
    re: / [,.;:]/g,
    porque: 'erro de digitacao — corrija antes de publicar',
  },
];

/** Ganchos em negrito repetidos denunciam molde entre artigos. */
const GANCHOS =
  /\*\*(A consequência prática|A conclusão prática|A regra prática|A regra que resolve|A pergunta que resolve|A pergunta que orienta|A leitura prática|A escolha resumida|O detalhe que passa batido):?\*\*:?/g;

/**
 * Linha abrindo com rotulo em negrito: "**Termica.** O texto segue...".
 *
 * Um ou outro rotulo ajuda a escanear. O problema e a densidade: num
 * levantamento dos 96 textos do acervo, a mediana era 20 aberturas por artigo,
 * cobrindo 28% das linhas de corpo e chegando a 56%. Secao apos secao no molde
 * "**Coisa.** explicacao" vira lista de maquina disfarcada de prosa — e um dos
 * padroes que os detectores de IA mais pontuam, mesmo sem nenhuma palavra
 * proibida no texto.
 *
 * Casa a linha que COMECA com um negrito curto (o rotulo), seguido de espaco,
 * virgula, pontuacao ou fim de linha. Detalhe que importa: o ponto/dois-pontos
 * fica DENTRO do negrito ("**Termica.**"), entao NAO se exige pontuacao depois
 * do fecho — foi esse o engano da primeira versao, que casava zero. Ignora
 * bullet de verdade ("- **Item:** ...", lista legitima) porque exige que a
 * linha comece no proprio "**".
 */
const RE_ROTULO_LINHA = /^\*\*[^*\n]{1,60}\*\*(?=[\s,.:;!?]|$)/;

/** Inicio da secao de perguntas frequentes: la o formato "**Pergunta?**" e proposital. */
const RE_SECAO_FAQ = /^#{1,6}\s.*(perguntas frequentes|d[uú]vidas frequentes|faq)/i;

/**
 * Acima desta fracao de PARAGRAFOS abrindo com **rotulo.**, o texto le como
 * lista de maquina disfarcada de prosa.
 *
 * 0.35 e o teto; a mira ao escrever e 0.20. Os numeros saem de medir o
 * acervo: no estado atual a media e 51% dos paragrafos, e os piores textos
 * chegam a 65%. Ou seja, o acervo inteiro esta acima do teto — e proposital
 * que ele acuse, porque esse e o tique estrutural que sobrou depois da
 * limpeza lexical.
 */
const ROTULO_FRACAO_MAX = 0.35;

/**
 * Conta, fora da secao de FAQ, quantos PARAGRAFOS abrem com rotulo em negrito
 * e quantos paragrafos existem.
 *
 * O denominador so pode conter prosa. A primeira versao contava tambem as
 * linhas de lista, que sao muitas em artigo com passo a passo, e o excesso de
 * rotulo ficava diluido: um texto com 51% dos paragrafos moldados aparecia
 * abaixo de 30% e passava. Lista, tabela, titulo, citacao e regua saem da
 * conta; sobra o que a pessoa le corrido, que e onde o molde incomoda.
 */
function densidadeRotulo(texto: string): { rotulos: number; corpo: number } {
  const linhas = texto.split('\n');
  let faqDe = linhas.length;
  for (let i = 0; i < linhas.length; i++) {
    if (RE_SECAO_FAQ.test(linhas[i])) {
      faqDe = i;
      break;
    }
  }
  let rotulos = 0;
  let corpo = 0;
  for (let i = 0; i < faqDe; i++) {
    const t = linhas[i].trim();
    if (
      !t ||
      /^#{1,6}\s/.test(t) ||
      /^\|/.test(t) ||
      /^>/.test(t) ||
      /^[-=]{3,}$/.test(t) ||
      /^([-*]|\d+\.)\s/.test(t)
    ) {
      continue;
    }
    corpo++;
    if (RE_ROTULO_LINHA.test(linhas[i])) rotulos++;
  }
  return { rotulos, corpo };
}

/**
 * Variedade no tamanho das frases.
 *
 * O tique que sobra depois de tirar as palavras proibidas e o ritmo. Prosa
 * humana alterna frase de tres palavras com frase de trinta e cinco; texto
 * gerado tende a uma faixa estreita, e a leitura fica com cadencia de metronomo.
 *
 * Medido no acervo: as frases se concentram entre 7 e 22 palavras, e as frases
 * longas (23 ou mais) sao 11,5% do total nos 18 artigos escritos sob o padrao
 * atual. O alvo e pelo menos 15%, com pelo menos uma frase de 33 palavras ou
 * mais a cada mil palavras de texto — nao para encher linguica, e sim porque
 * frase longa e onde cabe raciocinio subordinado, que e o que a maquina evita.
 *
 * O contrario tambem conta: sem frase curta o texto vira palestra. Por isso a
 * conta olha as duas pontas.
 */
const FRACAO_LONGAS_MIN = 0.15;
const FRACAO_CURTAS_MIN = 0.12;

function ritmoDeFrase(texto: string): { longas: number; curtas: number; total: number } {
  const corrido = apenasCorrido(texto)
    .replace(/\*\*/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  const frases = corrido
    .split(/(?<=[.!?])\s+/)
    .map((f) => f.trim().split(/\s+/).filter(Boolean).length)
    .filter((n) => n >= 2);

  return {
    longas: frases.filter((n) => n >= 23).length,
    curtas: frases.filter((n) => n <= 8).length,
    total: frases.length,
  };
}

/**
 * Descarta tabela, lista e titulo: sobra o texto que a pessoa le corrido.
 *
 * O filtro de lista exige a SINTAXE de lista — o marcador seguido de espaco
 * ("- item", "1. item"). A primeira versao descartava qualquer linha que
 * comecasse com "-", "*" ou digito, e com isso jogava fora todo paragrafo
 * aberto com rotulo em negrito, que comeca com "**". Como metade dos
 * paragrafos do acervo abre assim, metade do texto ficava invisivel para as
 * contagens: travessao dentro desses paragrafos nunca era contado, e a
 * medida de ritmo enxergava um terco das frases.
 */
function apenasCorrido(texto: string): string {
  return texto
    .split('\n')
    .filter((l) => !/^\s*[|>#]/.test(l) && !/^\s*([-*+]|\d+[.)])\s/.test(l))
    .join('\n');
}

/** Tamanho de referencia dos limites: um artigo padrao do blog. */
const ARTIGO_PADRAO = 2000;

/**
 * Ajusta o limite ao tamanho do texto.
 *
 * Sem isso, auditar um trecho de 200 palavras nao acusa nada: quatro
 * travessoes em tres paragrafos passam no limite de seis, que foi pensado
 * para duas mil palavras. O piso de 1 evita zerar limites em textos curtos,
 * onde uma ocorrencia isolada ainda e aceitavel.
 */
function limiteAjustado(limite: number, palavras: number): number {
  if (limite === 0) return 0;
  if (palavras >= ARTIGO_PADRAO) return limite;
  return Math.max(1, Math.round((limite * palavras) / ARTIGO_PADRAO));
}

function auditar(rotulo: string, texto: string): number {
  const palavras = texto.split(/\s+/).length;
  const corrido = apenasCorrido(texto);
  const linhas: string[] = [];
  let reprovas = 0;

  for (const regra of REGRAS) {
    const alvo = regra.soCorrido ? corrido : texto;
    const n = (alvo.match(regra.re) ?? []).length;
    const limite = limiteAjustado(regra.limite, palavras);
    if (n <= limite) continue;
    reprovas++;
    linhas.push(`  ${n}x  ${regra.nome}  (limite ${limite})`);
    linhas.push(`      ${regra.porque}`);
  }

  const ganchos = (texto.match(GANCHOS) ?? []).length;
  if (ganchos > 1) {
    reprovas++;
    linhas.push(`  ${ganchos}x  frase-gancho de formula  (limite 1)`);
    linhas.push(`      varie: "Na pratica:", "O que isso muda:", "Traduzindo:"`);
  }

  const { rotulos, corpo } = densidadeRotulo(texto);
  const fracRotulo = corpo ? rotulos / corpo : 0;
  // Piso de 20 linhas de corpo: nao acusa fragmento curto, so texto de verdade.
  if (corpo >= 20 && fracRotulo > ROTULO_FRACAO_MAX) {
    reprovas++;
    const pct = Math.round(fracRotulo * 100);
    const alvo = Math.round(corpo * 0.15);
    linhas.push(
      `  ${rotulos}x  linha abrindo com **rotulo.**  (${pct}% do corpo, limite ${Math.round(ROTULO_FRACAO_MAX * 100)}%)`,
    );
    linhas.push(
      `      secao apos secao no molde "**Coisa.** explicacao" soa a lista de maquina.`,
    );
    linhas.push(
      `      vire prosa corrida; mire ~${alvo} rotulos, negrito so onde a etiqueta ajuda`,
    );
  }

  // Piso de 40 frases: abaixo disso a proporcao oscila demais para significar algo.
  const ritmo = ritmoDeFrase(texto);
  if (ritmo.total >= 40) {
    const fLongas = ritmo.longas / ritmo.total;
    const fCurtas = ritmo.curtas / ritmo.total;

    if (fLongas < FRACAO_LONGAS_MIN) {
      reprovas++;
      linhas.push(
        `  ${ritmo.longas} de ${ritmo.total} frases longas  (${Math.round(fLongas * 100)}%, minimo ${Math.round(FRACAO_LONGAS_MIN * 100)}%)`,
      );
      linhas.push(
        `      faixa estreita de tamanho e cadencia de metronomo: o tique que sobra`,
      );
      linhas.push(
        `      depois das palavras. Deixe algumas frases correrem, com subordinada`,
      );
    }

    if (fCurtas < FRACAO_CURTAS_MIN) {
      reprovas++;
      linhas.push(
        `  ${ritmo.curtas} de ${ritmo.total} frases curtas  (${Math.round(fCurtas * 100)}%, minimo ${Math.round(FRACAO_CURTAS_MIN * 100)}%)`,
      );
      linhas.push(`      sem frase curta o texto vira palestra. Corte uma em duas`);
    }
  }

  if (reprovas === 0) {
    console.log(`  OK    ${rotulo}  (${palavras} palavras)`);
  } else {
    console.log(`\n  ${rotulo}  (${palavras} palavras)`);
    for (const l of linhas) console.log(l);
  }

  return reprovas;
}

const args = process.argv.slice(2);
let reprovasTotais = 0;
let auditados = 0;

if (args.includes('--tudo')) {
  const posts = await prisma.post.findMany({ select: { slug: true, content: true } });
  const fichas = await prisma.curtainType.findMany({ select: { slug: true, content: true } });
  for (const p of posts) {
    auditados++;
    reprovasTotais += auditar(`post:${p.slug}`, p.content);
  }
  for (const c of fichas) {
    if (!c.content?.trim()) continue;
    auditados++;
    reprovasTotais += auditar(`ficha:${c.slug}`, c.content);
  }
} else if (args[0] === '--slug') {
  const post = await prisma.post.findUnique({
    where: { slug: args[1] },
    select: { content: true },
  });
  if (!post) throw new Error(`post nao encontrado: ${args[1]}`);
  auditados = 1;
  reprovasTotais = auditar(args[1], post.content);
} else {
  const arquivo = args[0];
  if (!arquivo) throw new Error('uso: npm run texto:auditar -- <arquivo.md> | --slug <slug> | --tudo');
  auditados = 1;
  reprovasTotais = auditar(arquivo, readFileSync(arquivo, 'utf8'));
}

console.log(
  reprovasTotais === 0
    ? `\n  ${auditados} texto(s) auditado(s), nenhum problema.\n`
    : `\n  ${auditados} texto(s) auditado(s), ${reprovasTotais} problema(s) acima.\n`,
);

await prisma.$disconnect();
process.exit(reprovasTotais === 0 ? 0 : 1);

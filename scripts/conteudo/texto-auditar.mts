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
 * Acima desta fracao de linhas de corpo abrindo com **rotulo.**, o texto le
 * como lista de maquina. 0.30 pega os textos claramente moldados (a metade
 * superior do acervo, cuja mediana de fato e 28%); artigo novo deve mirar
 * <= 0.15, usando o negrito so onde a etiqueta realmente ajuda a escanear.
 */
const ROTULO_FRACAO_MAX = 0.3;

/**
 * Conta, fora da secao de FAQ, quantas linhas de corpo abrem com rotulo em
 * negrito e quantas linhas de corpo existem (fora de titulo, tabela, citacao e
 * regua). A fracao entre as duas e o sinal — independente do tamanho do texto.
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
    if (!t || /^#{1,6}\s/.test(t) || /^\|/.test(t) || /^>/.test(t) || /^[-=]{3,}$/.test(t)) continue;
    corpo++;
    if (RE_ROTULO_LINHA.test(linhas[i])) rotulos++;
  }
  return { rotulos, corpo };
}

/** Descarta tabela, lista e titulo: sobra o texto que a pessoa le corrido. */
function apenasCorrido(texto: string): string {
  return texto
    .split('\n')
    .filter((l) => !/^\s*[|>#]/.test(l) && !/^\s*[-*\d]/.test(l))
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

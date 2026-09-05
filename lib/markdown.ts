import { marked } from 'marked';
import type { AdBlock } from '@/types';

/**
 * Conversao markdown -> HTML usada no blog, nas paginas institucionais e no
 * preview do editor administrativo.
 *
 * O conteudo vem de usuarios autenticados do painel, mas isso nao basta para
 * confiar nele: uma conta de autor comprometida poderia gravar XSS
 * persistente, que rodaria no navegador de todo visitante e de todo admin.
 * Por isso o HTML gerado passa por saneamento antes de ir para a pagina.
 */
marked.setOptions({ gfm: true, breaks: false });

/** Tags que nunca fazem sentido em um artigo e abrem vetor de ataque. */
const DANGEROUS_TAGS =
  /<\/?(script|style|object|embed|form|input|iframe|frame|frameset|base|meta|link|template|noscript)\b[^>]*>/gi;

/** Qualquer atributo on* (onclick, onerror, onload...). */
const INLINE_HANDLERS = /\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;

/** Atributos que aceitam HTML ou script embutido. */
const DANGEROUS_ATTRS = /\s(srcdoc|xlink:href|formaction|background|dynsrc|lowsrc)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;

/** Atributos que carregam URL e precisam ter o esquema validado. */
const URL_ATTRS = /\s(href|src|srcset|action|poster|cite|data)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/gi;

/** Esquemas de URL aceitos. Tudo fora desta lista e neutralizado. */
const SAFE_SCHEMES = ['http:', 'https:', 'mailto:', 'tel:'];

const HEADING_TAG = /<(h2|h3)>([\s\S]*?)<\/\1>/g;

const TABLE_TAG = /<table>([\s\S]*?)<\/table>/g;

/**
 * Decide se uma URL pode ficar no documento.
 *
 * O ataque classico e `javascript:alert(1)` em um href. Variacoes reais usam
 * maiusculas alternadas, entidades HTML (`java&#115;cript:`), quebras de
 * linha e tabs no meio do esquema — o navegador ignora tudo isso e executa.
 * Por isso normalizamos antes de comparar.
 */
function isSafeUrl(raw: string): boolean {
  const normalized = raw
    // Entidades numericas: &#106; e &#x6A;
    .replace(/&#x([0-9a-f]+);?/gi, (_m, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);?/g, (_m, dec) => String.fromCharCode(parseInt(dec, 10)))
    // Caracteres de controle e espacos que o navegador descarta
    .replace(/[\u0000-\u0020]/g, '')
    .toLowerCase();

  // URL relativa, ancora ou protocolo-relativa: sem esquema, sem risco
  const scheme = /^([a-z][a-z0-9+.-]*:)/.exec(normalized);
  if (!scheme) return true;

  return SAFE_SCHEMES.includes(scheme[1]);
}

/**
 * Normaliza um titulo em um id estavel para ancoras (#como-medir).
 * O `normalize('NFD')` separa os acentos em marcas combinantes, que sao
 * descartadas junto com a pontuacao pelo filtro `[^\w\s-]`.
 */
export function headingId(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .toLowerCase()
    .normalize('NFD')
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Converte markdown em HTML e injeta ids nos H2/H3.
 * As versoes recentes do `marked` deixaram de gerar ids automaticamente, e
 * eles sao necessarios para o sumario flutuante dos artigos.
 */
export function markdownToHtml(markdown: string): string {
  const raw = marked.parse(markdown ?? '', { async: false }) as string;

  return raw
    .replace(DANGEROUS_TAGS, '')
    .replace(INLINE_HANDLERS, '')
    .replace(DANGEROUS_ATTRS, '')
    // Remove o atributo inteiro quando o esquema da URL não é confiável
    .replace(URL_ATTRS, (match, attr: string, _quoted, dq?: string, sq?: string, bare?: string) => {
      const url = dq ?? sq ?? bare ?? '';
      return isSafeUrl(url) ? match : ` ${attr}="#"`;
    })
    .replace(
      HEADING_TAG,
      (_match, tag: string, inner: string) =>
        `<${tag} id="${headingId(inner)}">${inner}</${tag}>`,
    )
    /**
     * Tabela comparativa de 4 a 6 colunas nao cabe em tela de celular, e ela
     * nao encolhe: a largura minima do conteudo vira a largura minima da
     * coluna do artigo, que por sua vez alarga a pagina inteira. O efeito
     * visivel nao e a tabela cortada — e o fundo das secoes e as imagens
     * parando antes da borda direita, porque a pagina ficou mais larga que a
     * tela. Envolver em um container com rolagem propria isola esse minimo.
     */
    .replace(TABLE_TAG, (match) => `<div class="table-scroll">${match}</div>`);
}

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

/** Extrai os titulos H2/H3 do markdown para montar o sumario do artigo. */
export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  let insideCodeBlock = false;

  for (const line of (markdown ?? '').split('\n')) {
    if (line.trim().startsWith('```')) {
      insideCodeBlock = !insideCodeBlock;
      continue;
    }
    if (insideCodeBlock) continue;

    const match = /^(#{2,3})\s+(.*)$/.exec(line.trim());
    if (!match) continue;

    const level = match[1].length === 2 ? 2 : 3;
    const text = match[2].replace(/[*_`]/g, '').trim();
    headings.push({ id: headingId(text), text, level });
  }

  return headings;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Extrai as perguntas frequentes escritas no corpo do markdown.
 *
 * Reconhece o padrao usado nos artigos do site: um titulo "## Perguntas
 * frequentes" e, abaixo dele, blocos em que a primeira linha e a pergunta em
 * negrito e as linhas seguintes sao a resposta.
 *
 *     ## Perguntas frequentes
 *
 *     **A cortina encolhe na lavagem?**
 *     Algodao e linho puros encolhem de 3% a 5%.
 *
 * Serve para gerar o JSON-LD de FAQPage sem duplicar o conteudo: a fonte
 * continua sendo o texto que o autor escreve no painel.
 */
export function extractFaq(markdown: string): FaqItem[] {
  const inicio = /^##\s+Perguntas frequentes\s*$/im.exec(markdown ?? '');
  if (!inicio) return [];

  // Da secao ate o proximo H2 (ou o fim do texto).
  const resto = (markdown ?? '').slice(inicio.index + inicio[0].length);
  const proximoH2 = /^##\s+/m.exec(resto);
  const trecho = proximoH2 ? resto.slice(0, proximoH2.index) : resto;

  const itens: FaqItem[] = [];

  for (const bloco of trecho.split(/\n\s*\n/)) {
    const linhas = bloco.trim().split('\n');
    if (linhas.length < 2) continue;

    const pergunta = /^\*\*(.+?)\*\*\s*$/.exec(linhas[0].trim());
    if (!pergunta) continue;

    // Resposta em texto puro — o schema.org nao aceita marcacao.
    const resposta = linhas
      .slice(1)
      .join(' ')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links viram so o rotulo
      .replace(/[*_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (resposta) itens.push({ question: pergunta[1].trim(), answer: resposta });
  }

  return itens;
}

/**
 * No do corpo do artigo: um trecho de HTML ja renderizado, ou a referencia a
 * um bloco de anuncio que deve entrar naquele ponto.
 */
export type ContentNode =
  | { kind: 'html'; html: string }
  | { kind: 'block'; blockId: string };

/** Sentinela interna (caractere nulo) que marca onde cada bloco entra. */
const blockMark = (id: string) => `\u0000AD:${id}\u0000`;
const BLOCK_MARK = /\u0000AD:([a-zA-Z0-9_-]+)\u0000/;

/** Atalho manual [[ad:id]] escrito numa linha propria vira <p>[[ad:id]]</p>. */
const MANUAL_TOKEN_P = /<p>\s*\[\[ad:([a-zA-Z0-9_-]+)\]\]\s*<\/p>/g;
/** Qualquer atalho solto (inline ou apontando para bloco inexistente). */
const ANY_TOKEN = /\[\[ad:[a-zA-Z0-9_-]+\]\]/g;

/**
 * Monta a sequencia ordenada de nos (HTML + blocos) do corpo do artigo.
 *
 * Substitui o antigo corte unico ("primeira/segunda metade") por uma lista
 * que o PostContent percorre, inserindo cada bloco no lugar certo. Dois
 * mecanismos de posicionamento, como no Ad Inserter do WordPress:
 *
 *  - manual: o autor escreve `[[ad:id]]` numa linha; o marked gera
 *    `<p>[[ad:id]]</p>`. Trocamos por uma sentinela quando existe um bloco
 *    `manual` com aquele id (senao o atalho e removido, para o visitante
 *    nunca ver o codigo cru). Precedente: applySiteTokens em content-tokens.
 *  - por paragrafo: dividimos o HTML por `</p>` e, apos o N-esimo, inserimos
 *    os blocos `paragraph` (3/6/9 por padrao). Um bloco cujo N ultrapassa o
 *    total de paragrafos simplesmente nao aparece — mesma regra do corte
 *    anterior, que so agia quando havia paragrafo suficiente depois do ponto.
 */
export function buildArticleNodes(markdown: string, blocks: AdBlock[]): ContentNode[] {
  let html = markdownToHtml(markdown);

  // 1) Atalho manual -> sentinela (so para blocos 'manual' existentes).
  const manuais = new Set(blocks.filter((b) => b.placement === 'manual').map((b) => b.id));
  html = html.replace(MANUAL_TOKEN_P, (_match, id: string) =>
    manuais.has(id) ? blockMark(id) : '',
  );
  // Remove atalhos que sobraram (inline ou id inexistente): nada de codigo cru.
  html = html.replace(ANY_TOKEN, '');

  // 2) Posicoes por paragrafo -> sentinela apos o N-esimo </p>.
  const porParagrafo = blocks
    .filter((b) => b.placement === 'paragraph' && b.afterParagraph > 0)
    .sort((a, b) => a.afterParagraph - b.afterParagraph);

  if (porParagrafo.length > 0) {
    const partes = html.split('</p>');
    const totalParagrafos = partes.length - 1;
    let montado = '';

    partes.forEach((parte, index) => {
      montado += parte;
      if (index === partes.length - 1) return; // ultima parte: sem </p> proprio

      montado += '</p>';
      const numeroDoParagrafo = index + 1;
      // So insere se ainda houver conteudo depois — nao encostar no fim.
      if (numeroDoParagrafo < totalParagrafos) {
        for (const bloco of porParagrafo) {
          if (bloco.afterParagraph === numeroDoParagrafo) montado += blockMark(bloco.id);
        }
      }
    });

    html = montado;
  }

  // 3) Quebra final nas sentinelas -> lista de nos.
  const nodes: ContentNode[] = [];
  html.split(BLOCK_MARK).forEach((parte, index) => {
    if (index % 2 === 0) {
      if (parte) nodes.push({ kind: 'html', html: parte });
    } else {
      nodes.push({ kind: 'block', blockId: parte });
    }
  });

  return nodes;
}

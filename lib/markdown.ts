import { marked } from 'marked';

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
    );
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

/**
 * Divide o HTML apos o enesimo paragrafo para inserir o bloco de anuncio
 * "in-article" no meio do texto, como recomenda o Google AdSense.
 */
export function splitHtmlAtParagraph(
  html: string,
  afterParagraph = 4,
): [string, string] {
  const parts = html.split('</p>');
  if (parts.length <= afterParagraph + 1) return [html, ''];
  const first = `${parts.slice(0, afterParagraph).join('</p>')}</p>`;
  const second = parts.slice(afterParagraph).join('</p>');
  return [first, second];
}

/**
 * Registro de quais blocos de anúncio ainda não terminaram de carregar.
 *
 * Existe para a tela de carregamento saber quando sair. Sem isso ela usava
 * um tempo fixo, que não tinha relação nenhuma com o que a página estava
 * de fato esperando: em rota sem anúncio ela demorava à toa, e em rota com
 * anúncio ela saía antes, deixando o bloco aparecer depois, na cara do
 * leitor.
 *
 * É um store de módulo e não um Context do React de propósito. Os blocos
 * de anúncio ficam espalhados no meio das páginas, e a tela de
 * carregamento mora no layout: passar isso por Context obrigaria um
 * provider envolvendo tudo e faria cada registro re-renderizar a árvore
 * inteira. Aqui o registro é uma escrita em Set e um aviso aos assinantes.
 */

const pendentes = new Set<string>();
const ouvintes = new Set<() => void>();

function avisar() {
  // forEach e nao for..of: o target do tsconfig nao permite iterar Set
  // diretamente sem downlevelIteration.
  ouvintes.forEach((fn) => fn());
}

/** Um bloco entrou em tela e começou a carregar. */
export function registrarAnuncio(id: string) {
  if (pendentes.has(id)) return;
  pendentes.add(id);
  avisar();
}

/** O bloco resolveu — com anúncio, sem anúncio ou por tempo esgotado. */
export function concluirAnuncio(id: string) {
  if (!pendentes.delete(id)) return;
  avisar();
}

/** Quantos blocos a página ainda espera. */
export function anunciosPendentes(): number {
  return pendentes.size;
}

/**
 * Zera a contagem no início de uma navegação.
 *
 * Necessário porque os blocos da página que está saindo desmontam depois
 * dos da página nova montarem, e sem a limpeza a contagem carregaria
 * pendências de uma rota que nem existe mais.
 */
export function limparAnuncios() {
  if (pendentes.size === 0) return;
  pendentes.clear();
  avisar();
}

/** Assina mudanças. Devolve a função que cancela a assinatura. */
export function assinarAnuncios(fn: () => void): () => void {
  ouvintes.add(fn);
  return () => ouvintes.delete(fn);
}

import { getSettings } from '@/lib/settings';

/**
 * /ads.txt — Authorized Digital Sellers (IAB Tech Lab).
 *
 * O arquivo declara quem esta autorizado a vender o inventario de anuncios
 * deste dominio. O AdSense verifica esse endereco e, sem a linha do
 * publisher, mostra o aviso "Ganhos em risco" e pode deixar de exibir
 * anuncios.
 *
 * Por que uma rota e nao um arquivo em public/: o ID do AdSense e digitado
 * no painel administrativo e fica no banco. Um arquivo estatico exigiria
 * editar o codigo e publicar de novo a cada mudanca.
 *
 * Detalhe que inverte o resultado: quando nao ha nada configurado, esta
 * rota responde 404 em vez de devolver um arquivo vazio. Pela especificacao,
 * um ads.txt que existe e nao lista um vendedor declara esse vendedor como
 * NAO autorizado — um arquivo vazio bloquearia todos os anuncios, o oposto
 * de nao ter arquivo nenhum.
 */

// ID de certificacao do Google no IAB — igual para todos os publishers.
const GOOGLE_TAG_ID = 'f08c47fec0942fa0';

// Revalida de hora em hora; salvar as configuracoes revalida na hora.
export const revalidate = 3600;

/** Monta a linha do Google a partir do ID do cliente (ca-pub-... -> pub-...). */
function linhaGoogle(clientId: string | null): string | null {
  const pub = clientId?.trim().replace(/^ca-/i, '');
  if (!pub || !/^pub-\d{10,20}$/i.test(pub)) return null;

  return `google.com, ${pub}, DIRECT, ${GOOGLE_TAG_ID}`;
}

/** Identidade de uma linha para efeito de duplicata: dominio + publisher. */
function chaveDaLinha(linha: string): string {
  const [dominio, publisher] = linha.split(',').map((parte) => parte.trim().toLowerCase());
  return `${dominio}|${publisher}`;
}

export async function GET() {
  const settings = await getSettings();

  const linhas: string[] = [];
  const vistas = new Set<string>();

  const google = linhaGoogle(settings.adsenseClientId);
  if (google) {
    linhas.push(google);
    vistas.add(chaveDaLinha(google));
  }

  // Linhas digitadas no painel: outras redes, ou o que o AdSense pedir depois
  for (const bruta of (settings.adsTxt ?? '').split('\n')) {
    const linha = bruta.trim();
    if (!linha) continue;

    // Comentarios seguem no arquivo sem entrar na checagem de duplicata
    if (linha.startsWith('#')) {
      linhas.push(linha);
      continue;
    }

    const chave = chaveDaLinha(linha);
    if (vistas.has(chave)) continue;

    vistas.add(chave);
    linhas.push(linha);
  }

  // Sem nada declarado, nao servir arquivo — ver comentario do topo.
  if (vistas.size === 0) {
    return new Response('Not Found', { status: 404 });
  }

  return new Response(`${linhas.join('\n')}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

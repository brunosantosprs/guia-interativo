import { prisma } from '@/lib/prisma';
import { fail, ok } from '@/lib/api';

/**
 * POST /api/visitas — registra uma página vista.
 *
 * Chamada pelo navegador depois que a página carrega, e não durante a
 * renderização: as páginas públicas são estáticas com ISR, então contar no
 * servidor registraria a geração do cache, não a visita de uma pessoa.
 *
 * Grava duas coisas na mesma requisição: uma linha em PageView, que carrega
 * a data e permite os relatórios por período, e o incremento do contador
 * agregado em Post.views, que é o número exibido na lista de artigos.
 */

/** Rastreadores conhecidos. Não são visitas de pessoas e não entram na conta. */
const ROBOS = /bot|crawler|spider|crawling|headless|lighthouse|pagespeed|gtmetrix|preview/i;

/** Só contamos o que é conteúdo público. O painel e a API ficam de fora. */
function caminhoValido(path: string) {
  if (!path.startsWith('/')) return false;
  if (path.startsWith('/admin')) return false;
  if (path.startsWith('/api')) return false;
  if (path.startsWith('/login')) return false;
  return path.length <= 300;
}

export async function POST(request: Request) {
  try {
    const agente = request.headers.get('user-agent') ?? '';
    if (ROBOS.test(agente)) {
      // Responde sucesso para não sinalizar ao robô que ele foi filtrado.
      return ok({ registrado: false });
    }

    const body = await request.json().catch(() => null);
    const bruto = typeof body?.path === 'string' ? body.path : '';

    // Remove query string e âncora: /blog/x?utm_source=... vira /blog/x
    const path = bruto.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';

    if (!caminhoValido(path)) {
      return fail('Caminho inválido.', 422);
    }

    // O slug do artigo vem do próprio caminho, sem confiar no que o cliente diz.
    const slug = path.startsWith('/blog/') ? path.slice('/blog/'.length) : null;

    const post = slug
      ? await prisma.post.findUnique({ where: { slug }, select: { id: true } })
      : null;

    await prisma.$transaction([
      prisma.pageView.create({ data: { path, postId: post?.id ?? null } }),
      ...(post
        ? [prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } })]
        : []),
    ]);

    return ok({ registrado: true });
  } catch {
    // Falha de contagem nunca pode aparecer para o visitante.
    return ok({ registrado: false });
  }
}

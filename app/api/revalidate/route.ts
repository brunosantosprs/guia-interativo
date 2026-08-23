import { revalidatePath } from 'next/cache';
import { fail, ok } from '@/lib/api';
import { auth } from '@/lib/auth';

/**
 * POST /api/revalidate — revalidação sob demanda (ISR).
 *
 * Aceita duas formas de autorização:
 * 1. Sessão administrativa ativa (botão "Republicar" no painel).
 * 2. Cabeçalho `x-revalidate-secret` com o valor de REVALIDATE_SECRET,
 *    útil para automações e webhooks externos.
 *
 * Corpo: { "paths": ["/", "/blog", "/blog/algum-slug"] }
 */
export async function POST(request: Request) {
  const secret = request.headers.get('x-revalidate-secret');
  const session = await auth();

  const authorized =
    Boolean(session?.user) ||
    (Boolean(process.env.REVALIDATE_SECRET) && secret === process.env.REVALIDATE_SECRET);

  if (!authorized) {
    return fail('Não autorizado.', 401);
  }

  try {
    const body = await request.json().catch(() => ({}));
    const paths: string[] = Array.isArray(body.paths) && body.paths.length > 0
      ? body.paths
      : ['/', '/blog', '/tipos-de-cortinas', '/servicos'];

    const revalidated: string[] = [];

    for (const path of paths) {
      if (typeof path !== 'string' || !path.startsWith('/')) continue;
      revalidatePath(path);
      revalidated.push(path);
    }

    return ok({ revalidated, at: new Date().toISOString() }, 'Conteúdo republicado.');
  } catch {
    return fail('Não foi possível revalidar as rotas informadas.', 500);
  }
}

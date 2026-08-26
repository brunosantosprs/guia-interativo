import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { guard, handleError, ok, parseBody, revalidateContent, emptyToNull } from '@/lib/api';
import { settingsSchema } from '@/lib/validations/settings';

/** GET /api/settings — configurações globais do site. */
export async function GET() {
  const { response } = await guard();
  if (response) return response;

  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
    return ok(settings);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PATCH /api/settings — atualiza as configurações.
 *
 * Como praticamente todas as páginas leem essas configurações (tema, nome,
 * WhatsApp, IDs de Analytics/AdSense), a rota revalida o layout inteiro.
 */
export async function PATCH(request: Request) {
  const { response } = await guard(['ADMIN']);
  if (response) return response;

  const { data, response: invalid } = await parseBody(request, settingsSchema);
  if (invalid) return invalid;

  try {
    // adBlocks e um array Json — sai antes do emptyToNull (que e raso e
    // trocaria strings vazias por null, corrompendo os blocos) e vai direto
    // ao upsert. Mesmo padrao de steps/faq em app/api/servicos/route.ts.
    const { adBlocks, ...rest } = data;
    const clean = emptyToNull(rest);

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: { ...clean, adBlocks },
      create: { id: 'default', ...clean, adBlocks },
    });

    // /ads.txt entra na lista porque e gerado a partir do ID do AdSense:
    // sem revalidar, o arquivo continuaria servindo o publisher antigo.
    revalidateContent([
      '/',
      '/blog',
      '/tipos-de-cortinas',
      '/servicos',
      '/sobre',
      '/contato',
      '/ads.txt',
    ]);

    // Os blocos de anuncio entram no corpo dos artigos: revalida cada post
    // (rota dinamica exige o segundo argumento 'page'), senao a mudanca so
    // apareceria no proximo ciclo de revalidate (30 min).
    try {
      revalidatePath('/blog/[slug]', 'page');
    } catch {
      // Fora do contexto de requisição: ignorável.
    }

    return ok(settings, 'Configurações salvas.');
  } catch (error) {
    return handleError(error);
  }
}

import { prisma } from '@/lib/prisma';
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
    const clean = emptyToNull(data);

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: clean,
      create: { id: 'default', ...clean },
    });

    revalidateContent(['/', '/blog', '/tipos-de-cortinas', '/servicos', '/sobre', '/contato']);

    return ok(settings, 'Configurações salvas.');
  } catch (error) {
    return handleError(error);
  }
}

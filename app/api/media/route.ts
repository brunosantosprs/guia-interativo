import { prisma } from '@/lib/prisma';
import { guard, handleError, ok, parseBody, emptyToNull } from '@/lib/api';
import { mediaSchema } from '@/lib/validations/content';

/**
 * Biblioteca de mídia.
 *
 * O projeto trabalha com URLs de imagens (arquivos em /public, Vercel Blob,
 * Cloudinary, S3 ou qualquer CDN). Registrar apenas a URL mantém o deploy na
 * Vercel simples, já que o sistema de arquivos das funções é efêmero.
 */

/** GET /api/media — lista os itens, com filtro por pasta e busca. */
export async function GET(request: Request) {
  const { response } = await guard();
  if (response) return response;

  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('pasta');
    const query = searchParams.get('q');

    const media = await prisma.media.findMany({
      where: {
        ...(folder && folder !== 'todas' ? { folder } : {}),
        ...(query
          ? {
              OR: [
                { filename: { contains: query, mode: 'insensitive' as const } },
                { alt: { contains: query, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: { uploadedBy: { select: { name: true } } },
    });

    return ok(media);
  } catch (error) {
    return handleError(error);
  }
}

/** POST /api/media — registra um novo item na biblioteca. */
export async function POST(request: Request) {
  const { session, response } = await guard(['ADMIN', 'EDITOR', 'AUTHOR']);
  if (response) return response;

  const { data, response: invalid } = await parseBody(request, mediaSchema);
  if (invalid) return invalid;

  try {
    const media = await prisma.media.create({
      data: { ...emptyToNull(data), uploadedById: session!.user.id },
    });

    return ok(media, 'Imagem adicionada à biblioteca.', 201);
  } catch (error) {
    return handleError(error);
  }
}

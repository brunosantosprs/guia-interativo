import { prisma } from '@/lib/prisma';
import { fail, guard, handleError, ok, parseBody, emptyToNull } from '@/lib/api';
import { mediaSchema } from '@/lib/validations/content';
import { deleteImageByUrl } from '@/lib/storage';
import type { IdParams } from '@/types';

/** PATCH /api/media/[id] — atualiza metadados (alt, legenda, pasta). */
export async function PATCH(request: Request, { params }: IdParams) {
  const { response } = await guard(['ADMIN', 'EDITOR', 'AUTHOR']);
  if (response) return response;

  const { data, response: invalid } = await parseBody(request, mediaSchema.partial());
  if (invalid) return invalid;

  try {
    const media = await prisma.media.update({
      where: { id: params.id },
      data: emptyToNull(data),
    });
    return ok(media, 'Item atualizado.');
  } catch (error) {
    return handleError(error);
  }
}

/** DELETE /api/media/[id] */
export async function DELETE(_request: Request, { params }: IdParams) {
  const { response } = await guard(['ADMIN', 'EDITOR']);
  if (response) return response;

  try {
    const existing = await prisma.media.findUnique({ where: { id: params.id } });
    if (!existing) return fail('Item não encontrado.', 404);

    await prisma.media.delete({ where: { id: params.id } });

    // Apaga também o arquivo no Storage. Sem isso, cada remoção pelo painel
    // deixaria um órfão pago e acessível por URL para sempre. A função ignora
    // URLs de /public e de CDNs externos, onde não há o que remover.
    await deleteImageByUrl(existing.url);

    return ok({ id: params.id }, 'Item removido da biblioteca.');
  } catch (error) {
    return handleError(error);
  }
}

import { prisma } from '@/lib/prisma';
import { fail, guard, handleError, ok, parseBody, revalidateContent, emptyToNull } from '@/lib/api';
import { curtainTypeSchema } from '@/lib/validations/content';
import { slugify } from '@/lib/utils';
import type { IdParams } from '@/types';

/** GET /api/cortinas/[id] */
export async function GET(_request: Request, { params }: IdParams) {
  const { response } = await guard();
  if (response) return response;

  try {
    const curtain = await prisma.curtainType.findUnique({ where: { id: params.id } });
    if (!curtain) return fail('Tipo de cortina não encontrado.', 404);
    return ok(curtain);
  } catch (error) {
    return handleError(error);
  }
}

/** PATCH /api/cortinas/[id] */
export async function PATCH(request: Request, { params }: IdParams) {
  const { response } = await guard(['ADMIN', 'EDITOR']);
  if (response) return response;

  const { data, response: invalid } = await parseBody(request, curtainTypeSchema);
  if (invalid) return invalid;

  try {
    const existing = await prisma.curtainType.findUnique({
      where: { id: params.id },
      select: { slug: true },
    });
    if (!existing) return fail('Tipo de cortina não encontrado.', 404);

    const clean = emptyToNull(data);

    const curtain = await prisma.curtainType.update({
      where: { id: params.id },
      data: { ...clean, slug: slugify(clean.slug || clean.name) },
    });

    revalidateContent([
      '/',
      '/tipos-de-cortinas',
      `/tipos-de-cortinas/${curtain.slug}`,
      `/tipos-de-cortinas/${existing.slug}`,
    ]);

    return ok(curtain, 'Tipo de cortina atualizado.');
  } catch (error) {
    return handleError(error);
  }
}

/** DELETE /api/cortinas/[id] */
export async function DELETE(_request: Request, { params }: IdParams) {
  const { response } = await guard(['ADMIN', 'EDITOR']);
  if (response) return response;

  try {
    const curtain = await prisma.curtainType.delete({ where: { id: params.id } });
    revalidateContent(['/', '/tipos-de-cortinas', `/tipos-de-cortinas/${curtain.slug}`]);
    return ok({ id: params.id }, 'Tipo de cortina excluído.');
  } catch (error) {
    return handleError(error);
  }
}

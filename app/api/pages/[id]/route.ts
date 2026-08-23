import { prisma } from '@/lib/prisma';
import { fail, guard, handleError, ok, parseBody, revalidateContent, emptyToNull } from '@/lib/api';
import { pageSchema } from '@/lib/validations/content';
import { slugify } from '@/lib/utils';
import type { IdParams } from '@/types';

/** GET /api/pages/[id] */
export async function GET(_request: Request, { params }: IdParams) {
  const { response } = await guard();
  if (response) return response;

  try {
    const page = await prisma.page.findUnique({ where: { id: params.id } });
    if (!page) return fail('Página não encontrada.', 404);
    return ok(page);
  } catch (error) {
    return handleError(error);
  }
}

/** PATCH /api/pages/[id] */
export async function PATCH(request: Request, { params }: IdParams) {
  const { response } = await guard(['ADMIN', 'EDITOR']);
  if (response) return response;

  const { data, response: invalid } = await parseBody(request, pageSchema);
  if (invalid) return invalid;

  try {
    const existing = await prisma.page.findUnique({
      where: { id: params.id },
      select: { slug: true },
    });
    if (!existing) return fail('Página não encontrada.', 404);

    const clean = emptyToNull(data);

    const page = await prisma.page.update({
      where: { id: params.id },
      data: { ...clean, slug: slugify(clean.slug || clean.title) },
    });

    revalidateContent(['/', `/${page.slug}`, `/${existing.slug}`]);

    return ok(page, 'Página atualizada.');
  } catch (error) {
    return handleError(error);
  }
}

/** DELETE /api/pages/[id] */
export async function DELETE(_request: Request, { params }: IdParams) {
  const { response } = await guard(['ADMIN']);
  if (response) return response;

  try {
    const page = await prisma.page.delete({ where: { id: params.id } });
    revalidateContent(['/', `/${page.slug}`]);
    return ok({ id: params.id }, 'Página excluída.');
  } catch (error) {
    return handleError(error);
  }
}

import { prisma } from '@/lib/prisma';
import { fail, guard, handleError, ok, parseBody, revalidateContent, emptyToNull } from '@/lib/api';
import { serviceSchema } from '@/lib/validations/content';
import { slugify } from '@/lib/utils';
import type { IdParams } from '@/types';

/** GET /api/servicos/[id] */
export async function GET(_request: Request, { params }: IdParams) {
  const { response } = await guard();
  if (response) return response;

  try {
    const service = await prisma.service.findUnique({ where: { id: params.id } });
    if (!service) return fail('Serviço não encontrado.', 404);
    return ok(service);
  } catch (error) {
    return handleError(error);
  }
}

/** PATCH /api/servicos/[id] */
export async function PATCH(request: Request, { params }: IdParams) {
  const { response } = await guard(['ADMIN', 'EDITOR']);
  if (response) return response;

  const { data, response: invalid } = await parseBody(request, serviceSchema);
  if (invalid) return invalid;

  try {
    const existing = await prisma.service.findUnique({
      where: { id: params.id },
      select: { slug: true },
    });
    if (!existing) return fail('Serviço não encontrado.', 404);

    const { steps, faq, ...rest } = data;
    const clean = emptyToNull(rest);

    const service = await prisma.service.update({
      where: { id: params.id },
      data: { ...clean, slug: slugify(clean.slug || clean.title), steps, faq },
    });

    revalidateContent([
      '/',
      '/servicos',
      `/servicos/${service.slug}`,
      `/servicos/${existing.slug}`,
    ]);

    return ok(service, 'Serviço atualizado.');
  } catch (error) {
    return handleError(error);
  }
}

/** DELETE /api/servicos/[id] */
export async function DELETE(_request: Request, { params }: IdParams) {
  const { response } = await guard(['ADMIN', 'EDITOR']);
  if (response) return response;

  try {
    const service = await prisma.service.delete({ where: { id: params.id } });
    revalidateContent(['/', '/servicos', `/servicos/${service.slug}`]);
    return ok({ id: params.id }, 'Serviço excluído.');
  } catch (error) {
    return handleError(error);
  }
}

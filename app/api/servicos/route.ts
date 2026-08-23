import { prisma } from '@/lib/prisma';
import { guard, handleError, ok, parseBody, revalidateContent, emptyToNull } from '@/lib/api';
import { serviceSchema } from '@/lib/validations/content';
import { slugify } from '@/lib/utils';

/** GET /api/servicos */
export async function GET() {
  const { response } = await guard();
  if (response) return response;

  try {
    const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
    return ok(services);
  } catch (error) {
    return handleError(error);
  }
}

/** POST /api/servicos */
export async function POST(request: Request) {
  const { response } = await guard(['ADMIN', 'EDITOR']);
  if (response) return response;

  const { data, response: invalid } = await parseBody(request, serviceSchema);
  if (invalid) return invalid;

  try {
    const { steps, faq, ...rest } = data;
    const clean = emptyToNull(rest);

    const service = await prisma.service.create({
      data: {
        ...clean,
        slug: slugify(clean.slug || clean.title),
        steps,
        faq,
      },
    });

    revalidateContent(['/', '/servicos', `/servicos/${service.slug}`]);

    return ok(service, 'Serviço criado.', 201);
  } catch (error) {
    return handleError(error);
  }
}

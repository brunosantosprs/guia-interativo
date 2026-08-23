import { prisma } from '@/lib/prisma';
import { guard, handleError, ok, parseBody, revalidateContent, emptyToNull } from '@/lib/api';
import { curtainTypeSchema } from '@/lib/validations/content';
import { slugify } from '@/lib/utils';

/** GET /api/cortinas — lista os tipos de cortinas. */
export async function GET(request: Request) {
  const { response } = await guard();
  if (response) return response;

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('categoria');

    const curtains = await prisma.curtainType.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(query ? { name: { contains: query, mode: 'insensitive' as const } } : {}),
      },
      orderBy: { order: 'asc' },
    });

    return ok(curtains);
  } catch (error) {
    return handleError(error);
  }
}

/** POST /api/cortinas — cria um tipo de cortina. */
export async function POST(request: Request) {
  const { response } = await guard(['ADMIN', 'EDITOR']);
  if (response) return response;

  const { data, response: invalid } = await parseBody(request, curtainTypeSchema);
  if (invalid) return invalid;

  try {
    const clean = emptyToNull(data);

    const curtain = await prisma.curtainType.create({
      data: { ...clean, slug: slugify(clean.slug || clean.name) },
    });

    revalidateContent(['/', '/tipos-de-cortinas', `/tipos-de-cortinas/${curtain.slug}`]);

    return ok(curtain, 'Tipo de cortina criado.', 201);
  } catch (error) {
    return handleError(error);
  }
}

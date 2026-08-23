import { prisma } from '@/lib/prisma';
import { guard, handleError, ok, parseBody, revalidateContent, emptyToNull } from '@/lib/api';
import { pageSchema } from '@/lib/validations/content';
import { slugify } from '@/lib/utils';

/** GET /api/pages */
export async function GET() {
  const { response } = await guard();
  if (response) return response;

  try {
    const pages = await prisma.page.findMany({
      orderBy: [{ menuOrder: 'asc' }, { title: 'asc' }],
      include: { author: { select: { name: true } } },
    });
    return ok(pages);
  } catch (error) {
    return handleError(error);
  }
}

/** POST /api/pages */
export async function POST(request: Request) {
  const { session, response } = await guard(['ADMIN', 'EDITOR']);
  if (response) return response;

  const { data, response: invalid } = await parseBody(request, pageSchema);
  if (invalid) return invalid;

  try {
    const clean = emptyToNull(data);

    const page = await prisma.page.create({
      data: {
        ...clean,
        slug: slugify(clean.slug || clean.title),
        authorId: session!.user.id,
      },
    });

    revalidateContent(['/', `/${page.slug}`]);

    return ok(page, 'Página criada.', 201);
  } catch (error) {
    return handleError(error);
  }
}

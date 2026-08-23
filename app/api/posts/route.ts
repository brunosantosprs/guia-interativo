import { prisma } from '@/lib/prisma';
import { guard, handleError, ok, parseBody, revalidateContent, emptyToNull } from '@/lib/api';
import { postSchema } from '@/lib/validations/content';
import { readingTime, slugify } from '@/lib/utils';

/** GET /api/posts — lista os artigos (área administrativa). */
export async function GET(request: Request) {
  const { response } = await guard();
  if (response) return response;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const query = searchParams.get('q');

    const posts = await prisma.post.findMany({
      where: {
        ...(status && status !== 'TODOS' ? { status: status as never } : {}),
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: 'insensitive' as const } },
                { excerpt: { contains: query, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        author: { select: { name: true, image: true } },
        category: { select: { name: true, slug: true } },
        tags: { select: { id: true, name: true } },
      },
    });

    return ok(posts);
  } catch (error) {
    return handleError(error);
  }
}

/** POST /api/posts — cria um artigo. */
export async function POST(request: Request) {
  const { session, response } = await guard(['ADMIN', 'EDITOR', 'AUTHOR']);
  if (response) return response;

  const { data, response: invalid } = await parseBody(request, postSchema);
  if (invalid) return invalid;

  try {
    const { tags, ...rest } = data;
    const clean = emptyToNull(rest);

    // Autores só podem publicar o próprio conteúdo; demais viram rascunho.
    const status =
      session!.user.role === 'AUTHOR' && clean.status === 'PUBLISHED'
        ? 'PUBLISHED'
        : clean.status;

    const post = await prisma.post.create({
      data: {
        ...clean,
        slug: slugify(clean.slug || clean.title),
        status,
        readingMinutes: readingTime(clean.content),
        publishedAt:
          status === 'PUBLISHED' ? (clean.publishedAt ?? new Date()) : clean.publishedAt,
        authorId: session!.user.id,
        tags: {
          connectOrCreate: tags.map((name) => ({
            where: { slug: slugify(name) },
            create: { name, slug: slugify(name) },
          })),
        },
      },
      include: { tags: true },
    });

    revalidateContent(['/', '/blog', `/blog/${post.slug}`]);

    return ok(post, 'Artigo criado com sucesso.', 201);
  } catch (error) {
    return handleError(error);
  }
}

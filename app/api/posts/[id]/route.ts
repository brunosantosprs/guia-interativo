import { prisma } from '@/lib/prisma';
import { fail, guard, handleError, ok, parseBody, revalidateContent, emptyToNull } from '@/lib/api';
import { postSchema } from '@/lib/validations/content';
import { readingTime, slugify } from '@/lib/utils';
import type { IdParams } from '@/types';

/** GET /api/posts/[id] */
export async function GET(_request: Request, { params }: IdParams) {
  const { response } = await guard();
  if (response) return response;

  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: { tags: true, category: true, author: { select: { id: true, name: true } } },
    });

    if (!post) return fail('Artigo não encontrado.', 404);
    return ok(post);
  } catch (error) {
    return handleError(error);
  }
}

/** PATCH /api/posts/[id] — atualiza um artigo. */
export async function PATCH(request: Request, { params }: IdParams) {
  const { session, response } = await guard(['ADMIN', 'EDITOR', 'AUTHOR']);
  if (response) return response;

  const { data, response: invalid } = await parseBody(request, postSchema);
  if (invalid) return invalid;

  try {
    const existing = await prisma.post.findUnique({
      where: { id: params.id },
      select: { slug: true, authorId: true, publishedAt: true },
    });
    if (!existing) return fail('Artigo não encontrado.', 404);

    // Autor só edita o próprio conteúdo
    if (session!.user.role === 'AUTHOR' && existing.authorId !== session!.user.id) {
      return fail('Você só pode editar os próprios artigos.', 403);
    }

    const { tags, ...rest } = data;
    const clean = emptyToNull(rest);

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        ...clean,
        slug: slugify(clean.slug || clean.title),
        readingMinutes: readingTime(clean.content),
        // Define a data de publicação na primeira vez que o artigo é publicado
        publishedAt:
          clean.status === 'PUBLISHED'
            ? (clean.publishedAt ?? existing.publishedAt ?? new Date())
            : clean.publishedAt,
        tags: {
          set: [],
          connectOrCreate: tags.map((name) => ({
            where: { slug: slugify(name) },
            create: { name, slug: slugify(name) },
          })),
        },
      },
      include: { tags: true },
    });

    revalidateContent(['/', '/blog', `/blog/${post.slug}`, `/blog/${existing.slug}`]);

    return ok(post, 'Artigo atualizado.');
  } catch (error) {
    return handleError(error);
  }
}

/** DELETE /api/posts/[id] */
export async function DELETE(_request: Request, { params }: IdParams) {
  const { session, response } = await guard(['ADMIN', 'EDITOR', 'AUTHOR']);
  if (response) return response;

  try {
    const existing = await prisma.post.findUnique({
      where: { id: params.id },
      select: { slug: true, authorId: true },
    });
    if (!existing) return fail('Artigo não encontrado.', 404);

    if (session!.user.role === 'AUTHOR' && existing.authorId !== session!.user.id) {
      return fail('Você só pode excluir os próprios artigos.', 403);
    }

    await prisma.post.delete({ where: { id: params.id } });
    revalidateContent(['/', '/blog', `/blog/${existing.slug}`]);

    return ok({ id: params.id }, 'Artigo excluído.');
  } catch (error) {
    return handleError(error);
  }
}

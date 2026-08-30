import { prisma } from '@/lib/prisma';
import { fail, guard, handleError, ok, parseBody, emptyToNull } from '@/lib/api';
import { userUpdateSchema } from '@/lib/validations/settings';
import { hashPassword } from '@/lib/auth';
import type { IdParams } from '@/types';

const safeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  image: true,
  imagePosition: true,
  bio: true,
  active: true,
  createdAt: true,
} as const;

/** PATCH /api/users/[id] */
export async function PATCH(request: Request, { params }: IdParams) {
  const { session, response } = await guard(['ADMIN']);
  if (response) return response;

  const { data, response: invalid } = await parseBody(request, userUpdateSchema);
  if (invalid) return invalid;

  try {
    const { password, ...rest } = emptyToNull(data);

    // Impede que o último administrador ativo perca o acesso
    if ((rest.role && rest.role !== 'ADMIN') || rest.active === false) {
      const admins = await prisma.user.count({ where: { role: 'ADMIN', active: true } });
      const target = await prisma.user.findUnique({
        where: { id: params.id },
        select: { role: true },
      });

      if (admins <= 1 && target?.role === 'ADMIN') {
        return fail('É necessário manter ao menos um administrador ativo.', 409);
      }
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...rest,
        ...(rest.email ? { email: rest.email.toLowerCase().trim() } : {}),
        ...(password ? { password: await hashPassword(password) } : {}),
      },
      select: safeSelect,
    });

    return ok(user, 'Usuário atualizado.');
  } catch (error) {
    return handleError(error);
  }
}

/** DELETE /api/users/[id] */
export async function DELETE(_request: Request, { params }: IdParams) {
  const { session, response } = await guard(['ADMIN']);
  if (response) return response;

  if (session!.user.id === params.id) {
    return fail('Você não pode excluir a própria conta.', 409);
  }

  try {
    const target = await prisma.user.findUnique({
      where: { id: params.id },
      select: { role: true, _count: { select: { posts: true } } },
    });
    if (!target) return fail('Usuário não encontrado.', 404);

    if (target.role === 'ADMIN') {
      const admins = await prisma.user.count({ where: { role: 'ADMIN', active: true } });
      if (admins <= 1) {
        return fail('É necessário manter ao menos um administrador ativo.', 409);
      }
    }

    if (target._count.posts > 0) {
      return fail(
        'Este usuário possui artigos publicados. Transfira a autoria ou desative a conta em vez de excluir.',
        409,
      );
    }

    await prisma.user.delete({ where: { id: params.id } });
    return ok({ id: params.id }, 'Usuário excluído.');
  } catch (error) {
    return handleError(error);
  }
}

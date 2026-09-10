import { prisma } from '@/lib/prisma';
import { guard, handleError, ok, parseBody } from '@/lib/api';
import { mensagemUpdateSchema } from '@/lib/validations/settings';
import type { IdParams } from '@/types';

/**
 * PATCH /api/mensagens/[id] — muda o status de uma mensagem de contato.
 *
 * O corpo da mensagem nunca é editável: ela é o registro do que a pessoa
 * escreveu. O que muda é só o andamento do atendimento.
 */
export async function PATCH(request: Request, { params }: IdParams) {
  const { response } = await guard();
  if (response) return response;

  const { data, response: invalid } = await parseBody(request, mensagemUpdateSchema);
  if (invalid) return invalid;

  try {
    const mensagem = await prisma.contactMessage.update({
      where: { id: params.id },
      data: { status: data.status },
    });

    return ok(mensagem, 'Status atualizado.');
  } catch (error) {
    return handleError(error);
  }
}

/** DELETE /api/mensagens/[id] — remove a mensagem. Somente administradores. */
export async function DELETE(_request: Request, { params }: IdParams) {
  const { response } = await guard(['ADMIN']);
  if (response) return response;

  try {
    await prisma.contactMessage.delete({ where: { id: params.id } });
    return ok({ id: params.id }, 'Mensagem excluída.');
  } catch (error) {
    return handleError(error);
  }
}

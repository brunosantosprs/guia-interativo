import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ZodError, type ZodType, type ZodTypeDef } from 'zod';
import { Prisma, type Role } from '@prisma/client';
import { auth } from '@/lib/auth';

/**
 * Utilitários compartilhados pelos Route Handlers.
 *
 * Centralizam o formato das respostas, o controle de acesso e o tratamento
 * de erros, evitando repetição em cada rota do CRUD administrativo.
 */

export function ok<T>(data: T, message?: string, status = 200) {
  return NextResponse.json({ success: true, data, message }, { status });
}

export function fail(error: string, status = 400, issues?: Record<string, string[]>) {
  return NextResponse.json({ success: false, error, issues }, { status });
}

/**
 * Garante que há sessão ativa e, opcionalmente, que o usuário tem um dos
 * papéis informados. Retorna a sessão ou uma resposta de erro pronta.
 */
export async function guard(roles?: Role[]) {
  const session = await auth();

  if (!session?.user) {
    return { session: null, response: fail('Não autenticado.', 401) };
  }

  if (roles && !roles.includes(session.user.role)) {
    return { session: null, response: fail('Você não tem permissão para esta ação.', 403) };
  }

  return { session, response: null };
}

/** Valida o corpo da requisição com um schema Zod. */
export async function parseBody<T>(request: Request, schema: ZodType<T, ZodTypeDef, unknown>) {
  try {
    const json = await request.json();
    const data = schema.parse(json);
    return { data, response: null };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        data: null,
        response: fail('Dados inválidos.', 422, error.flatten().fieldErrors as Record<string, string[]>),
      };
    }
    return { data: null, response: fail('Corpo da requisição inválido.', 400) };
  }
}

/** Converte erros conhecidos do Prisma em mensagens legíveis. */
export function handleError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const target = (error.meta?.target as string[] | undefined)?.join(', ') ?? 'campo';
      return fail(`Já existe um registro com o mesmo ${target}.`, 409);
    }
    if (error.code === 'P2025') {
      return fail('Registro não encontrado.', 404);
    }
  }

  console.error('[API]', error);
  return fail('Erro interno ao processar a solicitação.', 500);
}

/**
 * Revalida as rotas afetadas por uma alteração de conteúdo.
 * Mantém o site estático atualizado logo após uma edição no painel.
 */
export function revalidateContent(paths: string[]) {
  for (const path of paths) {
    try {
      revalidatePath(path);
    } catch {
      // revalidatePath falha fora do contexto de requisição — ignorável.
    }
  }
}

/** Normaliza strings vazias vindas de formulários para `null`. */
export function emptyToNull<T extends Record<string, unknown>>(input: T): T {
  const output = { ...input };
  for (const key of Object.keys(output)) {
    if (output[key] === '') {
      (output as Record<string, unknown>)[key] = null;
    }
  }
  return output;
}

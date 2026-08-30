import { prisma } from '@/lib/prisma';
import { guard, handleError, ok, parseBody, emptyToNull } from '@/lib/api';
import { userCreateSchema } from '@/lib/validations/settings';
import { hashPassword } from '@/lib/auth';

/** Campos expostos pela API — nunca inclui o hash da senha. */
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
  _count: { select: { posts: true } },
} as const;

/** GET /api/users — somente administradores. */
export async function GET() {
  const { response } = await guard(['ADMIN']);
  if (response) return response;

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      select: safeSelect,
    });
    return ok(users);
  } catch (error) {
    return handleError(error);
  }
}

/** POST /api/users — cria um usuário. */
export async function POST(request: Request) {
  const { response } = await guard(['ADMIN']);
  if (response) return response;

  const { data, response: invalid } = await parseBody(request, userCreateSchema);
  if (invalid) return invalid;

  try {
    const { password, ...rest } = emptyToNull(data);

    const user = await prisma.user.create({
      data: {
        ...rest,
        email: rest.email.toLowerCase().trim(),
        password: await hashPassword(password),
      },
      select: safeSelect,
    });

    return ok(user, 'Usuário criado com sucesso.', 201);
  } catch (error) {
    return handleError(error);
  }
}

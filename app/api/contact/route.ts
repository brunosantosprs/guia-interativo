import { prisma } from '@/lib/prisma';
import { fail, handleError, ok } from '@/lib/api';
import { contactSchema, subscriberSchema } from '@/lib/validations/settings';

/**
 * Endpoint público do formulário de contato e da newsletter.
 *
 * Duas proteções simples contra abuso:
 * 1. Honeypot — o campo `website` precisa chegar vazio.
 * 2. Limitação por janela de tempo — no máximo 3 mensagens do mesmo e-mail
 *    em 10 minutos, verificado direto no banco (sem dependência externa).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ---------------------------------------------------------------------
    // Newsletter
    // ---------------------------------------------------------------------
    if (body.type === 'newsletter') {
      const parsed = subscriberSchema.safeParse(body);
      if (!parsed.success) {
        return fail('Informe um e-mail válido.', 422);
      }

      const email = parsed.data.email.toLowerCase().trim();

      await prisma.subscriber.upsert({
        where: { email },
        update: { active: true, name: parsed.data.name },
        create: { email, name: parsed.data.name },
      });

      return ok({ email }, 'Inscrição confirmada.');
    }

    // ---------------------------------------------------------------------
    // Contato
    // ---------------------------------------------------------------------
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return fail(
        'Verifique os campos destacados.',
        422,
        parsed.error.flatten().fieldErrors as Record<string, string[]>,
      );
    }

    const { website, ...data } = parsed.data;

    // Honeypot preenchido = bot
    if (website) {
      // Responde com sucesso para não sinalizar a armadilha.
      return ok({ received: true }, 'Mensagem recebida.');
    }

    const email = data.email.toLowerCase().trim();
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const recent = await prisma.contactMessage.count({
      where: { email, createdAt: { gte: tenMinutesAgo } },
    });

    if (recent >= 3) {
      return fail(
        'Recebemos várias mensagens suas nos últimos minutos. Aguarde um pouco antes de enviar outra.',
        429,
      );
    }

    const message = await prisma.contactMessage.create({
      data: {
        name: data.name.trim(),
        email,
        phone: data.phone?.trim() || null,
        subject: data.subject.trim(),
        message: data.message.trim(),
      },
      select: { id: true, createdAt: true },
    });

    return ok(message, 'Mensagem enviada com sucesso.', 201);
  } catch (error) {
    return handleError(error);
  }
}

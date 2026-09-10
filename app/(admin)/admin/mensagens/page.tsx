import { prisma } from '@/lib/prisma';
import { MessagesInbox } from '@/components/admin/messages-inbox';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Mensagens' };

export default async function AdminMensagensPage() {
  const mensagens = await prisma.contactMessage
    .findMany({ orderBy: { createdAt: 'desc' } })
    .catch(() => []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl">Mensagens</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Tudo o que chega pelo formulário da página de contato. Responder é por e-mail ou WhatsApp,
          nos botões da própria mensagem, e o status serve para você não perder o fio do atendimento.
        </p>
      </div>

      <MessagesInbox items={mensagens} />
    </div>
  );
}

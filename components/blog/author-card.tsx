import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { ESPECIALISTA } from '@/lib/constants';
import { whatsappLink } from '@/lib/utils';

interface AuthorCardProps {
  nome: string;
  bio?: string | null;
  foto?: string | null;
  /** Recorte da foto, como "50% 30%". Sem isso o corte e pelo centro. */
  fotoPosicao?: string | null;
  /** Título do guia ou nome da cortina, para a mensagem já chegar com contexto. */
  assunto?: string;
  /** 'guia' no blog, 'ficha' nas páginas de tipos de cortinas. */
  origem?: 'guia' | 'ficha';
}

/** Iniciais para quando ainda não há foto cadastrada. */
function iniciais(nome: string): string {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * Assinatura do conteúdo, com o convite ao serviço.
 *
 * Fica depois do texto inteiro, de propósito: quem chega aqui já leu e
 * recebeu o que veio buscar. A oferta aparece como continuação da conversa,
 * separada por borda e fundo próprio para ninguém confundir o que é
 * orientação com o que é anúncio.
 */
export function AuthorCard({
  nome,
  bio,
  foto,
  fotoPosicao,
  assunto,
  origem = 'guia',
}: AuthorCardProps) {
  const mensagem = assunto
    ? origem === 'ficha'
      ? `Olá, ${ESPECIALISTA.primeiroNome}! Vi a página sobre ${assunto} no Guia Interativo e queria tirar uma dúvida.`
      : `Olá, ${ESPECIALISTA.primeiroNome}! Li o guia "${assunto}" no Guia Interativo e queria tirar uma dúvida.`
    : `Olá, ${ESPECIALISTA.primeiroNome}! Vim pelo Guia Interativo e queria tirar uma dúvida sobre cortinas.`;

  return (
    <section className="mt-12 overflow-hidden rounded-lg border border-border bg-surface">
      <div className="p-6 md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row">
          {foto ? (
            <Image
              src={foto}
              alt={nome}
              width={64}
              height={64}
              className="h-16 w-16 shrink-0 rounded-full border border-border object-cover"
              style={fotoPosicao ? { objectPosition: fotoPosicao } : undefined}
            />
          ) : (
            <div
              aria-hidden
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border bg-background font-serif text-xl text-muted-foreground"
            >
              {iniciais(nome)}
            </div>
          )}

          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Escrito por</p>
            <p className="mt-0.5 font-serif text-xl">{nome}</p>
            <p className="mt-1 text-sm text-accent">{ESPECIALISTA.titulo}</p>

            {bio ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{bio}</p>
            ) : null}

            <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Na área há
                </dt>
                <dd className="font-serif text-lg">{ESPECIALISTA.anosDeExperiencia} anos</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Clientes atendidos
                </dt>
                <dd className="font-serif text-lg">
                  +{ESPECIALISTA.clientesAtendidos.toLocaleString('pt-BR')}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-background px-6 py-6 md:px-8">
        <p className="font-serif text-lg">Se a dúvida for sobre a sua janela</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Fora do site eu meço, oriento e instalo. Se você empacou em alguma decisão daqui, me manda
          uma foto da janela pelo WhatsApp que eu falo o que faria no seu caso — mesmo que a compra
          não seja comigo.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <a
            href={whatsappLink(ESPECIALISTA.whatsapp, mensagem)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Falar com o {ESPECIALISTA.primeiroNome} no WhatsApp
          </a>
          <span className="text-sm text-muted-foreground">{ESPECIALISTA.telefoneVisivel}</span>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { getSettings } from '@/lib/settings';
import { whatsappLink } from '@/lib/utils';
import { SectionHeading } from '@/components/shared/section-heading';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { ContactForm } from '@/components/shared/contact-form';
import { JsonLd, breadcrumbSchema, faqSchema } from '@/components/shared/json-ld';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const metadata: Metadata = {
  title: 'Contato — fale com a equipe do Guia Interativo',
  description:
    'Tire dúvidas sobre cortinas e persianas, peça orçamento de serviços técnicos ou envie uma correção de conteúdo. Resposta em até dois dias úteis.',
  alternates: { canonical: '/contato' },
};

/** Perguntas frequentes exibidas na página e enviadas como FAQPage ao Google. */
const FAQ = [
  {
    question: 'Vocês vendem cortinas?',
    answer:
      'O Guia Interativo é um portal de conteúdo técnico. Não operamos loja própria. Oferecemos serviços de consultoria, projeto, medição, instalação, automação, manutenção e confecção sob medida, descritos na página de Serviços.',
  },
  {
    question: 'Consigo uma recomendação sem visita técnica?',
    answer:
      'Para orientação geral, sim. Descreva o ambiente com o máximo de contexto — orientação da janela, horário do sol direto, uso do cômodo, o que incomoda hoje, dimensões aproximadas e se há sanca. Com isso conseguimos indicar caminhos. Para especificação definitiva e fabricação, a visita é indispensável.',
  },
  {
    question: 'Em quanto tempo vocês respondem?',
    answer:
      'Mensagens enviadas pelo formulário são respondidas em até dois dias úteis. Pelo WhatsApp, o retorno costuma acontecer no mesmo dia, dentro do horário comercial.',
  },
  {
    question: 'Posso sugerir um tema para o blog?',
    answer:
      'Sim, e é uma das mensagens que mais gostamos de receber. Boa parte das pautas nasce de dúvidas enviadas por leitores. Escolha o assunto "Outro assunto" e descreva o que você gostaria de ver explicado.',
  },
  {
    question: 'Encontrei um erro em um artigo. Como aviso?',
    answer:
      'Use o assunto "Correção de conteúdo" e indique a página e o trecho. Verificamos a informação e, se a correção proceder, atualizamos o artigo e alteramos a data de última atualização.',
  },
];

export default async function ContatoPage() {
  const settings = await getSettings();
  const crumbs = [{ label: 'Contato', href: '/contato' }];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), faqSchema(FAQ)]} />

      <section className="border-b border-border bg-hero-fade">
        <div className="container py-12 md:py-16">
          <Breadcrumbs items={crumbs} className="mb-8" />

          <SectionHeading
            as="h1"
            kicker="Contato"
            title="Fale com a equipe"
            description="Dúvida sobre um modelo, ajuda para escolher, orçamento de serviço ou correção de conteúdo — respondemos tudo. Quanto mais contexto você enviar, mais útil será a resposta."
          />
        </div>
      </section>

      <section className="container py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Formulário */}
          <div className="lg:col-span-7">
            <div className="rounded-lg border border-border bg-background p-6 md:p-8">
              <h2 className="font-serif text-xl">Envie uma mensagem</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Campos marcados com <span className="text-accent">*</span> são obrigatórios.
              </p>
              <div className="mt-7">
                <ContactForm />
              </div>
            </div>
          </div>

          {/* Canais diretos */}
          <aside className="lg:col-span-5">
            <div className="space-y-6 lg:sticky lg:top-24">
              <div className="rounded-lg border border-border bg-surface p-6 md:p-7">
                <h2 className="font-serif text-xl">Canais diretos</h2>

                <ul className="mt-6 space-y-5 text-sm">
                  <li className="flex gap-3.5">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.6} aria-hidden />
                    <div>
                      <p className="font-medium">E-mail</p>
                      <a
                        href={`mailto:${settings.email}`}
                        className="text-muted-foreground underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-foreground"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </li>

                  <li className="flex gap-3.5">
                    <MessageCircle
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                      strokeWidth={1.6}
                      aria-hidden
                    />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-muted-foreground">
                        Retorno no mesmo dia, em horário comercial.
                      </p>
                    </div>
                  </li>

                  {settings.phone ? (
                    <li className="flex gap-3.5">
                      <Phone
                        className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                        strokeWidth={1.6}
                        aria-hidden
                      />
                      <div>
                        <p className="font-medium">Telefone</p>
                        <p className="text-muted-foreground">{settings.phone}</p>
                      </div>
                    </li>
                  ) : null}

                  {settings.businessHours ? (
                    <li className="flex gap-3.5">
                      <Clock
                        className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                        strokeWidth={1.6}
                        aria-hidden
                      />
                      <div>
                        <p className="font-medium">Atendimento</p>
                        <p className="text-muted-foreground">{settings.businessHours}</p>
                      </div>
                    </li>
                  ) : null}

                  {settings.address ? (
                    <li className="flex gap-3.5">
                      <MapPin
                        className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                        strokeWidth={1.6}
                        aria-hidden
                      />
                      <div>
                        <p className="font-medium">Endereço</p>
                        <p className="text-muted-foreground">{settings.address}</p>
                      </div>
                    </li>
                  ) : null}
                </ul>

                <Button asChild variant="accent" className="mt-7 w-full">
                  <a
                    href={whatsappLink(settings.whatsapp, settings.whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Abrir conversa no WhatsApp
                  </a>
                </Button>
              </div>

              <div className="rounded-lg border border-border bg-background p-6">
                <h2 className="font-serif text-lg">Antes de escrever</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Boa parte das dúvidas já está respondida em detalhe no conteúdo do site.
                </p>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {[
                    { href: '/tipos-de-cortinas', label: 'Catálogo com 26 tipos' },
                    {
                      href: '/blog/como-medir-janela-para-cortinas-e-persianas',
                      label: 'Como medir a janela',
                    },
                    {
                      href: '/blog/como-escolher-a-cortina-ideal-para-cada-ambiente',
                      label: 'Qual cortina para cada ambiente',
                    },
                    { href: '/servicos', label: 'Serviços e processos' },
                  ].map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-surface py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              kicker="Dúvidas frequentes"
              title="Perguntas que chegam com frequência"
              align="center"
            />

            <Accordion type="single" collapsible className="mt-10">
              {FAQ.map((item, index) => (
                <AccordionItem key={item.question} value={`faq-${index}`}>
                  <AccordionTrigger className="font-serif text-base md:text-lg">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}

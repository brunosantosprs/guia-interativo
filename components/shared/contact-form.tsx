'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, Send } from 'lucide-react';
import { contactSchema, type ContactInput } from '@/lib/validations/settings';
import { maskPhone } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { trackEvent } from '@/components/shared/analytics';

const SUBJECTS = [
  'Dúvida sobre um tipo de cortina',
  'Ajuda para escolher o modelo',
  'Orçamento de serviço',
  'Correção de conteúdo',
  'Parceria ou publicidade',
  'Outro assunto',
];

/** Formulário público de contato, validado com o mesmo schema Zod da API. */
export function ContactForm() {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', phone: '', subject: '', message: '', website: '' },
  });

  const subject = watch('subject');

  async function onSubmit(values: ContactInput) {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact', ...values }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        toast({
          variant: 'destructive',
          title: 'Não foi possível enviar',
          description: result.error ?? 'Tente novamente em alguns instantes.',
        });
        return;
      }

      trackEvent('generate_lead', { form: 'contato', subject: values.subject });
      setSent(true);
      reset();
    } catch {
      toast({
        variant: 'destructive',
        title: 'Falha de conexão',
        description: 'Verifique sua internet e tente novamente.',
      });
    }
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-border bg-surface p-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/15">
          <Check className="h-7 w-7 text-accent" aria-hidden />
        </span>
        <h2 className="mt-5 font-serif text-2xl">Mensagem enviada</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Recebemos sua mensagem e respondemos em até dois dias úteis. Se a dúvida for urgente, o
          WhatsApp costuma ser mais rápido.
        </p>
        <Button variant="outline" className="mt-7" onClick={() => setSent(false)}>
          Enviar outra mensagem
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Honeypot: invisível para pessoas, atrativo para bots */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="website">Não preencha este campo</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nome <span className="text-accent">*</span>
          </Label>
          <Input id="name" {...register('name')} autoComplete="name" placeholder="Como podemos chamar você" />
          {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            E-mail <span className="text-accent">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            autoComplete="email"
            placeholder="seu@email.com"
          />
          {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone ou WhatsApp (opcional)</Label>
        <Input
          id="phone"
          {...register('phone')}
          autoComplete="tel"
          placeholder="(11) 99999-9999"
          onChange={(event) => setValue('phone', maskPhone(event.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">
          Assunto <span className="text-accent">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setValue('subject', option, { shouldValidate: true })}
              aria-pressed={subject === option}
              className={
                subject === option
                  ? 'rounded-full border border-accent bg-accent px-3.5 py-1.5 text-xs font-medium text-accent-foreground'
                  : 'rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent hover:text-foreground'
              }
            >
              {option}
            </button>
          ))}
        </div>
        <input type="hidden" {...register('subject')} />
        {errors.subject ? (
          <p className="text-xs text-destructive">{errors.subject.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          Mensagem <span className="text-accent">*</span>
        </Label>
        <Textarea
          id="message"
          rows={7}
          {...register('message')}
          placeholder="Descreva o ambiente: orientação da janela, horário do sol, o que incomoda hoje e o que você espera resolver. Quanto mais contexto, melhor a resposta."
        />
        {errors.message ? (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        ) : null}
      </div>

      <Button type="submit" size="lg" variant="accent" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Enviar mensagem
          </>
        )}
      </Button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Ao enviar, você concorda com o tratamento dos seus dados conforme a nossa Política de
        Privacidade. Usamos as informações apenas para responder a esta mensagem.
      </p>
    </form>
  );
}

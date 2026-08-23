'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface NewsletterFormProps {
  className?: string;
}

/** Captura de e-mail para a newsletter. Persiste em `subscribers`. */
export function NewsletterForm({ className }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'newsletter', email }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setState('error');
        setMessage(result.error ?? 'Não foi possível concluir a inscrição.');
        return;
      }

      setState('done');
      setMessage('Pronto! Você receberá os próximos guias.');
      setEmail('');
    } catch {
      setState('error');
      setMessage('Falha de conexão. Tente novamente em instantes.');
    }
  }

  if (state === 'done') {
    return (
      <p className={cn('flex items-center gap-2 text-sm text-foreground', className)}>
        <Check className="h-4 w-4 text-accent" aria-hidden />
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-2', className)} noValidate>
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Seu e-mail
        </label>
        <Input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="seu@email.com"
          className="h-10 bg-background"
          autoComplete="email"
        />
        <Button
          type="submit"
          size="icon"
          variant="accent"
          className="h-10 w-10 shrink-0"
          disabled={state === 'loading'}
          aria-label="Inscrever-se"
        >
          {state === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {state === 'error' ? <p className="text-xs text-destructive">{message}</p> : null}

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Sem spam. Você pode cancelar quando quiser.
      </p>
    </form>
  );
}

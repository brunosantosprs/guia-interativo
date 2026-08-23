import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** Página 404 global. */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-hero-fade px-5 py-24">
      <div className="mx-auto max-w-lg text-center">
        <p className="font-serif text-[5rem] leading-none text-accent">404</p>

        <h1 className="mt-4 text-balance font-serif text-display-sm">
          Esta página não existe (ou mudou de lugar)
        </h1>

        <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
          O endereço acessado não corresponde a nenhum conteúdo publicado. Talvez o link esteja
          desatualizado ou tenha sido digitado com um caractere a mais.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/">
              Voltar ao início
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/tipos-de-cortinas">Ver o catálogo de tipos</Link>
          </Button>
        </div>

        <nav className="mt-12 border-t border-border pt-8" aria-label="Atalhos úteis">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Talvez você procure
          </p>
          <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {[
              { href: '/blog', label: 'Blog' },
              { href: '/servicos', label: 'Serviços' },
              { href: '/sobre', label: 'Sobre' },
              { href: '/contato', label: 'Contato' },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}

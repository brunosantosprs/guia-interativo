import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { auth } from '@/lib/auth';
import { LoginForm } from '@/components/admin/login-form';

export const metadata: Metadata = {
  title: 'Entrar no painel',
  robots: { index: false, follow: false },
};

/** Tela de login do painel administrativo. */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  const session = await auth();
  if (session?.user) redirect(searchParams.callbackUrl || '/admin');

  return (
    <main className="flex min-h-dvh flex-col bg-surface">
      <div className="container flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.svg"
                alt="Guia Interativo"
                width={200}
                height={44}
                priority
                className="mx-auto h-10 w-auto"
              />
            </Link>
            <h1 className="mt-8 font-serif text-2xl">Painel administrativo</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Entre com as credenciais da sua conta para gerenciar o conteúdo.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-background p-7 shadow-soft">
            <LoginForm
              callbackUrl={searchParams.callbackUrl}
              initialError={searchParams.error}
            />
          </div>

          <Link
            href="/"
            className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Voltar ao site
          </Link>
        </div>
      </div>
    </main>
  );
}

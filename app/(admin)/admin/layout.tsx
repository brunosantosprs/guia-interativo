import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SessionProvider } from '@/components/admin/session-provider';
import { AdminShell } from '@/components/admin/admin-shell';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  title: { default: 'Painel', template: '%s | Painel — Guia Interativo' },
  robots: { index: false, follow: false },
};

/**
 * Layout do painel administrativo.
 *
 * O middleware já bloqueia visitantes não autenticados; a verificação aqui é
 * a segunda camada, garantindo que nenhum dado seja renderizado sem sessão.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/admin');
  }

  return (
    <SessionProvider session={session}>
      <AdminShell
        user={{
          name: session.user.name ?? 'Usuário',
          email: session.user.email ?? '',
          image: session.user.image,
          role: session.user.role,
        }}
      >
        {children}
      </AdminShell>
    </SessionProvider>
  );
}

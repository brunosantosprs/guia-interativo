'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

/**
 * Disponibiliza a sessão para os Client Components do painel
 * (necessário para `signOut()` e para o hook `useSession`).
 */
export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return <NextAuthSessionProvider session={session}>{children}</NextAuthSessionProvider>;
}

import type { Role } from '@prisma/client';
import type { DefaultSession } from 'next-auth';

/**
 * Aumento de tipos do NextAuth para expor `id` e `role` na sessao,
 * usados no controle de acesso do painel administrativo.
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession['user'];
  }

  interface User {
    role?: Role;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
  }
}

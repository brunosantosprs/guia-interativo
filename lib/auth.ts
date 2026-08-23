import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { Adapter } from 'next-auth/adapters';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import type { Role } from '@prisma/client';

/**
 * Limitador de tentativas de login.
 *
 * Sem isso, o endpoint de credenciais aceita quantas tentativas quiserem —
 * bcrypt custa ~200 ms, o que ainda permite milhares de tentativas por hora
 * contra a senha do administrador.
 *
 * O contador vive em memoria de proposito: e uma protecao de baixo custo que
 * nao depende de Redis. Em serverless cada instancia tem o proprio mapa, o
 * que reduz a eficacia, mas ainda derruba o ataque trivial de script unico.
 * Para protecao forte em producao, use o WAF/Rate Limiting da hospedagem.
 */
const MAX_TENTATIVAS = 8;
const JANELA_MS = 15 * 60 * 1000;

const tentativas = new Map<string, { contador: number; ate: number }>();

function bloqueado(chave: string): boolean {
  const registro = tentativas.get(chave);
  if (!registro) return false;

  if (Date.now() > registro.ate) {
    tentativas.delete(chave);
    return false;
  }

  return registro.contador >= MAX_TENTATIVAS;
}

function registrarFalha(chave: string): void {
  const agora = Date.now();
  const registro = tentativas.get(chave);

  if (!registro || agora > registro.ate) {
    tentativas.set(chave, { contador: 1, ate: agora + JANELA_MS });
    return;
  }

  registro.contador += 1;

  // Impede o mapa de crescer sem limite com e-mails aleatórios
  if (tentativas.size > 5000) {
    tentativas.forEach((valor, chave) => {
      if (agora > valor.ate) tentativas.delete(chave);
    });
  }
}

/**
 * Configuracao do NextAuth.js.
 *
 * Estrategia JWT (compativel com o middleware do App Router) + provider de
 * credenciais com hash bcrypt. O adaptador Prisma fica ativo para manter as
 * tabelas de contas/sessoes prontas caso um provider OAuth seja adicionado.
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase().trim();

        if (bloqueado(email)) {
          // Mensagem genérica: confirmar o bloqueio já entregaria que a conta existe
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });

        // Compara mesmo sem usuário, para que o tempo de resposta não revele
        // quais e-mails existem (enumeração de contas por timing).
        const hash = user?.password ?? '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin';
        const valid = await bcrypt.compare(credentials.password, hash);

        if (!user || !user.password || !user.active || !valid) {
          registrarFalha(email);
          return null;
        }

        tentativas.delete(email);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: Role }).role ?? 'AUTHOR';
      }

      // Permite atualizar o nome/avatar exibido sem novo login
      if (trigger === 'update' && session?.name) {
        token.name = session.name as string;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

/** Atalho para ler a sessao em Server Components e Route Handlers. */
export function auth() {
  return getServerSession(authOptions);
}

/** Lanca um erro se nao houver sessao — usado nas rotas do admin. */
export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}

/** Garante que o usuario logado tenha um dos papeis informados. */
export async function requireRole(roles: Role[]) {
  const session = await requireSession();
  if (!roles.includes(session.user.role)) {
    throw new Error('FORBIDDEN');
  }
  return session;
}

/** Gera o hash de uma senha em texto puro. */
export function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

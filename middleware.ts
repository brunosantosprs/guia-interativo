export { default } from 'next-auth/middleware';

/**
 * Protege a área administrativa.
 *
 * O middleware do NextAuth redireciona visitantes não autenticados para a
 * página de login definida em `authOptions.pages.signIn` (/login),
 * preservando a URL de destino em `callbackUrl`.
 *
 * As rotas de API fazem a própria verificação de sessão e de papel
 * (ver lib/api.ts), portanto não passam por aqui.
 */
export const config = {
  matcher: ['/admin/:path*'],
};

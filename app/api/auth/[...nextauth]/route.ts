import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Endpoint do NextAuth.js.
 * Responde por /api/auth/signin, /api/auth/callback, /api/auth/session etc.
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

import { PrismaClient } from '@prisma/client';

/**
 * Cliente Prisma singleton.
 *
 * Em desenvolvimento o Next.js recarrega os modulos a cada alteracao; sem o
 * cache no `globalThis` cada recarga abriria um novo pool de conexoes ate
 * estourar o limite do PostgreSQL.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

/* eslint-disable no-console */
import { randomBytes } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

/**
 * Define uma nova senha para um usuario do painel.
 *
 *   npm run admin:password                        -> gera senha forte aleatoria
 *   npm run admin:password -- outro@email.com     -> escolhe o usuario
 *
 * A senha nova aparece uma unica vez no terminal e e gravada apenas como
 * hash bcrypt. Ela nunca vai para o .env nem para o banco em texto puro.
 *
 * Nao aceitamos a senha por argumento de linha de comando de proposito:
 * argumentos ficam no historico do shell e na lista de processos.
 */
const prisma = new PrismaClient();

async function main() {
  const email = (process.argv[2] ?? process.env.ADMIN_EMAIL ?? 'admin@guiainterativo.com')
    .toLowerCase()
    .trim();

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    console.error(`\n❌  Nenhum usuário com o e-mail ${email}.\n`);
    const all = await prisma.user.findMany({ select: { email: true, role: true } });
    if (all.length > 0) {
      console.error('    Usuários existentes:');
      for (const u of all) console.error(`      ${u.email}  (${u.role})`);
      console.error('');
    }
    process.exit(1);
  }

  // 18 bytes -> 24 caracteres base64url
  const password = randomBytes(18).toString('base64url');

  await prisma.user.update({
    where: { id: user.id },
    data: { password: await bcrypt.hash(password, 12) },
  });

  console.log('\n───────────────────────────────────────────────');
  console.log('  Senha redefinida');
  console.log('───────────────────────────────────────────────');
  console.log(`  Usuário:  ${user.name} (${user.role})`);
  console.log(`  Login:    ${user.email}`);
  console.log(`  Senha:    ${password}`);
  console.log('───────────────────────────────────────────────');
  console.log('  Anote agora — ela não volta a ser exibida.\n');
}

main()
  .catch((error) => {
    console.error('\n❌  Falha ao redefinir a senha:\n', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

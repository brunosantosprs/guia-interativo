import { prisma } from '../../lib/prisma';
import { ESPECIALISTA } from '../../lib/constants';

/**
 * Cria (ou atualiza) o especialista que assina os guias e transfere os
 * artigos para ele.
 *
 * uso: npm run autor:especialista            simula, sem gravar
 *      npm run autor:especialista -- --aplicar
 *
 * Por que existe: a autoria estava em contas genéricas ("Redação",
 * "Equipe"), que não sustentam a credibilidade de um conteúdo técnico nem
 * rendem nada nos dados estruturados que o Google lê. Um autor com nome,
 * experiência declarada e contato é o que transforma o artigo em
 * recomendação de alguém, em vez de texto anônimo de site.
 *
 * O script é idempotente: rodar duas vezes não duplica nada.
 */

const EMAIL = 'josimar@guiainterativo.com';

const BIO =
  'Trabalho com cortina e persiana há mais de 22 anos — medindo, instalando ' +
  'e consertando o que catálogo nenhum explica. Já passei de cinco mil casas ' +
  'nesse tempo, e quase tudo que escrevo aqui saiu de erro que vi de perto: a ' +
  'janela medida no lugar errado, o blackout que vazava luz pela lateral, a ' +
  'peça cara que não resolvia o problema do cômodo. Escrevo para você comprar ' +
  'com critério, mesmo que não compre comigo.';

async function main() {
  const aplicar = process.argv.includes('--aplicar');

  const anterior = await prisma.user.findUnique({
    where: { email: EMAIL },
    select: { id: true, name: true },
  });

  const totalPosts = await prisma.post.count();
  const totalPaginas = await prisma.page.count();

  console.log(`\n  ${ESPECIALISTA.nome} <${EMAIL}>`);
  console.log(`  ${anterior ? 'ja existe — sera atualizado' : 'sera criado agora'}`);
  console.log(`  bio: ${BIO.length} caracteres`);
  console.log(`  posts a transferir:   ${totalPosts}`);
  console.log(`  paginas a transferir: ${totalPaginas}`);

  if (!aplicar) {
    console.log('\n  SIMULACAO — nada gravado. Rode de novo com --aplicar.\n');
    return;
  }

  // Sem senha: é uma identidade editorial, não uma conta de acesso. Quem
  // publica continua entrando com o próprio login.
  const autor = await prisma.user.upsert({
    where: { email: EMAIL },
    update: { name: ESPECIALISTA.nome, bio: BIO, role: 'AUTHOR', active: true },
    create: { name: ESPECIALISTA.nome, email: EMAIL, bio: BIO, role: 'AUTHOR', active: true },
    select: { id: true },
  });

  const posts = await prisma.post.updateMany({
    where: { authorId: { not: autor.id } },
    data: { authorId: autor.id },
  });

  const paginas = await prisma.page.updateMany({
    where: { authorId: { not: autor.id } },
    data: { authorId: autor.id },
  });

  // Só depois da transferência. As duas condições de "none" garantem que
  // nenhum cadastro que ainda tenha conteúdo seja apagado por engano.
  const removidos = await prisma.user.deleteMany({
    where: {
      email: { not: EMAIL, endsWith: '@guiainterativo.com' },
      role: 'AUTHOR',
      posts: { none: {} },
      pages: { none: {} },
    },
  });

  console.log(`\n  OK: autor pronto`);
  if (removidos.count > 0) {
    console.log(`  cadastros de autor sem conteudo removidos: ${removidos.count}`);
  }
  console.log(`  posts transferidos:   ${posts.count}`);
  console.log(`  paginas transferidas: ${paginas.count}`);
  console.log(`\n  Falta a foto: suba pelo painel em Usuarios > ${ESPECIALISTA.nome}.\n`);
}

main()
  .catch((erro) => {
    console.error('\n  x', erro instanceof Error ? erro.message : erro, '\n');
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

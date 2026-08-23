/* eslint-disable no-console */
import fs from 'node:fs';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { curtainTypes } from './data/cortinas';
import { services } from './data/servicos';
import { posts } from './data/posts';
import { pages } from './data/paginas';

/**
 * Seed completo do Guia Interativo.
 *
 * Popula o banco com todo o conteudo inicial do site: usuarios, categorias,
 * tags, 26 tipos de cortinas, 6 servicos, 10 artigos de blog, as paginas
 * legais e as configuracoes globais.
 *
 * Executar com: npm run db:seed
 * O script e idempotente — pode ser rodado quantas vezes for necessario.
 */
const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Categorias do blog
// ---------------------------------------------------------------------------
const categories = [
  {
    name: 'Guias Práticos',
    slug: 'guias-praticos',
    color: '#C4A77D',
    description:
      'Passo a passo aplicável: como medir, como escolher, como instalar e como evitar os erros mais caros.',
  },
  {
    name: 'Comparativos',
    slug: 'comparativos',
    color: '#8A9A7B',
    description:
      'Confrontos diretos entre materiais e sistemas, com critérios técnicos e a situação em que cada um vence.',
  },
  {
    name: 'Manutenção',
    slug: 'manutencao',
    color: '#B87A5A',
    description:
      'Limpeza, conservação e reparo — o método correto para cada material e a frequência ideal por ambiente.',
  },
  {
    name: 'Tecidos e Materiais',
    slug: 'tecidos-e-materiais',
    color: '#9C8B70',
    description:
      'Fibras, gramaturas, tramas e acabamentos: o que determina caimento, durabilidade e bloqueio de luz.',
  },
  {
    name: 'Ambientes',
    slug: 'ambientes',
    color: '#7E8B9A',
    description:
      'Soluções específicas para quarto, sala, cozinha, banheiro, varanda e ambientes de trabalho.',
  },
  {
    name: 'Conforto e Eficiência',
    slug: 'conforto-e-eficiencia',
    color: '#6E8B7E',
    description:
      'Desempenho térmico, acústico e o impacto real das cortinas na conta de energia.',
  },
  {
    name: 'Tecnologia',
    slug: 'tecnologia',
    color: '#7A7FA0',
    description:
      'Motorização, automação residencial e as inovações que chegaram às coberturas de janela.',
  },
];

// ---------------------------------------------------------------------------
// Utilitarios
// ---------------------------------------------------------------------------

/** Slug simples usado para as tags criadas dinamicamente. */
function toSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Estima o tempo de leitura (210 palavras por minuto). */
function readingMinutes(content: string): number {
  return Math.max(1, Math.round(content.trim().split(/\s+/).length / 210));
}

/** Data no passado, a partir de um numero de dias. */
function daysAgoToDate(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(9, 0, 0, 0);
  return date;
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function main() {
  console.log('\n🌱  Iniciando o seed do Guia Interativo...\n');

  // -------------------------------------------------------------------------
  // 1. Usuarios
  // -------------------------------------------------------------------------
  const adminEmail = (process.env.ADMIN_EMAIL ?? 'admin@guiainterativo.com').toLowerCase();
  const adminName = process.env.ADMIN_NAME ?? 'Equipe Guia Interativo';

  // Senha gerada aleatoriamente e mostrada uma unica vez. Nao existe senha
  // padrao no codigo: qualquer valor fixo aqui viraria a senha de todo mundo
  // que clonar o projeto, e este repositorio e publico o suficiente.
  const generated: { email: string; password: string }[] = [];

  function newPassword(): string {
    // 18 bytes -> 24 caracteres base64url, forte o bastante para uso inicial
    return randomBytes(18).toString('base64url');
  }

  async function ensureUser(input: {
    email: string;
    name: string;
    role: 'ADMIN' | 'EDITOR';
    bio: string;
    image: string;
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    });

    // Usuario ja existe: nunca sobrescreve a senha em uso
    if (existing) {
      return prisma.user.update({
        where: { email: input.email },
        data: { name: input.name, role: input.role, active: true },
      });
    }

    const password = newPassword();
    generated.push({ email: input.email, password });

    return prisma.user.create({
      data: { ...input, password: await bcrypt.hash(password, 12) },
    });
  }

  const admin = await ensureUser({
    email: adminEmail,
    name: adminName,
    role: 'ADMIN',
    bio: 'Equipe editorial do Guia Interativo, dedicada a produzir conteúdo técnico e verificado sobre cortinas, persianas e conforto ambiental.',
    image: '/images/autores/equipe.svg',
  });
  console.log(`✅  Administrador: ${admin.email}`);

  const editor = await ensureUser({
    email: 'redacao@guiainterativo.com',
    name: 'Redação Guia Interativo',
    role: 'EDITOR',
    bio: 'Time de redação responsável pelos guias práticos e comparativos técnicos publicados no blog.',
    image: '/images/autores/redacao.svg',
  });
  console.log(`✅  Editor: ${editor.email}`);

  // -------------------------------------------------------------------------
  // 2. Configuracoes globais
  // -------------------------------------------------------------------------
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'Guia Interativo',
      tagline: 'O guia definitivo de cortinas e persianas',
      description:
        'Conteúdo aprofundado sobre cortinas e persianas: tipos, tecidos, medidas, instalação, manutenção e a escolha ideal para cada ambiente.',
      theme: 'elegante-neutra',
      // Identificação do fornecedor, exibida no rodapé e nas políticas
      companyName: 'ELITE INFINITE DIGITAL LTDA',
      cnpj: '57434556000103',
      address: 'R. Rosa Xavier, 725 — Centro — Tabira/PE — CEP 56.780-000',
      whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511999999999',
      whatsappMessage:
        'Olá! Vim pelo site Guia Interativo e gostaria de tirar uma dúvida sobre cortinas.',
      email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'contato@guiainterativo.com',
      businessHours: 'Segunda a sexta, das 9h às 18h',
      gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || null,
      adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || null,
      adProvider: process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true' ? 'adsense' : 'none',
      defaultMetaTitle: 'Guia Interativo — Cortinas e Persianas',
      defaultMetaDescription:
        'Guias técnicos, comparativos e catálogo completo de tipos de cortinas e persianas. Escolha com critério, meça certo e instale sem erro.',
    },
  });
  console.log('✅  Configurações globais criadas');

  // -------------------------------------------------------------------------
  // 3. Categorias
  // -------------------------------------------------------------------------
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }
  console.log(`✅  ${categories.length} categorias`);

  // -------------------------------------------------------------------------
  // 4. Tipos de cortinas
  // -------------------------------------------------------------------------
  for (const curtain of curtainTypes) {
    await prisma.curtainType.upsert({
      where: { slug: curtain.slug },
      update: curtain,
      create: curtain,
    });
  }
  console.log(`✅  ${curtainTypes.length} tipos de cortinas e persianas`);

  // -------------------------------------------------------------------------
  // 5. Servicos
  // -------------------------------------------------------------------------
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }
  console.log(`✅  ${services.length} serviços`);

  // -------------------------------------------------------------------------
  // 6. Paginas institucionais e legais
  // -------------------------------------------------------------------------
  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: { ...page, authorId: admin.id, status: 'PUBLISHED' },
      create: { ...page, authorId: admin.id, status: 'PUBLISHED' },
    });
  }
  console.log(`✅  ${pages.length} páginas institucionais`);

  // -------------------------------------------------------------------------
  // 7. Artigos do blog (com tags e categorias)
  // -------------------------------------------------------------------------
  for (const post of posts) {
    const category = await prisma.category.findUnique({
      where: { slug: post.categorySlug },
    });

    // Cria as tags que ainda nao existem
    const tagRecords = await Promise.all(
      post.tags.map((name) =>
        prisma.tag.upsert({
          where: { slug: toSlug(name) },
          update: {},
          create: { name, slug: toSlug(name) },
        }),
      ),
    );

    const publishedAt = daysAgoToDate(post.daysAgo);

    const data = {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      coverImageAlt: post.coverImageAlt,
      status: 'PUBLISHED' as const,
      featured: post.featured ?? false,
      readingMinutes: readingMinutes(post.content),
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      keywords: post.keywords,
      publishedAt,
      // Alterna a autoria entre os dois perfis para dar realismo ao blog
      authorId: post.featured ? admin.id : editor.id,
      categoryId: category?.id ?? null,
    };

    await prisma.post.upsert({
      where: { slug: post.slug },
      update: { ...data, tags: { set: tagRecords.map((t) => ({ id: t.id })) } },
      create: {
        ...data,
        slug: post.slug,
        views: Math.floor(Math.random() * 900) + 120,
        tags: { connect: tagRecords.map((t) => ({ id: t.id })) },
      },
    });
  }
  console.log(`✅  ${posts.length} artigos do blog`);

  // -------------------------------------------------------------------------
  // 8. Biblioteca de midia (referencia das imagens do seed)
  // -------------------------------------------------------------------------
  const mediaItems = [
    ...curtainTypes.map((c) => ({
      url: c.image as string,
      alt: c.imageAlt as string,
      folder: 'cortinas',
    })),
    ...posts.map((p) => ({
      url: p.coverImage,
      alt: p.coverImageAlt,
      folder: 'blog',
    })),
    ...services.map((s) => ({
      url: s.image as string,
      alt: s.title,
      folder: 'servicos',
    })),
  ];

  for (const item of mediaItems) {
    const existing = await prisma.media.findFirst({ where: { url: item.url } });
    if (existing) continue;

    const filename = item.url.split('/').pop() ?? 'imagem';
    // Le o tamanho real do arquivo em /public para a biblioteca de midia
    const filePath = path.join(process.cwd(), 'public', item.url.replace(/^\//, ''));
    const size = fs.existsSync(filePath) ? fs.statSync(filePath).size : 0;

    await prisma.media.create({
      data: {
        ...item,
        filename,
        mimeType: filename.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg',
        size,
        width: 1600,
        height: 1067,
        uploadedById: admin.id,
      },
    });
  }
  console.log(`✅  ${mediaItems.length} itens na biblioteca de mídia`);

  // -------------------------------------------------------------------------
  // Resumo
  // -------------------------------------------------------------------------
  console.log('\n───────────────────────────────────────────────');
  console.log('  Seed concluído com sucesso!');
  console.log('───────────────────────────────────────────────');
  console.log('  Painel:  http://localhost:3000/admin');
  console.log(`  Login:   ${adminEmail}`);

  if (generated.length > 0) {
    console.log('\n  ⚠️  ANOTE AGORA — estas senhas não voltam a ser exibidas:\n');
    for (const item of generated) {
      console.log(`      ${item.email}`);
      console.log(`      ${item.password}\n`);
    }
    console.log('  Elas foram geradas aleatoriamente e gravadas como hash.');
    console.log('  Troque no painel em Usuários → Editar.');
  } else {
    console.log('  Senha:   inalterada (usuários já existiam)');
    console.log('\n  Esqueceu a senha? Rode: npm run admin:password');
  }

  console.log('───────────────────────────────────────────────\n');
}

main()
  .catch((error) => {
    console.error('\n❌  Erro ao executar o seed:\n', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

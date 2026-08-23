import Link from 'next/link';
import {
  ArrowUpRight,
  Blinds,
  Eye,
  FileText,
  Files,
  Image as ImageIcon,
  Inbox,
  PenSquare,
  Users,
  Wrench,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { formatDateShort } from '@/lib/utils';
import { STATUS_LABELS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RepublishButton } from '@/components/admin/republish-button';

export const dynamic = 'force-dynamic';

async function getStats() {
  const [
    postsTotal,
    postsPublished,
    postsDraft,
    pages,
    curtains,
    services,
    media,
    users,
    messagesTotal,
    messagesNew,
    views,
    recentPosts,
    recentMessages,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.post.count({ where: { status: 'DRAFT' } }),
    prisma.page.count(),
    prisma.curtainType.count(),
    prisma.service.count(),
    prisma.media.count(),
    prisma.user.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: 'NOVO' } }),
    prisma.post.aggregate({ _sum: { views: true } }),
    prisma.post.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 6,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        updatedAt: true,
        views: true,
        author: { select: { name: true } },
      },
    }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, subject: true, createdAt: true, status: true },
    }),
  ]);

  return {
    postsTotal,
    postsPublished,
    postsDraft,
    pages,
    curtains,
    services,
    media,
    users,
    messagesTotal,
    messagesNew,
    views: views._sum.views ?? 0,
    recentPosts,
    recentMessages,
  };
}

export default async function AdminDashboardPage() {
  const session = await auth();
  const stats = await getStats().catch(() => null);

  if (!stats) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-background p-12 text-center">
        <h1 className="font-serif text-xl">Banco de dados indisponível</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Não foi possível consultar o banco. Verifique a variável{' '}
          <code className="rounded bg-surface px-1.5 py-0.5">DATABASE_URL</code> e execute{' '}
          <code className="rounded bg-surface px-1.5 py-0.5">npm run db:push</code> seguido de{' '}
          <code className="rounded bg-surface px-1.5 py-0.5">npm run db:seed</code>.
        </p>
      </div>
    );
  }

  const cards = [
    {
      label: 'Artigos',
      value: stats.postsTotal,
      hint: `${stats.postsPublished} publicados · ${stats.postsDraft} rascunhos`,
      href: '/admin/posts',
      icon: FileText,
    },
    {
      label: 'Tipos de cortinas',
      value: stats.curtains,
      hint: 'Catálogo técnico',
      href: '/admin/cortinas',
      icon: Blinds,
    },
    {
      label: 'Serviços',
      value: stats.services,
      hint: 'Processos publicados',
      href: '/admin/servicos',
      icon: Wrench,
    },
    {
      label: 'Páginas',
      value: stats.pages,
      hint: 'Institucionais e legais',
      href: '/admin/pages',
      icon: Files,
    },
    {
      label: 'Mídia',
      value: stats.media,
      hint: 'Itens na biblioteca',
      href: '/admin/media',
      icon: ImageIcon,
    },
    {
      label: 'Mensagens',
      value: stats.messagesTotal,
      hint: `${stats.messagesNew} sem leitura`,
      href: '/admin',
      icon: Inbox,
    },
    {
      label: 'Visualizações',
      value: stats.views.toLocaleString('pt-BR'),
      hint: 'Somatório dos artigos',
      href: '/admin/posts',
      icon: Eye,
    },
    {
      label: 'Usuários',
      value: stats.users,
      hint: 'Contas com acesso',
      href: '/admin/users',
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl">
            Olá, {session?.user.name?.split(' ')[0] ?? 'bem-vindo'}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Visão geral do conteúdo publicado e das últimas atividades do site.
          </p>
        </div>

        <div className="flex gap-2">
          <RepublishButton />
          <Button asChild>
            <Link href="/admin/posts/novo">
              <PenSquare className="h-4 w-4" />
              Novo artigo
            </Link>
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-lg border border-border bg-background p-5 transition-all hover:-translate-y-0.5 hover:shadow-soft"
          >
            <div className="flex items-start justify-between">
              <card.icon className="h-5 w-5 text-accent" strokeWidth={1.6} aria-hidden />
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-4 font-serif text-3xl">{card.value}</p>
            <p className="mt-1 text-sm font-medium">{card.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{card.hint}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Últimas edições */}
        <section className="rounded-lg border border-border bg-background lg:col-span-7">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-serif text-lg">Editados recentemente</h2>
            <Link
              href="/admin/posts"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Ver todos
            </Link>
          </header>

          <ul className="divide-y divide-border">
            {stats.recentPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{post.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {post.author.name} · {formatDateShort(post.updatedAt)} · {post.views}{' '}
                      visualizações
                    </p>
                  </div>
                  <Badge
                    variant={
                      post.status === 'PUBLISHED'
                        ? 'success'
                        : post.status === 'DRAFT'
                          ? 'warning'
                          : 'muted'
                    }
                  >
                    {STATUS_LABELS[post.status]}
                  </Badge>
                </Link>
              </li>
            ))}

            {stats.recentPosts.length === 0 ? (
              <li className="px-5 py-10 text-center text-sm text-muted-foreground">
                Nenhum artigo cadastrado ainda.
              </li>
            ) : null}
          </ul>
        </section>

        {/* Mensagens recentes */}
        <section className="rounded-lg border border-border bg-background lg:col-span-5">
          <header className="border-b border-border px-5 py-4">
            <h2 className="font-serif text-lg">Mensagens recebidas</h2>
          </header>

          <ul className="divide-y divide-border">
            {stats.recentMessages.map((message) => (
              <li key={message.id} className="px-5 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{message.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{message.subject}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDateShort(message.createdAt)}
                  </span>
                </div>
              </li>
            ))}

            {stats.recentMessages.length === 0 ? (
              <li className="px-5 py-10 text-center text-sm text-muted-foreground">
                Nenhuma mensagem recebida até o momento.
              </li>
            ) : null}
          </ul>
        </section>
      </div>
    </div>
  );
}

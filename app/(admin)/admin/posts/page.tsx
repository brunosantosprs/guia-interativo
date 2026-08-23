import Link from 'next/link';
import { Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatDateShort } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ContentTable, type ContentRow } from '@/components/admin/content-table';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Posts' };

export default async function AdminPostsPage() {
  const posts = await prisma.post
    .findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
    })
    .catch(() => []);

  const rows: ContentRow[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    subtitle: `/blog/${post.slug}`,
    status: post.status,
    editHref: `/admin/posts/${post.id}`,
    viewHref: post.status === 'PUBLISHED' ? `/blog/${post.slug}` : undefined,
    meta: [
      { label: 'Categoria', value: post.category?.name ?? '—' },
      { label: 'Autor', value: post.author.name },
      { label: 'Atualizado', value: formatDateShort(post.updatedAt) },
      { label: 'Views', value: String(post.views) },
    ],
  }));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl">Posts</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Artigos do blog. O conteúdo é escrito em markdown, com sumário gerado automaticamente a
            partir dos títulos.
          </p>
        </div>

        <Button asChild>
          <Link href="/admin/posts/novo">
            <Plus className="h-4 w-4" />
            Novo artigo
          </Link>
        </Button>
      </div>

      <ContentTable
        rows={rows}
        endpoint="/api/posts"
        itemLabel="artigo"
        searchPlaceholder="Buscar por título ou slug..."
        emptyMessage="Nenhum artigo cadastrado. Comece criando o primeiro."
        metaColumns={['Categoria', 'Autor', 'Atualizado', 'Views']}
      />
    </div>
  );
}

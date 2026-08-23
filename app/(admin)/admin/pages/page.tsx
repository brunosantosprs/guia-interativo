import Link from 'next/link';
import { Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatDateShort } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ContentTable, type ContentRow } from '@/components/admin/content-table';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Páginas' };

export default async function AdminPagesPage() {
  const pages = await prisma.page
    .findMany({ orderBy: [{ menuOrder: 'asc' }, { title: 'asc' }] })
    .catch(() => []);

  const rows: ContentRow[] = pages.map((page) => ({
    id: page.id,
    title: page.title,
    subtitle: `/${page.slug}`,
    status: page.status,
    editHref: `/admin/pages/${page.id}`,
    viewHref: page.status === 'PUBLISHED' ? `/${page.slug}` : undefined,
    meta: [
      { label: 'Rodapé', value: page.showInFooter ? 'Sim' : 'Não' },
      { label: 'Menu', value: page.showInMenu ? 'Sim' : 'Não' },
      { label: 'Atualizado', value: formatDateShort(page.updatedAt) },
    ],
  }));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl">Páginas</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Páginas institucionais e legais. As três políticas são exigidas pelo Google AdSense e
            devem permanecer publicadas e acessíveis pelo rodapé.
          </p>
        </div>

        <Button asChild>
          <Link href="/admin/pages/novo">
            <Plus className="h-4 w-4" />
            Nova página
          </Link>
        </Button>
      </div>

      <ContentTable
        rows={rows}
        endpoint="/api/pages"
        itemLabel="página"
        searchPlaceholder="Buscar por título ou slug..."
        emptyMessage="Nenhuma página cadastrada."
        metaColumns={['Rodapé', 'Menu', 'Atualizado']}
      />
    </div>
  );
}

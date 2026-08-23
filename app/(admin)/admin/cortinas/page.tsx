import Link from 'next/link';
import { Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { LIGHT_BLOCKING_LABELS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { ContentTable, type ContentRow } from '@/components/admin/content-table';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Tipos de Cortinas' };

export default async function AdminCortinasPage() {
  const curtains = await prisma.curtainType.findMany({ orderBy: { order: 'asc' } }).catch(() => []);

  const rows: ContentRow[] = curtains.map((curtain) => ({
    id: curtain.id,
    title: curtain.name,
    subtitle: `/tipos-de-cortinas/${curtain.slug}`,
    status: curtain.status,
    editHref: `/admin/cortinas/${curtain.id}`,
    viewHref: curtain.status === 'PUBLISHED' ? `/tipos-de-cortinas/${curtain.slug}` : undefined,
    meta: [
      { label: 'Categoria', value: curtain.category },
      { label: 'Bloqueio', value: LIGHT_BLOCKING_LABELS[curtain.lightBlocking].split(' — ')[0] },
      { label: 'Ordem', value: String(curtain.order) },
    ],
  }));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl">Tipos de Cortinas</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Catálogo técnico do site. Cada ficha reúne descrição rica, vantagens, desvantagens,
            ambientes recomendados e nível de bloqueio de luz.
          </p>
        </div>

        <Button asChild>
          <Link href="/admin/cortinas/novo">
            <Plus className="h-4 w-4" />
            Novo tipo
          </Link>
        </Button>
      </div>

      <ContentTable
        rows={rows}
        endpoint="/api/cortinas"
        itemLabel="tipo de cortina"
        searchPlaceholder="Buscar por nome ou slug..."
        emptyMessage="Nenhum tipo cadastrado."
        metaColumns={['Categoria', 'Bloqueio', 'Ordem']}
      />
    </div>
  );
}

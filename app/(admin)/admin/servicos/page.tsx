import Link from 'next/link';
import { Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { ContentTable, type ContentRow } from '@/components/admin/content-table';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Serviços' };

export default async function AdminServicosPage() {
  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } }).catch(() => []);

  const rows: ContentRow[] = services.map((service) => ({
    id: service.id,
    title: service.title,
    subtitle: `/servicos/${service.slug}`,
    status: service.status,
    editHref: `/admin/servicos/${service.id}`,
    viewHref: service.status === 'PUBLISHED' ? `/servicos/${service.slug}` : undefined,
    meta: [
      { label: 'Etapas', value: String((service.steps as unknown[])?.length ?? 0) },
      { label: 'FAQ', value: String((service.faq as unknown[])?.length ?? 0) },
      { label: 'Ordem', value: String(service.order) },
    ],
  }));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl">Serviços</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Cada serviço traz o processo passo a passo, entregáveis e perguntas frequentes.
          </p>
        </div>

        <Button asChild>
          <Link href="/admin/servicos/novo">
            <Plus className="h-4 w-4" />
            Novo serviço
          </Link>
        </Button>
      </div>

      <ContentTable
        rows={rows}
        endpoint="/api/servicos"
        itemLabel="serviço"
        searchPlaceholder="Buscar por título..."
        emptyMessage="Nenhum serviço cadastrado."
        metaColumns={['Etapas', 'FAQ', 'Ordem']}
      />
    </div>
  );
}

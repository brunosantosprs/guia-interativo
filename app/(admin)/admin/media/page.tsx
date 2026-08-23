import { prisma } from '@/lib/prisma';
import { MediaManager } from '@/components/admin/media-manager';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Biblioteca de mídia' };

export default async function AdminMediaPage() {
  const items = await prisma.media
    .findMany({
      orderBy: { createdAt: 'desc' },
      include: { uploadedBy: { select: { name: true } } },
    })
    .catch(() => []);

  const folders = Array.from(new Set(items.map((item) => item.folder))).sort();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl">Biblioteca de mídia</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Catálogo das imagens usadas no site. Hospede os arquivos em{' '}
          <code className="rounded bg-background px-1.5 py-0.5">public/images</code> ou em um
          serviço de CDN e registre a URL aqui para reaproveitar nos formulários.
        </p>
      </div>

      <MediaManager items={items} folders={folders} />
    </div>
  );
}

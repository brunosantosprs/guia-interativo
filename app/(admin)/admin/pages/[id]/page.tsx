import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PageForm } from '@/components/admin/page-form';
import type { IdParams } from '@/types';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Editar página' };

export default async function EditarPaginaPage({ params }: IdParams) {
  const page = await prisma.page.findUnique({ where: { id: params.id } });
  if (!page) notFound();

  return <PageForm page={page} />;
}

import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CurtainForm } from '@/components/admin/curtain-form';
import type { IdParams } from '@/types';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Editar tipo de cortina' };

export default async function EditarTipoPage({ params }: IdParams) {
  const curtain = await prisma.curtainType.findUnique({ where: { id: params.id } });
  if (!curtain) notFound();

  return <CurtainForm curtain={curtain} />;
}

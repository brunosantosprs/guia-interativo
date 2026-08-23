import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ServiceForm } from '@/components/admin/service-form';
import type { IdParams } from '@/types';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Editar serviço' };

export default async function EditarServicoPage({ params }: IdParams) {
  const service = await prisma.service.findUnique({ where: { id: params.id } });
  if (!service) notFound();

  return <ServiceForm service={service} />;
}

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { defaultSettings } from '@/lib/settings';
import { SettingsForm } from '@/components/admin/settings-form';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Configurações' };

/** Configurações globais — restrito a administradores. */
export default async function AdminSettingsPage() {
  const session = await auth();

  if (session?.user.role !== 'ADMIN') {
    redirect('/admin');
  }

  const settings = await prisma.siteSettings
    .findUnique({ where: { id: 'default' } })
    .catch(() => null);

  return <SettingsForm settings={settings ?? defaultSettings} />;
}

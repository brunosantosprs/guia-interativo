import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { UserManager } from '@/components/admin/user-manager';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Usuários' };

/** Gerenciamento de contas — restrito a administradores. */
export default async function AdminUsersPage() {
  const session = await auth();

  if (session?.user.role !== 'ADMIN') {
    redirect('/admin');
  }

  const users = await prisma.user
    .findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        imagePosition: true,
        imageZoom: true,
        bio: true,
        active: true,
        createdAt: true,
        _count: { select: { posts: true } },
      },
    })
    .catch(() => []);

  return <UserManager users={users} currentUserId={session.user.id} />;
}

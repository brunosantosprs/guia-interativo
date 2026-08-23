import { prisma } from '@/lib/prisma';
import { PostForm } from '@/components/admin/post-form';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Novo artigo' };

export default async function NovoPostPage() {
  const categories = await prisma.category
    .findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })
    .catch(() => []);

  return <PostForm categories={categories} />;
}

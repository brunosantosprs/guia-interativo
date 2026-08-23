import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PostForm } from '@/components/admin/post-form';
import type { IdParams } from '@/types';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Editar artigo' };

export default async function EditarPostPage({ params }: IdParams) {
  const [post, categories] = await Promise.all([
    prisma.post.findUnique({ where: { id: params.id }, include: { tags: true } }),
    prisma.category.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
  ]);

  if (!post) notFound();

  return <PostForm post={post} categories={categories} />;
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExternalLink, Loader2, Save } from 'lucide-react';
import { postSchema, type PostInput } from '@/lib/validations/content';
import { slugify } from '@/lib/utils';
import { STATUS_LABELS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrayField,
  Field,
  FormSection,
  MarkdownEditor,
  SerpPreview,
} from '@/components/admin/form-fields';
import { ImageField } from '@/components/admin/image-field';
import { useToast } from '@/hooks/use-toast';
import type { Category, Post, Tag } from '@prisma/client';

interface PostFormProps {
  post?: Post & { tags: Tag[] };
  categories: Pick<Category, 'id' | 'name'>[];
}

/** Formulário de criação e edição de artigos do blog. */
export function PostForm({ post, categories }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title ?? '',
      slug: post?.slug ?? '',
      excerpt: post?.excerpt ?? '',
      content: post?.content ?? '',
      coverImage: post?.coverImage ?? '',
      coverImageAlt: post?.coverImageAlt ?? '',
      status: post?.status ?? 'DRAFT',
      featured: post?.featured ?? false,
      categoryId: post?.categoryId ?? null,
      tags: post?.tags.map((tag) => tag.name) ?? [],
      metaTitle: post?.metaTitle ?? '',
      metaDescription: post?.metaDescription ?? '',
      keywords: post?.keywords ?? [],
      canonicalUrl: post?.canonicalUrl ?? '',
      publishedAt: post?.publishedAt ?? null,
    },
  });

  const values = watch();

  async function onSubmit(data: PostInput) {
    setSaving(true);

    try {
      const response = await fetch(post ? `/api/posts/${post.id}` : '/api/posts', {
        method: post ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        toast({
          variant: 'destructive',
          title: 'Não foi possível salvar',
          description: result.error ?? 'Verifique os campos e tente novamente.',
        });
        return;
      }

      toast({ variant: 'success', title: 'Salvo', description: result.message });

      if (!post) {
        router.push(`/admin/posts/${result.data.id}`);
      }
      router.refresh();
    } catch {
      toast({ variant: 'destructive', title: 'Falha de conexão' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Barra de ações */}
      <div className="sticky top-16 z-20 -mx-5 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface/95 px-5 py-3 backdrop-blur lg:-mx-8 lg:px-8">
        <div>
          <h1 className="font-serif text-xl">
            {post ? 'Editar artigo' : 'Novo artigo'}
          </h1>
          {post ? (
            <p className="text-xs text-muted-foreground">/blog/{post.slug}</p>
          ) : null}
        </div>

        <div className="flex gap-2">
          {post?.status === 'PUBLISHED' ? (
            <Button asChild variant="outline" size="sm">
              <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                Ver no site
              </a>
            </Button>
          ) : null}

          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Coluna principal */}
        <div className="space-y-6 lg:col-span-8">
          <FormSection title="Conteúdo">
            <Field label="Título" htmlFor="title" required error={errors.title?.message}>
              <Input
                id="title"
                {...register('title')}
                onChange={(event) => {
                  setValue('title', event.target.value);
                  // Sugere o slug apenas enquanto o artigo é novo
                  if (!post) setValue('slug', slugify(event.target.value));
                }}
                placeholder="Como escolher a cortina ideal para cada ambiente"
              />
            </Field>

            <Field
              label="Slug (URL)"
              htmlFor="slug"
              required
              error={errors.slug?.message}
              hint="Somente letras minúsculas, números e hífens."
            >
              <Input id="slug" {...register('slug')} placeholder="como-escolher-a-cortina-ideal" />
            </Field>

            <Field
              label="Resumo"
              htmlFor="excerpt"
              required
              error={errors.excerpt?.message}
              counter={`${values.excerpt?.length ?? 0}/320`}
              hint="Aparece nos cards de listagem e como fallback da meta descrição."
            >
              <Textarea id="excerpt" rows={3} {...register('excerpt')} />
            </Field>

            <MarkdownEditor
              label="Texto do artigo (markdown)"
              required
              value={values.content ?? ''}
              onChange={(value) => setValue('content', value, { shouldValidate: true })}
              error={errors.content?.message}
              hint="Use ## para seções e ### para subseções — elas viram o sumário automático do artigo."
            />
          </FormSection>

          <FormSection
            title="SEO"
            description="Se deixados em branco, título e resumo do artigo são usados automaticamente."
          >
            <Field
              label="Meta título"
              htmlFor="metaTitle"
              error={errors.metaTitle?.message}
              counter={`${values.metaTitle?.length ?? 0}/60 ideal`}
            >
              <Input id="metaTitle" {...register('metaTitle')} />
            </Field>

            <Field
              label="Meta descrição"
              htmlFor="metaDescription"
              error={errors.metaDescription?.message}
              counter={`${values.metaDescription?.length ?? 0}/160 ideal`}
            >
              <Textarea id="metaDescription" rows={3} {...register('metaDescription')} />
            </Field>

            <ArrayField
              label="Palavras-chave"
              values={values.keywords ?? []}
              onChange={(next) => setValue('keywords', next)}
              placeholder="ex.: como escolher cortina"
            />

            <Field
              label="URL canônica"
              htmlFor="canonicalUrl"
              error={errors.canonicalUrl?.message}
              hint="Preencha apenas se este conteúdo for republicação de outra URL."
            >
              <Input id="canonicalUrl" {...register('canonicalUrl')} placeholder="https://..." />
            </Field>

            <SerpPreview
              title={values.metaTitle || values.title}
              description={values.metaDescription || values.excerpt}
              path={`/blog/${values.slug}`}
            />
          </FormSection>
        </div>

        {/* Coluna lateral */}
        <div className="space-y-6 lg:col-span-4">
          <FormSection title="Publicação">
            <Field label="Status" htmlFor="status">
              <Select
                value={values.status}
                onValueChange={(value) => setValue('status', value as PostInput['status'])}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const).map((status) => (
                    <SelectItem key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="flex items-center justify-between gap-4 rounded-md border border-border p-3.5">
              <div>
                <Label htmlFor="featured">Artigo em destaque</Label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Aparece com card ampliado na home e no blog.
                </p>
              </div>
              <Switch
                id="featured"
                checked={values.featured}
                onCheckedChange={(checked) => setValue('featured', checked)}
              />
            </div>

            <Field label="Categoria" htmlFor="categoryId">
              <Select
                value={values.categoryId ?? 'none'}
                onValueChange={(value) =>
                  setValue('categoryId', value === 'none' ? null : value)
                }
              >
                <SelectTrigger id="categoryId">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem categoria</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <ArrayField
              label="Tags"
              values={values.tags ?? []}
              onChange={(next) => setValue('tags', next)}
              placeholder="ex.: blackout"
            />
          </FormSection>

          <FormSection title="Imagem de capa">
            <ImageField
              label="Imagem"
              folder="blog"
              value={values.coverImage ?? ''}
              onChange={(url) => setValue('coverImage', url, { shouldValidate: true })}
              error={errors.coverImage?.message}
            />

            <Field
              label="Texto alternativo"
              htmlFor="coverImageAlt"
              hint="Descreva a imagem para leitores de tela e para o Google."
            >
              <Input id="coverImageAlt" {...register('coverImageAlt')} />
            </Field>
          </FormSection>
        </div>
      </div>
    </form>
  );
}

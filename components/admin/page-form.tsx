'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExternalLink, Loader2, Save } from 'lucide-react';
import { pageSchema, type PageInput } from '@/lib/validations/content';
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
  Field,
  FormSection,
  MarkdownEditor,
  SerpPreview,
} from '@/components/admin/form-fields';
import { useToast } from '@/hooks/use-toast';
import type { Page } from '@prisma/client';

interface PageFormProps {
  page?: Page;
}

/** Formulário das páginas institucionais e legais. */
export function PageForm({ page }: PageFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PageInput>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: page?.title ?? '',
      slug: page?.slug ?? '',
      content: page?.content ?? '',
      excerpt: page?.excerpt ?? '',
      coverImage: page?.coverImage ?? '',
      status: page?.status ?? 'PUBLISHED',
      showInMenu: page?.showInMenu ?? false,
      showInFooter: page?.showInFooter ?? false,
      menuOrder: page?.menuOrder ?? 0,
      metaTitle: page?.metaTitle ?? '',
      metaDescription: page?.metaDescription ?? '',
    },
  });

  const values = watch();

  async function onSubmit(data: PageInput) {
    setSaving(true);

    try {
      const response = await fetch(page ? `/api/pages/${page.id}` : '/api/pages', {
        method: page ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        toast({
          variant: 'destructive',
          title: 'Não foi possível salvar',
          description: result.error ?? 'Verifique os campos.',
        });
        return;
      }

      toast({ variant: 'success', title: 'Salvo', description: result.message });
      if (!page) router.push(`/admin/pages/${result.data.id}`);
      router.refresh();
    } catch {
      toast({ variant: 'destructive', title: 'Falha de conexão' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="sticky top-16 z-20 -mx-5 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface/95 px-5 py-3 backdrop-blur lg:-mx-8 lg:px-8">
        <div>
          <h1 className="font-serif text-xl">{page ? 'Editar página' : 'Nova página'}</h1>
          {page ? <p className="text-xs text-muted-foreground">/{page.slug}</p> : null}
        </div>

        <div className="flex gap-2">
          {page?.status === 'PUBLISHED' ? (
            <Button asChild variant="outline" size="sm">
              <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
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
        <div className="space-y-6 lg:col-span-8">
          <FormSection title="Conteúdo">
            <Field label="Título" htmlFor="title" required error={errors.title?.message}>
              <Input
                id="title"
                {...register('title')}
                onChange={(event) => {
                  setValue('title', event.target.value);
                  if (!page) setValue('slug', slugify(event.target.value));
                }}
              />
            </Field>

            <Field
              label="Slug (URL)"
              htmlFor="slug"
              required
              error={errors.slug?.message}
              hint="A página fica acessível em guiainterativo.com/slug."
            >
              <Input id="slug" {...register('slug')} />
            </Field>

            <Field label="Resumo" htmlFor="excerpt" error={errors.excerpt?.message}>
              <Textarea id="excerpt" rows={2} {...register('excerpt')} />
            </Field>

            <MarkdownEditor
              label="Conteúdo (markdown)"
              required
              value={values.content ?? ''}
              onChange={(value) => setValue('content', value, { shouldValidate: true })}
              error={errors.content?.message}
            />
          </FormSection>

          <FormSection title="SEO">
            <Field label="Meta título" htmlFor="metaTitle" counter={`${values.metaTitle?.length ?? 0}/60`}>
              <Input id="metaTitle" {...register('metaTitle')} />
            </Field>

            <Field
              label="Meta descrição"
              htmlFor="metaDescription"
              counter={`${values.metaDescription?.length ?? 0}/160`}
            >
              <Textarea id="metaDescription" rows={3} {...register('metaDescription')} />
            </Field>

            <SerpPreview
              title={values.metaTitle || values.title}
              description={values.metaDescription || values.excerpt || ''}
              path={`/${values.slug}`}
            />
          </FormSection>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <FormSection title="Publicação">
            <Field label="Status" htmlFor="status">
              <Select
                value={values.status}
                onValueChange={(value) => setValue('status', value as PageInput['status'])}
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
              <Label htmlFor="showInFooter">Exibir no rodapé</Label>
              <Switch
                id="showInFooter"
                checked={values.showInFooter}
                onCheckedChange={(checked) => setValue('showInFooter', checked)}
              />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-md border border-border p-3.5">
              <Label htmlFor="showInMenu">Exibir no menu</Label>
              <Switch
                id="showInMenu"
                checked={values.showInMenu}
                onCheckedChange={(checked) => setValue('showInMenu', checked)}
              />
            </div>

            <Field label="Ordem" htmlFor="menuOrder">
              <Input id="menuOrder" type="number" min={0} {...register('menuOrder')} />
            </Field>
          </FormSection>
        </div>
      </div>
    </form>
  );
}

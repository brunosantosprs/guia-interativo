'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExternalLink, Loader2, Save } from 'lucide-react';
import { curtainTypeSchema, type CurtainTypeInput } from '@/lib/validations/content';
import { slugify } from '@/lib/utils';
import { CURTAIN_CATEGORIES, LIGHT_BLOCKING_LABELS, STATUS_LABELS } from '@/lib/constants';
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
import { ArrayField, Field, FormSection, SerpPreview } from '@/components/admin/form-fields';
import { ImageField } from '@/components/admin/image-field';
import { useToast } from '@/hooks/use-toast';
import type { CurtainType } from '@prisma/client';

interface CurtainFormProps {
  curtain?: CurtainType;
}

/** Formulário de criação e edição dos tipos de cortinas e persianas. */
export function CurtainForm({ curtain }: CurtainFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CurtainTypeInput>({
    resolver: zodResolver(curtainTypeSchema),
    defaultValues: {
      name: curtain?.name ?? '',
      slug: curtain?.slug ?? '',
      summary: curtain?.summary ?? '',
      description: curtain?.description ?? '',
      category: curtain?.category ?? CURTAIN_CATEGORIES[0],
      lightBlocking: curtain?.lightBlocking ?? 'MEDIO',
      priceRange: curtain?.priceRange ?? '',
      maintenance: curtain?.maintenance ?? '',
      materials: curtain?.materials ?? [],
      advantages: curtain?.advantages ?? [],
      disadvantages: curtain?.disadvantages ?? [],
      bestRooms: curtain?.bestRooms ?? [],
      whenToChoose: curtain?.whenToChoose ?? '',
      installation: curtain?.installation ?? '',
      content: curtain?.content ?? '',
      image: curtain?.image ?? '',
      imageAlt: curtain?.imageAlt ?? '',
      featured: curtain?.featured ?? false,
      order: curtain?.order ?? 0,
      status: curtain?.status ?? 'PUBLISHED',
      metaTitle: curtain?.metaTitle ?? '',
      metaDescription: curtain?.metaDescription ?? '',
    },
  });

  const values = watch();
  const descriptionWords = (values.description ?? '').trim().split(/\s+/).filter(Boolean).length;
  const contentWords = (values.content ?? '').trim().split(/\s+/).filter(Boolean).length;

  async function onSubmit(data: CurtainTypeInput) {
    setSaving(true);

    try {
      const response = await fetch(curtain ? `/api/cortinas/${curtain.id}` : '/api/cortinas', {
        method: curtain ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        toast({
          variant: 'destructive',
          title: 'Não foi possível salvar',
          description: result.error ?? 'Verifique os campos obrigatórios.',
        });
        return;
      }

      toast({ variant: 'success', title: 'Salvo', description: result.message });
      if (!curtain) router.push(`/admin/cortinas/${result.data.id}`);
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
          <h1 className="font-serif text-xl">
            {curtain ? 'Editar tipo de cortina' : 'Novo tipo de cortina'}
          </h1>
          {curtain ? (
            <p className="text-xs text-muted-foreground">/tipos-de-cortinas/{curtain.slug}</p>
          ) : null}
        </div>

        <div className="flex gap-2">
          {curtain?.status === 'PUBLISHED' ? (
            <Button asChild variant="outline" size="sm">
              <a
                href={`/tipos-de-cortinas/${curtain.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
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
          <FormSection title="Identificação">
            <Field label="Nome" htmlFor="name" required error={errors.name?.message}>
              <Input
                id="name"
                {...register('name')}
                onChange={(event) => {
                  setValue('name', event.target.value);
                  if (!curtain) setValue('slug', slugify(event.target.value));
                }}
                placeholder="Persiana Rolô"
              />
            </Field>

            <Field label="Slug (URL)" htmlFor="slug" required error={errors.slug?.message}>
              <Input id="slug" {...register('slug')} placeholder="persiana-rolo" />
            </Field>

            <Field
              label="Resumo"
              htmlFor="summary"
              required
              error={errors.summary?.message}
              counter={`${values.summary?.length ?? 0}/400`}
              hint="Uma ou duas frases. Aparece nos cards do catálogo."
            >
              <Textarea id="summary" rows={3} {...register('summary')} />
            </Field>
          </FormSection>

          <FormSection
            title="Conteúdo técnico"
            description="A descrição rica é o coração da ficha. O ideal são 180 a 250 palavras explicando o mecanismo, o comportamento sob luz e as ressalvas."
          >
            <Field
              label="Descrição completa"
              htmlFor="description"
              required
              error={errors.description?.message}
              counter={`${descriptionWords} palavras`}
            >
              <Textarea id="description" rows={12} {...register('description')} />
            </Field>

            <Field
              label="Quando escolher"
              htmlFor="whenToChoose"
              required
              error={errors.whenToChoose?.message}
              hint="O critério objetivo de recomendação: em que situação este modelo é a resposta certa."
            >
              <Textarea id="whenToChoose" rows={4} {...register('whenToChoose')} />
            </Field>

            <Field label="Instalação" htmlFor="installation">
              <Textarea id="installation" rows={3} {...register('installation')} />
            </Field>

            <Field label="Manutenção e limpeza" htmlFor="maintenance">
              <Textarea id="maintenance" rows={3} {...register('maintenance')} />
            </Field>
          </FormSection>

          <FormSection
            title="Guia completo (opcional)"
            description="Texto longo exibido abaixo da ficha técnica, com sumário automático. Aceita markdown: ## para títulos, ** ** para negrito, - para listas, tabelas e links. Deixe em branco para a página mostrar só a ficha."
          >
            <Field
              label="Guia em markdown"
              htmlFor="content"
              error={errors.content?.message}
              counter={`${contentWords} palavras`}
              hint="Use ## para as seções — elas viram o sumário lateral automaticamente."
            >
              <Textarea id="content" rows={20} {...register('content')} />
            </Field>
          </FormSection>

          <FormSection title="Listas">
            <ArrayField
              label="Vantagens"
              required
              values={values.advantages ?? []}
              onChange={(next) => setValue('advantages', next, { shouldValidate: true })}
              error={errors.advantages?.message}
            />

            <ArrayField
              label="Desvantagens"
              required
              values={values.disadvantages ?? []}
              onChange={(next) => setValue('disadvantages', next, { shouldValidate: true })}
              error={errors.disadvantages?.message}
              hint="Listar limitações reais é o que dá credibilidade à ficha."
            />

            <ArrayField
              label="Melhores ambientes"
              required
              values={values.bestRooms ?? []}
              onChange={(next) => setValue('bestRooms', next, { shouldValidate: true })}
              error={errors.bestRooms?.message}
              placeholder="ex.: Quarto de casal"
            />

            <ArrayField
              label="Materiais"
              values={values.materials ?? []}
              onChange={(next) => setValue('materials', next)}
              placeholder="ex.: Poliéster"
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
              title={values.metaTitle || values.name}
              description={values.metaDescription || values.summary}
              path={`/tipos-de-cortinas/${values.slug}`}
            />
          </FormSection>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <FormSection title="Classificação">
            <Field label="Categoria" htmlFor="category" required>
              <Select
                value={values.category}
                onValueChange={(value) => setValue('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURTAIN_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Bloqueio de luz" htmlFor="lightBlocking" required>
              <Select
                value={values.lightBlocking}
                onValueChange={(value) =>
                  setValue('lightBlocking', value as CurtainTypeInput['lightBlocking'])
                }
              >
                <SelectTrigger id="lightBlocking">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['BAIXO', 'MEDIO', 'ALTO', 'BLACKOUT'] as const).map((level) => (
                    <SelectItem key={level} value={level}>
                      {LIGHT_BLOCKING_LABELS[level]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Faixa de investimento" htmlFor="priceRange">
              <Input
                id="priceRange"
                {...register('priceRange')}
                placeholder="R$ 180 a R$ 700 por metro quadrado"
              />
            </Field>

            <Field label="Ordem de exibição" htmlFor="order">
              <Input id="order" type="number" min={0} {...register('order')} />
            </Field>
          </FormSection>

          <FormSection title="Publicação">
            <Field label="Status" htmlFor="status">
              <Select
                value={values.status}
                onValueChange={(value) => setValue('status', value as CurtainTypeInput['status'])}
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
                <Label htmlFor="featured">Em destaque</Label>
                <p className="mt-0.5 text-xs text-muted-foreground">Aparece na home.</p>
              </div>
              <Switch
                id="featured"
                checked={values.featured}
                onCheckedChange={(checked) => setValue('featured', checked)}
              />
            </div>
          </FormSection>

          <FormSection title="Imagem">
            <ImageField
              label="Imagem"
              folder="cortinas"
              aspect="photo"
              value={values.image ?? ''}
              onChange={(url) => setValue('image', url, { shouldValidate: true })}
              error={errors.image?.message}
            />

            <Field label="Texto alternativo" htmlFor="imageAlt">
              <Input id="imageAlt" {...register('imageAlt')} />
            </Field>
          </FormSection>
        </div>
      </div>
    </form>
  );
}

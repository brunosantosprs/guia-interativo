'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExternalLink, Loader2, Save } from 'lucide-react';
import { serviceSchema, type ServiceInput } from '@/lib/validations/content';
import { slugify } from '@/lib/utils';
import { STATUS_LABELS } from '@/lib/constants';
import { ICONS } from '@/components/shared/icon';
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
  PairField,
  SerpPreview,
} from '@/components/admin/form-fields';
import { ImageField } from '@/components/admin/image-field';
import { useToast } from '@/hooks/use-toast';
import type { Service } from '@prisma/client';
import type { ServiceFaq, ServiceStep } from '@/types';

interface ServiceFormProps {
  service?: Service;
}

/** Formulário de criação e edição de serviços. */
export function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: service?.title ?? '',
      slug: service?.slug ?? '',
      shortDescription: service?.shortDescription ?? '',
      description: service?.description ?? '',
      icon: service?.icon ?? 'Sparkles',
      image: service?.image ?? '',
      steps: (service?.steps as unknown as ServiceStep[]) ?? [{ title: '', description: '' }],
      benefits: service?.benefits ?? [],
      faq: (service?.faq as unknown as ServiceFaq[]) ?? [],
      deliverables: service?.deliverables ?? [],
      priceNote: service?.priceNote ?? '',
      featured: service?.featured ?? false,
      order: service?.order ?? 0,
      status: service?.status ?? 'PUBLISHED',
      metaTitle: service?.metaTitle ?? '',
      metaDescription: service?.metaDescription ?? '',
    },
  });

  const values = watch();

  async function onSubmit(data: ServiceInput) {
    setSaving(true);

    try {
      const response = await fetch(service ? `/api/servicos/${service.id}` : '/api/servicos', {
        method: service ? 'PATCH' : 'POST',
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
      if (!service) router.push(`/admin/servicos/${result.data.id}`);
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
          <h1 className="font-serif text-xl">{service ? 'Editar serviço' : 'Novo serviço'}</h1>
          {service ? (
            <p className="text-xs text-muted-foreground">/servicos/{service.slug}</p>
          ) : null}
        </div>

        <div className="flex gap-2">
          {service?.status === 'PUBLISHED' ? (
            <Button asChild variant="outline" size="sm">
              <a href={`/servicos/${service.slug}`} target="_blank" rel="noopener noreferrer">
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
            <Field label="Título" htmlFor="title" required error={errors.title?.message}>
              <Input
                id="title"
                {...register('title')}
                onChange={(event) => {
                  setValue('title', event.target.value);
                  if (!service) setValue('slug', slugify(event.target.value));
                }}
              />
            </Field>

            <Field label="Slug (URL)" htmlFor="slug" required error={errors.slug?.message}>
              <Input id="slug" {...register('slug')} />
            </Field>

            <Field
              label="Descrição curta"
              htmlFor="shortDescription"
              required
              error={errors.shortDescription?.message}
              counter={`${values.shortDescription?.length ?? 0}/400`}
            >
              <Textarea id="shortDescription" rows={3} {...register('shortDescription')} />
            </Field>

            <Field
              label="Descrição completa"
              htmlFor="description"
              required
              error={errors.description?.message}
              hint="Separe os parágrafos com uma linha em branco."
            >
              <Textarea id="description" rows={10} {...register('description')} />
            </Field>
          </FormSection>

          <FormSection
            title="Processo"
            description="As etapas aparecem numeradas na página do serviço. Descreva o que acontece em cada uma."
          >
            <PairField
              label="Etapas"
              values={(values.steps as unknown as ServiceStep[]) ?? []}
              onChange={(next) => setValue('steps', next, { shouldValidate: true })}
              titleLabel="Título da etapa"
              descriptionLabel="O que acontece nesta etapa"
            />
          </FormSection>

          <FormSection title="Perguntas frequentes">
            <PairField
              label="FAQ"
              values={
                ((values.faq as unknown as ServiceFaq[]) ?? []).map((item) => ({
                  title: item.question,
                  description: item.answer,
                })) as { title: string; description: string }[]
              }
              onChange={(next) =>
                setValue(
                  'faq',
                  next.map((item) => ({ question: item.title, answer: item.description })),
                )
              }
              titleLabel="Pergunta"
              descriptionLabel="Resposta"
              hint="As perguntas viram dados estruturados FAQPage — podem aparecer expandidas no Google."
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
              description={values.metaDescription || values.shortDescription}
              path={`/servicos/${values.slug}`}
            />
          </FormSection>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <FormSection title="Publicação">
            <Field label="Status" htmlFor="status">
              <Select
                value={values.status}
                onValueChange={(value) => setValue('status', value as ServiceInput['status'])}
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

            <Field label="Ícone" htmlFor="icon" hint="Ícones da biblioteca lucide-react.">
              <Select value={values.icon} onValueChange={(value) => setValue('icon', value)}>
                <SelectTrigger id="icon">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(ICONS).map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Ordem de exibição" htmlFor="order">
              <Input id="order" type="number" min={0} {...register('order')} />
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

            <Field
              label="Observação sobre preço"
              htmlFor="priceNote"
              hint="Ex.: A partir de R$ 120 por vão."
            >
              <Textarea id="priceNote" rows={2} {...register('priceNote')} />
            </Field>
          </FormSection>

          <FormSection title="Listas">
            <ArrayField
              label="Benefícios"
              values={values.benefits ?? []}
              onChange={(next) => setValue('benefits', next)}
            />

            <ArrayField
              label="Entregáveis"
              values={values.deliverables ?? []}
              onChange={(next) => setValue('deliverables', next)}
            />
          </FormSection>

          <FormSection title="Imagem">
            <ImageField
              label="Imagem"
              folder="servicos"
              aspect="photo"
              value={values.image ?? ''}
              onChange={(url) => setValue('image', url, { shouldValidate: true })}
              error={errors.image?.message}
            />
          </FormSection>
        </div>
      </div>
    </form>
  );
}

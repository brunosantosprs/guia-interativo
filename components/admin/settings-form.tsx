'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Check, Loader2, Save } from 'lucide-react';
import { settingsSchema, type SettingsInput } from '@/lib/validations/settings';
import { THEMES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Field, FormSection } from '@/components/admin/form-fields';
import { ImageField } from '@/components/admin/image-field';
import { useToast } from '@/hooks/use-toast';
import type { SiteSettings } from '@prisma/client';

interface SettingsFormProps {
  settings: SiteSettings;
}

/**
 * Configurações globais do site.
 *
 * Alterar o tema aqui troca a paleta inteira em runtime: o valor é aplicado
 * como `data-theme` no elemento <html> e todas as cores do Tailwind derivam
 * das CSS Custom Properties correspondentes (ver app/globals.css).
 */
export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: settings.siteName,
      tagline: settings.tagline ?? '',
      description: settings.description ?? '',
      logoUrl: settings.logoUrl ?? '',
      faviconUrl: settings.faviconUrl ?? '',
      ogImage: settings.ogImage ?? '',
      theme: settings.theme as SettingsInput['theme'],
      whatsapp: settings.whatsapp,
      whatsappMessage: settings.whatsappMessage ?? '',
      email: settings.email,
      phone: settings.phone ?? '',
      address: settings.address ?? '',
      businessHours: settings.businessHours ?? '',
      instagram: settings.instagram ?? '',
      facebook: settings.facebook ?? '',
      pinterest: settings.pinterest ?? '',
      youtube: settings.youtube ?? '',
      gaMeasurementId: settings.gaMeasurementId ?? '',
      adsenseClientId: settings.adsenseClientId ?? '',
      adsenseEnabled: settings.adsenseEnabled,
      gtmId: settings.gtmId ?? '',
      searchConsoleTag: settings.searchConsoleTag ?? '',
      defaultMetaTitle: settings.defaultMetaTitle ?? '',
      defaultMetaDescription: settings.defaultMetaDescription ?? '',
    },
  });

  const values = watch();

  async function onSubmit(data: SettingsInput) {
    setSaving(true);

    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        toast({
          variant: 'destructive',
          title: 'Não foi possível salvar',
          description: result.error ?? 'Verifique os campos destacados.',
        });
        return;
      }

      toast({
        variant: 'success',
        title: 'Configurações salvas',
        description: 'As páginas principais foram republicadas.',
      });
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
          <h1 className="font-serif text-xl">Configurações</h1>
          <p className="text-xs text-muted-foreground">
            Identidade, contato, tema e integrações do site.
          </p>
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar alterações
        </Button>
      </div>

      <Tabs defaultValue="geral">
        <TabsList className="flex-wrap">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="tema">Tema</TabsTrigger>
          <TabsTrigger value="contato">Contato</TabsTrigger>
          <TabsTrigger value="integracoes">Integrações</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* ================= GERAL ================= */}
        <TabsContent value="geral" className="space-y-6">
          <FormSection title="Identidade do site">
            <Field label="Nome do site" htmlFor="siteName" required error={errors.siteName?.message}>
              <Input id="siteName" {...register('siteName')} />
            </Field>

            <Field label="Slogan" htmlFor="tagline" error={errors.tagline?.message}>
              <Input id="tagline" {...register('tagline')} />
            </Field>

            <Field
              label="Descrição"
              htmlFor="description"
              error={errors.description?.message}
              hint="Usada no rodapé e como descrição padrão em redes sociais."
            >
              <Textarea id="description" rows={3} {...register('description')} />
            </Field>
          </FormSection>

          <FormSection title="Imagens da marca">
            <ImageField
              label="Logotipo"
              folder="marca"
              aspect="wide"
              fit="contain"
              value={values.logoUrl ?? ''}
              onChange={(url) => setValue('logoUrl', url, { shouldValidate: true })}
              error={errors.logoUrl?.message}
              hint="Fundo transparente (PNG ou WebP) fica melhor no cabeçalho. Para logo em SVG, cole o caminho no campo de URL — o upload não aceita SVG."
            />

            <ImageField
              label="Imagem de compartilhamento (OG)"
              folder="marca"
              aspect="video"
              value={values.ogImage ?? ''}
              onChange={(url) => setValue('ogImage', url, { shouldValidate: true })}
              error={errors.ogImage?.message}
              hint="1200×630 px. É a miniatura que aparece no WhatsApp, LinkedIn e X. Use PNG ou JPG — várias redes ignoram SVG."
            />

            <ImageField
              label="Favicon"
              folder="marca"
              aspect="square"
              fit="contain"
              accept="image/png,image/webp"
              value={values.faviconUrl ?? ''}
              onChange={(url) => setValue('faviconUrl', url, { shouldValidate: true })}
              error={errors.faviconUrl?.message}
              hint="PNG quadrado de 512×512 px. Deixe em branco para usar o ícone padrão em app/icon.svg."
            />
          </FormSection>
        </TabsContent>

        {/* ================= TEMA ================= */}
        <TabsContent value="tema" className="space-y-6">
          <FormSection
            title="Paleta de cores"
            description="A troca é imediata e vale para todo o site. As três paletas foram calibradas para manter contraste adequado (WCAG AA) em textos e botões."
          >
            <div className="grid gap-4 md:grid-cols-3">
              {THEMES.map((theme) => {
                const active = values.theme === theme.id;

                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setValue('theme', theme.id as SettingsInput['theme'])}
                    className={cn(
                      'group relative rounded-lg border p-5 text-left transition-all',
                      active
                        ? 'border-accent shadow-soft ring-1 ring-accent'
                        : 'border-border hover:border-accent',
                    )}
                  >
                    {active ? (
                      <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-accent">
                        <Check className="h-3 w-3 text-accent-foreground" />
                      </span>
                    ) : null}

                    <div className="flex gap-1.5">
                      {theme.swatch.map((color) => (
                        <span
                          key={color}
                          className="h-10 w-10 rounded-md border border-border"
                          style={{ backgroundColor: color }}
                          aria-hidden
                        />
                      ))}
                    </div>

                    <p className="mt-4 font-serif text-base">{theme.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {theme.description}
                    </p>
                    <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                      {theme.swatch.join('  ')}
                    </p>
                  </button>
                );
              })}
            </div>
          </FormSection>
        </TabsContent>

        {/* ================= CONTATO ================= */}
        <TabsContent value="contato" className="space-y-6">
          <FormSection
            title="WhatsApp"
            description="Alimenta o botão flutuante presente em todas as páginas públicas e os botões de orçamento."
          >
            <Field
              label="Número"
              htmlFor="whatsapp"
              required
              error={errors.whatsapp?.message}
              hint="Somente números, com DDI e DDD. Exemplo: 5511999999999."
            >
              <Input id="whatsapp" {...register('whatsapp')} />
            </Field>

            <Field
              label="Mensagem inicial"
              htmlFor="whatsappMessage"
              error={errors.whatsappMessage?.message}
              hint="Texto pré-preenchido quando a conversa é aberta."
            >
              <Textarea id="whatsappMessage" rows={2} {...register('whatsappMessage')} />
            </Field>
          </FormSection>

          <FormSection title="Dados de contato">
            <Field label="E-mail" htmlFor="email" required error={errors.email?.message}>
              <Input id="email" type="email" {...register('email')} />
            </Field>

            <Field label="Telefone" htmlFor="phone">
              <Input id="phone" {...register('phone')} />
            </Field>

            <Field label="Horário de atendimento" htmlFor="businessHours">
              <Input
                id="businessHours"
                {...register('businessHours')}
                placeholder="Segunda a sexta, das 9h às 18h"
              />
            </Field>

            <Field label="Endereço" htmlFor="address">
              <Textarea id="address" rows={2} {...register('address')} />
            </Field>
          </FormSection>

          <FormSection title="Redes sociais" description="Deixe em branco para ocultar do rodapé.">
            <Field label="Instagram" htmlFor="instagram" error={errors.instagram?.message}>
              <Input id="instagram" {...register('instagram')} placeholder="https://instagram.com/..." />
            </Field>

            <Field label="Facebook" htmlFor="facebook" error={errors.facebook?.message}>
              <Input id="facebook" {...register('facebook')} />
            </Field>

            <Field label="Pinterest" htmlFor="pinterest" error={errors.pinterest?.message}>
              <Input id="pinterest" {...register('pinterest')} />
            </Field>

            <Field label="YouTube" htmlFor="youtube" error={errors.youtube?.message}>
              <Input id="youtube" {...register('youtube')} />
            </Field>
          </FormSection>
        </TabsContent>

        {/* ================= INTEGRAÇÕES ================= */}
        <TabsContent value="integracoes" className="space-y-6">
          <FormSection
            title="Google Analytics 4"
            description="Deixe vazio em desenvolvimento para não poluir as métricas. A coleta já vai configurada com anonimização de IP."
          >
            <Field
              label="ID de medição"
              htmlFor="gaMeasurementId"
              error={errors.gaMeasurementId?.message}
              hint="Formato G-XXXXXXXXXX."
            >
              <Input id="gaMeasurementId" {...register('gaMeasurementId')} placeholder="G-XXXXXXXXXX" />
            </Field>

            <Field
              label="Google Tag Manager"
              htmlFor="gtmId"
              error={errors.gtmId?.message}
              hint="Opcional. Formato GTM-XXXXXXX."
            >
              <Input id="gtmId" {...register('gtmId')} placeholder="GTM-XXXXXXX" />
            </Field>
          </FormSection>

          <FormSection
            title="Google AdSense"
            description="Os slots de anúncio já estão posicionados no site. Enquanto o AdSense estiver desativado, aparecem apenas espaços reservados discretos."
          >
            <div className="flex items-center justify-between gap-4 rounded-md border border-border p-4">
              <div>
                <Label htmlFor="adsenseEnabled">Exibir anúncios</Label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Ative somente após a aprovação da conta no AdSense.
                </p>
              </div>
              <Switch
                id="adsenseEnabled"
                checked={values.adsenseEnabled}
                onCheckedChange={(checked) => setValue('adsenseEnabled', checked)}
              />
            </div>

            <Field
              label="ID do cliente"
              htmlFor="adsenseClientId"
              error={errors.adsenseClientId?.message}
              hint="Formato ca-pub-0000000000000000."
            >
              <Input
                id="adsenseClientId"
                {...register('adsenseClientId')}
                placeholder="ca-pub-0000000000000000"
              />
            </Field>

            <div className="flex gap-3 rounded-md border border-border bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              <p>
                Os IDs dos blocos de anúncio ficam em{' '}
                <code className="rounded bg-background px-1.5 py-0.5">lib/constants.ts</code>, na
                constante <code className="rounded bg-background px-1.5 py-0.5">ADSENSE_SLOTS</code>
                . Substitua os valores de exemplo pelos slots reais gerados no painel do AdSense.
              </p>
            </div>
          </FormSection>

          <FormSection title="Google Search Console">
            <Field
              label="Código de verificação"
              htmlFor="searchConsoleTag"
              hint="Apenas o valor do content da meta tag google-site-verification."
            >
              <Input id="searchConsoleTag" {...register('searchConsoleTag')} />
            </Field>
          </FormSection>
        </TabsContent>

        {/* ================= SEO ================= */}
        <TabsContent value="seo" className="space-y-6">
          <FormSection
            title="Metadados padrão"
            description="Usados na home e como fallback em páginas sem SEO próprio."
          >
            <Field
              label="Meta título padrão"
              htmlFor="defaultMetaTitle"
              error={errors.defaultMetaTitle?.message}
              counter={`${values.defaultMetaTitle?.length ?? 0}/60 ideal`}
            >
              <Input id="defaultMetaTitle" {...register('defaultMetaTitle')} />
            </Field>

            <Field
              label="Meta descrição padrão"
              htmlFor="defaultMetaDescription"
              error={errors.defaultMetaDescription?.message}
              counter={`${values.defaultMetaDescription?.length ?? 0}/160 ideal`}
            >
              <Textarea id="defaultMetaDescription" rows={3} {...register('defaultMetaDescription')} />
            </Field>
          </FormSection>

          <FormSection title="Recursos automáticos">
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                'Sitemap XML gerado a partir do banco em /sitemap.xml',
                'robots.txt com permissão explícita para o Mediapartners-Google',
                'Dados estruturados JSON-LD (Article, Product, Service, FAQPage, BreadcrumbList)',
                'Canonical automático em todas as páginas',
                'Open Graph e Twitter Card por conteúdo',
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </FormSection>
        </TabsContent>
      </Tabs>
    </form>
  );
}

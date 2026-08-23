import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Youtube, Mail, Phone, Clock } from 'lucide-react';
import { LEGAL_NAV, MAIN_NAV } from '@/lib/constants';
import { NewsletterForm } from '@/components/shared/newsletter-form';
import { formatarCNPJ } from '@/lib/validations/settings';
import type { SiteSettings } from '@prisma/client';

interface FooterProps {
  settings: SiteSettings;
  /** Categorias em destaque para a coluna de conteúdo. */
  topics?: { name: string; slug: string }[];
  /** Páginas marcadas com "Exibir no rodapé" no painel. */
  legalPages?: { title: string; slug: string }[];
}

/**
 * Rodapé institucional.
 *
 * Reúne navegação, conteúdo em destaque, contato e os links legais exigidos
 * pelo Google AdSense (privacidade, termos e cookies), que precisam estar
 * acessíveis a partir de qualquer página do site.
 */
export function Footer({ settings, topics = [], legalPages = [] }: FooterProps) {
  const year = new Date().getFullYear();

  // O banco manda; LEGAL_NAV é apenas a rede de segurança caso ele não responda.
  const legalLinks =
    legalPages.length > 0
      ? legalPages.map((page) => ({ label: page.title, href: `/${page.slug}` }))
      : LEGAL_NAV.map((item) => ({ label: item.label, href: item.href }));

  const socials = [
    { href: settings.instagram, label: 'Instagram', Icon: Instagram },
    { href: settings.facebook, label: 'Facebook', Icon: Facebook },
    { href: settings.youtube, label: 'YouTube', Icon: Youtube },
  ].filter((s) => Boolean(s.href));

  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Marca + newsletter */}
          <div className="lg:col-span-4">
            <Image
              src={settings.logoUrl || '/images/logo.svg'}
              alt={settings.siteName}
              width={200}
              height={44}
              className="h-10 w-auto"
            />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {settings.description ||
                'Conteúdo técnico e verificado sobre cortinas e persianas — para escolher com critério, medir certo e instalar sem erro.'}
            </p>

            <div className="mt-7">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Receba os novos guias
              </p>
              <NewsletterForm className="mt-3" />
            </div>

            {socials.length > 0 ? (
              <div className="mt-7 flex gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background transition-colors hover:border-accent hover:text-accent"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {/* Navegação */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-base">Navegação</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {MAIN_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Conteúdo */}
          <div className="lg:col-span-3">
            <h2 className="font-serif text-base">Conteúdo</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {topics.slice(0, 6).map((topic) => (
                <li key={topic.slug}>
                  <Link
                    href={`/blog?categoria=${topic.slug}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {topic.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/tipos-de-cortinas"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Catálogo de tipos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="lg:col-span-3">
            <h2 className="font-serif text-base">Contato</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                <a
                  href={`mailto:${settings.email}`}
                  className="transition-colors hover:text-foreground"
                >
                  {settings.email}
                </a>
              </li>
              {settings.phone ? (
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <span>{settings.phone}</span>
                </li>
              ) : null}
              {settings.businessHours ? (
                <li className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <span>{settings.businessHours}</span>
                </li>
              ) : null}
            </ul>

            <Link
              href="/contato"
              className="mt-5 inline-flex items-center text-sm font-medium text-foreground underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent"
            >
              Enviar uma mensagem
            </Link>
          </div>
        </div>

        {/* Aviso editorial — transparência exigida pelo AdSense */}
        <div className="mt-14 rounded-md border border-border bg-background p-5">
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Aviso editorial:</strong> o conteúdo
            do {settings.siteName} tem finalidade informativa e não substitui a avaliação
            presencial de um profissional qualificado. Preços e especificações são estimativas de
            mercado e variam por região e fornecedor. Este site exibe publicidade do Google
            AdSense; os anúncios são sempre visualmente distinguíveis do conteúdo editorial e não
            influenciam as recomendações técnicas publicadas.
          </p>
        </div>
      </div>

      {/* Identificação do fornecedor.
          O Código de Defesa do Consumidor exige que quem oferece produto ou
          serviço na internet se identifique de forma clara e acessível, e a
          LGPD exige nomear o controlador dos dados. É também um dos sinais
          de confiança avaliados na revisão do Google AdSense. */}
      {settings.companyName || settings.cnpj || settings.address ? (
        <div className="border-t border-border">
          <div className="container py-5">
            <address className="text-xs not-italic leading-relaxed text-muted-foreground">
              {settings.companyName ? (
                <span className="font-medium text-foreground">{settings.companyName}</span>
              ) : null}
              {settings.companyName && settings.cnpj ? ' · ' : null}
              {settings.cnpj ? <span>CNPJ {formatarCNPJ(settings.cnpj)}</span> : null}
              {settings.address ? (
                <>
                  <br />
                  {settings.address}
                </>
              ) : null}
            </address>
          </div>
        </div>
      ) : null}

      <div className="border-t border-border">
        <div className="container flex flex-col gap-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          {/* Aqui vai a marca, não a razão social — esta já aparece
              identificada logo acima, com CNPJ e endereço. */}
          <p>
            © {year} {settings.siteName}. Todos os direitos reservados.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

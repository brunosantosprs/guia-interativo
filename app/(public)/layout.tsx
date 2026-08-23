import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppFloat } from '@/components/layout/whatsapp-float';
import { CookieConsent } from '@/components/shared/cookie-consent';
import { JsonLd, organizationSchema, websiteSchema } from '@/components/shared/json-ld';
import { getSettings } from '@/lib/settings';
import { prisma } from '@/lib/prisma';

/** Categorias em destaque no rodapé. Falha silenciosa se o banco não responder. */
async function getTopics() {
  try {
    return await prisma.category.findMany({
      select: { name: true, slug: true },
      orderBy: { name: 'asc' },
      take: 6,
    });
  } catch {
    return [];
  }
}

/**
 * Páginas marcadas com "Exibir no rodapé" no painel administrativo.
 * É o que torna o interruptor do CRUD de Páginas efetivo: criar uma nova
 * política e ligá-la no admin já a publica no rodapé, sem tocar em código.
 */
async function getFooterPages() {
  try {
    return await prisma.page.findMany({
      where: { status: 'PUBLISHED', showInFooter: true },
      select: { title: true, slug: true },
      orderBy: [{ menuOrder: 'asc' }, { title: 'asc' }],
    });
  } catch {
    return [];
  }
}

/**
 * Layout do site público.
 * Envolve todas as páginas visíveis ao visitante com cabeçalho, rodapé,
 * botão flutuante de WhatsApp, aviso de cookies e dados estruturados globais.
 */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, topics, legalPages] = await Promise.all([
    getSettings(),
    getTopics(),
    getFooterPages(),
  ]);

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(settings.siteName, settings.logoUrl),
          websiteSchema(settings.siteName),
        ]}
      />

      <Header
        siteName={settings.siteName}
        logoUrl={settings.logoUrl}
        whatsapp={settings.whatsapp}
        whatsappMessage={settings.whatsappMessage}
      />

      {/* pt-[72px] compensa o cabeçalho fixo */}
      <main id="conteudo" className="pt-[72px]">
        {children}
      </main>

      <Footer settings={settings} topics={topics} legalPages={legalPages} />

      <WhatsAppFloat number={settings.whatsapp} message={settings.whatsappMessage} />
      <CookieConsent />
    </>
  );
}

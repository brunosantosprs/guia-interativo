/**
 * Constantes globais do Guia Interativo.
 * Valores estruturais do site (navegacao, temas, rotulos de enums, slots de
 * anuncio). Dados editaveis pelo cliente ficam no banco (SiteSettings).
 */

export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? 'Guia Interativo',
  domain: 'guiainterativo.com',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://guiainterativo.com',
  locale: 'pt_BR',
  language: 'pt-BR',
  tagline: 'O guia definitivo de cortinas e persianas',
  description:
    'Conteudo aprofundado sobre cortinas e persianas: tipos, tecidos, medidas, instalacao, manutencao e escolha ideal para cada ambiente. Guias praticos escritos por especialistas.',
  themeColor: '#F5F0E9',
} as const;

/** Navegacao principal do site publico. */
export const MAIN_NAV = [
  { label: 'Início', href: '/' },
  { label: 'Tipos de Cortinas', href: '/tipos-de-cortinas' },
  { label: 'Serviços', href: '/servicos' },
  { label: 'Blog', href: '/blog' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Contato', href: '/contato' },
] as const;

/**
 * Links institucionais do rodape.
 *
 * Usado apenas como fallback: em operacao normal o rodape le as paginas
 * marcadas com 'Exibir no rodape' no painel administrativo.
 */
export const LEGAL_NAV = [
  { label: 'Política de Privacidade', href: '/politica-de-privacidade' },
  { label: 'Termos de Uso', href: '/termos-de-uso' },
  { label: 'Política de Cookies', href: '/politica-de-cookies' },
  { label: 'Aviso Legal', href: '/aviso-legal' },
  { label: 'Política Editorial', href: '/politica-editorial' },
  { label: 'Direitos Autorais', href: '/direitos-autorais' },
] as const;

/** Navegacao do painel administrativo. */
export const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Posts', href: '/admin/posts', icon: 'FileText' },
  { label: 'Páginas', href: '/admin/pages', icon: 'Files' },
  { label: 'Tipos de Cortinas', href: '/admin/cortinas', icon: 'Blinds' },
  { label: 'Serviços', href: '/admin/servicos', icon: 'Wrench' },
  { label: 'Mídia', href: '/admin/media', icon: 'Image' },
  { label: 'Usuários', href: '/admin/users', icon: 'Users', adminOnly: true },
  { label: 'Configurações', href: '/admin/settings', icon: 'Settings', adminOnly: true },
] as const;

/** Paletas disponiveis — refletidas em app/globals.css via data-theme. */
export const THEMES = [
  {
    id: 'elegante-neutra',
    name: 'Elegante Neutra Premium',
    description: 'Bege claro, grafite profundo e dourado suave. Padrão do site.',
    swatch: ['#F5F0E9', '#2C2C2C', '#C4A77D'],
  },
  {
    id: 'moderna-sofisticada',
    name: 'Moderna Sofisticada',
    description: 'Off-white frio, verde-petróleo escuro e sálvia.',
    swatch: ['#F8F7F4', '#1F2A24', '#8A9A7B'],
  },
  {
    id: 'aconchegante-premium',
    name: 'Aconchegante Premium',
    description: 'Areia quente, marrom café e terracota.',
    swatch: ['#F9F5F0', '#3E2F28', '#B87A5A'],
  },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

/** Rotulos legiveis para o enum LightBlocking. */
export const LIGHT_BLOCKING_LABELS = {
  BAIXO: 'Baixo — filtra a luz',
  MEDIO: 'Médio — difusão equilibrada',
  ALTO: 'Alto — reduz muito a claridade',
  BLACKOUT: 'Blackout — bloqueio quase total',
} as const;

/** Percentual aproximado de bloqueio, usado nas barras visuais. */
export const LIGHT_BLOCKING_LEVEL = {
  BAIXO: 25,
  MEDIO: 55,
  ALTO: 80,
  BLACKOUT: 98,
} as const;

/** Categorias usadas para agrupar os tipos de cortinas. */
export const CURTAIN_CATEGORIES = [
  'Cortinas',
  'Persianas',
  'Painéis e Sistemas',
  'Especiais e Automação',
] as const;

/** Rotulos do enum ContentStatus. */
export const STATUS_LABELS = {
  DRAFT: 'Rascunho',
  PUBLISHED: 'Publicado',
  ARCHIVED: 'Arquivado',
} as const;

export const ROLE_LABELS = {
  ADMIN: 'Administrador',
  EDITOR: 'Editor',
  AUTHOR: 'Autor',
} as const;

export const LEAD_STATUS_LABELS = {
  NOVO: 'Novo',
  EM_ATENDIMENTO: 'Em atendimento',
  RESPONDIDO: 'Respondido',
  ARQUIVADO: 'Arquivado',
} as const;

/**
 * Slots do Google AdSense.
 * Os IDs abaixo sao placeholders: substitua pelos slots reais gerados no
 * painel do AdSense apos a aprovacao da conta. Enquanto
 * NEXT_PUBLIC_ADSENSE_ENABLED for "false", nenhum script e carregado.
 */
export const ADSENSE_SLOTS = {
  /** Faixa horizontal logo abaixo do cabecalho de listagens. */
  topBanner: '1111111111',
  /** Bloco no meio do corpo do artigo (in-article). */
  inArticle: '2222222222',
  /** Bloco lateral fixo em telas grandes. */
  sidebar: '3333333333',
  /** Bloco antes do rodape / lista de relacionados. */
  footer: '4444444444',
  /** Grade de conteudo entre cards de listagem. */
  inFeed: '5555555555',
} as const;

/** Paginação padrão. */
export const POSTS_PER_PAGE = 9;

/** Ordem canônica das colunas de comparação da tabela de tipos. */
export const COMPARISON_COLUMNS = [
  'Tipo',
  'Bloqueio de luz',
  'Melhores ambientes',
  'Manutenção',
  'Faixa de investimento',
] as const;

import type {
  Category,
  ContentStatus,
  CurtainType,
  LightBlocking,
  Media,
  Page,
  Post,
  Role,
  Service,
  SiteSettings,
  Tag,
  User,
} from '@prisma/client';

export type {
  Category,
  ContentStatus,
  CurtainType,
  LightBlocking,
  Media,
  Page,
  Post,
  Role,
  Service,
  SiteSettings,
  Tag,
  User,
};

/** Autor no formato exposto ao site publico (sem hash de senha). */
export type PublicAuthor = Pick<User, 'id' | 'name' | 'image' | 'bio'>;

/** Post com relacionamentos carregados — formato usado em listagens e no artigo. */
export type PostWithRelations = Post & {
  author: PublicAuthor;
  category: Category | null;
  tags: Tag[];
};

/** Card resumido de post (listagens, relacionados, home). */
export type PostCardData = Pick<
  Post,
  | 'id'
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'coverImage'
  | 'coverImageAlt'
  | 'publishedAt'
  | 'readingMinutes'
  | 'featured'
> & {
  category: Pick<Category, 'name' | 'slug' | 'color'> | null;
  author: Pick<User, 'name' | 'image'>;
};

/** Etapa do processo de um servico (campo Json no Prisma). */
export interface ServiceStep {
  title: string;
  description: string;
}

/** Pergunta frequente de um servico (campo Json no Prisma). */
export interface ServiceFaq {
  question: string;
  answer: string;
}

/** Servico com os campos Json ja tipados. */
export type ServiceWithContent = Omit<Service, 'steps' | 'faq'> & {
  steps: ServiceStep[];
  faq: ServiceFaq[];
};

/** Metricas exibidas no dashboard administrativo. */
export interface DashboardStats {
  posts: { total: number; published: number; draft: number };
  pages: number;
  curtainTypes: number;
  services: number;
  media: number;
  users: number;
  messages: { total: number; unread: number };
  totalViews: number;
}

/** Resposta padronizada das rotas de API. */
export type ApiResponse<T = unknown> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; issues?: Record<string, string[]> };

/** Parametros de rota do App Router (Next 14). */
export interface SlugParams {
  params: { slug: string };
}

export interface IdParams {
  params: { id: string };
}

export interface SearchParams {
  searchParams: { [key: string]: string | string[] | undefined };
}

/** Item do sumario flutuante do artigo. */
export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/** Breadcrumb usado no site publico e no JSON-LD. */
export interface Crumb {
  label: string;
  href?: string;
}

/** Formatos de anuncio suportados pelo componente AdSlot. */
export type AdFormat = 'horizontal' | 'rectangle' | 'vertical' | 'fluid' | 'auto';

/**
 * Bloco de anuncio gerenciavel pelo painel (campo Json de SiteSettings).
 *
 * Cada bloco e um anuncio do AdSense (por ID de bloco) OU um trecho de HTML
 * livre (codigo de qualquer rede). Entra no corpo do artigo automaticamente
 * (apos o N-esimo paragrafo) ou onde o autor colar o atalho [[ad:id]].
 */
export interface AdBlock {
  /** Slug curto e estavel: usado no atalho [[ad:id]] e como key de render. */
  id: string;
  /** Rotulo interno exibido no painel ("No meio do artigo"). */
  name: string;
  enabled: boolean;
  type: 'adsense' | 'html';
  /** type === 'adsense': ID do bloco gerado no AdSense (so digitos). */
  adsenseSlot: string;
  /** type === 'adsense': formato/tamanho do bloco. */
  format: AdFormat;
  /** type === 'html': codigo colado da rede de anuncio. */
  html: string;
  /** 'paragraph' = automatico apos N paragrafos; 'manual' = via atalho. */
  placement: 'paragraph' | 'manual';
  /** placement === 'paragraph': insere depois deste paragrafo (padroes 3/6/9). */
  afterParagraph: number;
}

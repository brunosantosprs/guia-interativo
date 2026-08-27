import { z } from 'zod';

/**
 * Schemas Zod compartilhados entre os formularios do painel administrativo
 * (react-hook-form) e os Route Handlers da API. Uma unica fonte de verdade
 * evita divergencia entre validacao de cliente e de servidor.
 */

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const contentStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);
export const lightBlockingSchema = z.enum(['BAIXO', 'MEDIO', 'ALTO', 'BLACKOUT']);
export const roleSchema = z.enum(['ADMIN', 'EDITOR', 'AUTHOR']);

/**
 * Referencia de imagem aceita por todos os formularios.
 *
 * O projeto usa tanto caminhos relativos servidos de /public
 * (ex.: /images/cortinas/persiana-rolo.jpg) quanto URLs completas de CDN.
 * Exigir uma URL absoluta rejeitaria os caminhos locais, que sao o padrao
 * gerado pelo seed.
 */
export const imageRefSchema = z
  .string()
  .refine(
    (value) => value === '' || value.startsWith('/') || /^https?:\/\//.test(value),
    'Informe um caminho iniciado por / ou uma URL completa (https://...)',
  )
  .nullable()
  .optional();

export const slugSchema = z
  .string()
  .min(3, 'O slug precisa de pelo menos 3 caracteres')
  .max(120, 'O slug ficou longo demais')
  .regex(slugRegex, 'Use apenas letras minúsculas, números e hífens');

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------

export const postSchema = z.object({
  title: z.string().min(5, 'O título precisa de pelo menos 5 caracteres').max(160),
  slug: slugSchema,
  excerpt: z
    .string()
    .min(60, 'O resumo deve ter pelo menos 60 caracteres')
    .max(320, 'O resumo deve ter no máximo 320 caracteres'),
  content: z
    .string()
    .min(300, 'Artigos precisam de conteúdo relevante (mín. 300 caracteres)'),
  coverImage: imageRefSchema,
  coverImageAlt: z.string().max(180).or(z.literal('')).nullable().optional(),
  status: contentStatusSchema.default('DRAFT'),
  featured: z.boolean().default(false),
  categoryId: z.string().cuid().nullable().optional(),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().max(70, 'Ideal até 60 caracteres').or(z.literal('')).nullable().optional(),
  metaDescription: z
    .string()
    .max(170, 'Ideal até 160 caracteres')
    .or(z.literal(''))
    .nullable()
    .optional(),
  keywords: z.array(z.string()).default([]),
  canonicalUrl: z.string().url().or(z.literal('')).nullable().optional(),
  publishedAt: z.coerce.date().nullable().optional(),
});

export type PostInput = z.infer<typeof postSchema>;

// ---------------------------------------------------------------------------
// Paginas
// ---------------------------------------------------------------------------

export const pageSchema = z.object({
  title: z.string().min(3).max(160),
  slug: slugSchema,
  content: z.string().min(50, 'A página precisa de conteúdo'),
  excerpt: z.string().max(320).or(z.literal('')).nullable().optional(),
  coverImage: imageRefSchema,
  status: contentStatusSchema.default('PUBLISHED'),
  showInMenu: z.boolean().default(false),
  showInFooter: z.boolean().default(false),
  menuOrder: z.coerce.number().int().min(0).default(0),
  metaTitle: z.string().max(70).or(z.literal('')).nullable().optional(),
  metaDescription: z.string().max(170).or(z.literal('')).nullable().optional(),
});

export type PageInput = z.infer<typeof pageSchema>;

// ---------------------------------------------------------------------------
// Tipos de cortinas
// ---------------------------------------------------------------------------

export const curtainTypeSchema = z.object({
  name: z.string().min(3).max(120),
  slug: slugSchema,
  summary: z.string().min(40, 'Escreva um resumo de ao menos 40 caracteres').max(400),
  description: z
    .string()
    .min(600, 'A descrição rica deve ter entre 180 e 250 palavras'),
  category: z.string().min(3),
  lightBlocking: lightBlockingSchema.default('MEDIO'),
  priceRange: z.string().max(120).or(z.literal('')).nullable().optional(),
  maintenance: z.string().max(400).or(z.literal('')).nullable().optional(),
  materials: z.array(z.string()).default([]),
  advantages: z.array(z.string()).min(1, 'Liste ao menos uma vantagem'),
  disadvantages: z.array(z.string()).min(1, 'Liste ao menos uma desvantagem'),
  bestRooms: z.array(z.string()).min(1, 'Informe ao menos um ambiente'),
  whenToChoose: z.string().min(80, 'Explique quando recomendar este modelo'),
  installation: z.string().or(z.literal('')).nullable().optional(),
  // Guia longo em markdown. Opcional — a ficha continua valendo sozinha.
  content: z.string().or(z.literal('')).nullable().optional(),
  image: imageRefSchema,
  imageAlt: z.string().max(180).or(z.literal('')).nullable().optional(),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
  status: contentStatusSchema.default('PUBLISHED'),
  metaTitle: z.string().max(70).or(z.literal('')).nullable().optional(),
  metaDescription: z.string().max(170).or(z.literal('')).nullable().optional(),
});

export type CurtainTypeInput = z.infer<typeof curtainTypeSchema>;

// ---------------------------------------------------------------------------
// Servicos
// ---------------------------------------------------------------------------

export const serviceStepSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
});

export const serviceFaqSchema = z.object({
  question: z.string().min(6),
  answer: z.string().min(20),
});

export const serviceSchema = z.object({
  title: z.string().min(3).max(140),
  slug: slugSchema,
  shortDescription: z.string().min(40).max(400),
  description: z.string().min(300, 'Descreva o serviço com profundidade'),
  icon: z.string().default('Sparkles'),
  image: imageRefSchema,
  steps: z.array(serviceStepSchema).min(1, 'Descreva ao menos uma etapa'),
  benefits: z.array(z.string()).default([]),
  faq: z.array(serviceFaqSchema).default([]),
  deliverables: z.array(z.string()).default([]),
  priceNote: z.string().max(240).or(z.literal('')).nullable().optional(),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
  status: contentStatusSchema.default('PUBLISHED'),
  metaTitle: z.string().max(70).or(z.literal('')).nullable().optional(),
  metaDescription: z.string().max(170).or(z.literal('')).nullable().optional(),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

// ---------------------------------------------------------------------------
// Midia
// ---------------------------------------------------------------------------

export const mediaSchema = z.object({
  url: z
    .string()
    .min(1, 'Informe a URL ou o caminho da imagem')
    .refine(
      (value) => value.startsWith('/') || /^https?:\/\//.test(value),
      'Informe um caminho iniciado por / ou uma URL completa',
    ),
  filename: z.string().min(1),
  alt: z.string().max(180).or(z.literal('')).nullable().optional(),
  caption: z.string().max(320).or(z.literal('')).nullable().optional(),
  mimeType: z.string().default('image/jpeg'),
  size: z.coerce.number().int().min(0).default(0),
  width: z.coerce.number().int().positive().nullable().optional(),
  height: z.coerce.number().int().positive().nullable().optional(),
  folder: z.string().default('geral'),
});

export type MediaInput = z.infer<typeof mediaSchema>;

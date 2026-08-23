import { z } from 'zod';
import { imageRefSchema, roleSchema } from './content';

/** Schemas de configuracao global, usuarios e contato. */

const optionalUrl = z.string().url('URL inválida').or(z.literal('')).nullable().optional();

/**
 * Valida um CNPJ pelos dígitos verificadores.
 *
 * Checar só o formato não basta: o CNPJ aparece no rodapé e nas políticas
 * legais, identificando o fornecedor. Um número com dígito errado passa
 * despercebido por anos e enfraquece justamente o documento que deveria
 * dar segurança jurídica.
 */
export function cnpjValido(entrada: string): boolean {
  const n = entrada.replace(/\D/g, '');

  if (n.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(n)) return false; // 00000000000000 e afins

  const digito = (base: string, pesos: number[]): number => {
    const soma = base
      .split('')
      .reduce((acc, d, i) => acc + Number(d) * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const d1 = digito(n.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = digito(n.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return d1 === Number(n[12]) && d2 === Number(n[13]);
}

/** Formata 57434556000103 como 57.434.556/0001-03. */
export function formatarCNPJ(entrada: string): string {
  const n = entrada.replace(/\D/g, '').slice(0, 14);
  return n
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export const settingsSchema = z.object({
  siteName: z.string().min(2, 'Informe o nome do site').max(80),
  tagline: z.string().max(160).default(''),
  description: z.string().max(400).default(''),
  logoUrl: imageRefSchema,
  faviconUrl: imageRefSchema,
  ogImage: imageRefSchema,

  theme: z.enum(['elegante-neutra', 'moderna-sofisticada', 'aconchegante-premium']),

  // Identificação da empresa
  companyName: z.string().max(140).or(z.literal('')).nullable().optional(),
  cnpj: z
    .string()
    .refine((v) => v === '' || cnpjValido(v), 'CNPJ inválido — confira os dígitos')
    .or(z.literal(''))
    .nullable()
    .optional(),

  whatsapp: z
    .string()
    .regex(/^\d{12,13}$/, 'Use apenas números com DDI e DDD (ex.: 5511999999999)'),
  whatsappMessage: z.string().max(300).default(''),
  email: z.string().email('E-mail inválido'),
  phone: z.string().max(40).or(z.literal('')).nullable().optional(),
  address: z.string().max(240).or(z.literal('')).nullable().optional(),
  businessHours: z.string().max(240).or(z.literal('')).nullable().optional(),

  instagram: optionalUrl,
  facebook: optionalUrl,
  pinterest: optionalUrl,
  youtube: optionalUrl,

  gaMeasurementId: z
    .string()
    .regex(/^G-[A-Z0-9]{6,}$/, 'Formato esperado: G-XXXXXXXXXX')
    .or(z.literal(''))
    .nullable()
    .optional(),
  adsenseClientId: z
    .string()
    .regex(/^ca-pub-\d{10,20}$/, 'Formato esperado: ca-pub-0000000000000000')
    .or(z.literal(''))
    .nullable()
    .optional(),
  adsenseEnabled: z.boolean().default(false),
  gtmId: z
    .string()
    .regex(/^GTM-[A-Z0-9]{4,}$/, 'Formato esperado: GTM-XXXXXXX')
    .or(z.literal(''))
    .nullable()
    .optional(),
  searchConsoleTag: z.string().max(200).or(z.literal('')).nullable().optional(),

  defaultMetaTitle: z.string().max(70).or(z.literal('')).nullable().optional(),
  defaultMetaDescription: z.string().max(170).or(z.literal('')).nullable().optional(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

// ---------------------------------------------------------------------------
// Usuarios
// ---------------------------------------------------------------------------

export const userCreateSchema = z.object({
  name: z.string().min(3, 'Informe o nome completo').max(120),
  email: z.string().email('E-mail inválido'),
  password: z
    .string()
    .min(8, 'A senha precisa de pelo menos 8 caracteres')
    .max(72, 'A senha é longa demais'),
  role: roleSchema.default('AUTHOR'),
  bio: z.string().max(600).or(z.literal('')).nullable().optional(),
  image: imageRefSchema,
  active: z.boolean().default(true),
});

export const userUpdateSchema = userCreateSchema
  .partial()
  .extend({ password: z.string().min(8).max(72).or(z.literal('')).optional() });

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

export const loginSchema = z.object({
  email: z.string().email('Informe um e-mail válido'),
  password: z.string().min(1, 'Informe a senha'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// Formulario de contato publico
// ---------------------------------------------------------------------------

export const contactSchema = z.object({
  name: z.string().min(3, 'Informe seu nome').max(120),
  email: z.string().email('Informe um e-mail válido'),
  phone: z.string().max(24).or(z.literal('')).optional(),
  subject: z.string().min(3, 'Selecione ou escreva um assunto').max(140),
  message: z
    .string()
    .min(20, 'Conte um pouco mais sobre a sua dúvida (mín. 20 caracteres)')
    .max(3000),
  // Campo honeypot: precisa chegar vazio (bots costumam preencher tudo)
  website: z.string().max(0, 'Falha na verificação anti-spam').optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const subscriberSchema = z.object({
  email: z.string().email('Informe um e-mail válido'),
  name: z.string().max(120).optional(),
});

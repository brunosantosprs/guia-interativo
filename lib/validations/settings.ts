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
    const soma = base.split('').reduce((acc, d, i) => acc + Number(d) * pesos[i], 0);
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

/**
 * Um bloco de anuncio da aba Anuncios (estilo Ad Inserter).
 *
 * Campos de conteudo (adsenseSlot, html) sao OPCIONAIS de proposito: o admin
 * pre-preenche a estrutura (3/6/9 + manual) e completa os IDs depois, e um
 * bloco sem conteudo apenas mostra o espaco reservado (ou nada, no HTML) — nao
 * e erro. Quando preenchido, porem, o formato e validado (evita ID errado que
 * so apareceria como espaco em branco em producao). So ADMIN grava isto.
 */
const adBlockSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(40)
    .regex(/^[a-z0-9_-]+$/i, 'Use apenas letras, números, hífen ou sublinhado'),
  name: z.string().max(80).default(''),
  enabled: z.boolean().default(true),
  type: z.enum(['adsense', 'html']).default('adsense'),
  adsenseSlot: z
    .string()
    .regex(/^\d{6,20}$/, 'O ID do bloco tem apenas números (ex.: 1234567890)')
    .or(z.literal(''))
    .default(''),
  format: z.enum(['horizontal', 'rectangle', 'vertical', 'fluid', 'auto']).default('auto'),
  html: z.string().max(20000, 'Código muito longo').default(''),
  placement: z.enum(['paragraph', 'manual']).default('paragraph'),
  afterParagraph: z.coerce.number().int().min(1).max(50).default(3),
});

export const settingsSchema = z
  .object({
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
    adProvider: z.enum(['none', 'adsense', 'admanager']).default('none'),
    adManagerNetworkCode: z
      .string()
      .regex(/^\d{6,20}$/, 'O código de rede tem apenas números (ex.: 21234567890)')
      .or(z.literal(''))
      .nullable()
      .optional(),
    gtmId: z
      .string()
      .regex(/^GTM-[A-Z0-9]{4,}$/, 'Formato esperado: GTM-XXXXXXX')
      .or(z.literal(''))
      .nullable()
      .optional(),
    /**
     * Linhas extras do ads.txt.
     *
     * Cada linha util segue o formato do IAB:
     *   dominio, ID do publisher, DIRECT|RESELLER[, ID de certificacao]
     *
     * Uma linha malformada nao invalida o arquivo inteiro para os
     * rastreadores, mas e ignorada em silencio — e ninguem descobre ate os
     * anuncios pararem. Por isso a validacao acontece aqui, na hora de salvar.
     */
    adsTxt: z
      .string()
      .max(8000)
      .refine(
        (valor) =>
          valor
            .split('\n')
            .map((linha) => linha.trim())
            .filter((linha) => linha && !linha.startsWith('#'))
            .every((linha) => /^[^,\s]+\s*,\s*[^,\s]+\s*,\s*(DIRECT|RESELLER)\b/i.test(linha)),
        'Cada linha deve seguir: dominio.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0',
      )
      .or(z.literal(''))
      .nullable()
      .optional(),
    searchConsoleTag: z.string().max(200).or(z.literal('')).nullable().optional(),

    /**
     * Blocos de anuncio gerenciados no painel (aba Anuncios). Array Json em
     * SiteSettings — desestruturado antes do emptyToNull na rota (que e raso
     * e estragaria o array). Ate 30 blocos.
     */
    adBlocks: z.array(adBlockSchema).max(30).default([]),

    defaultMetaTitle: z.string().max(70).or(z.literal('')).nullable().optional(),
    defaultMetaDescription: z.string().max(170).or(z.literal('')).nullable().optional(),
  })
  /**
   * Escolher um provedor sem informar o identificador dele deixaria o site
   * tentando servir anuncios de uma conta que nao existe. O sintoma seria
   * espaco em branco no lugar do anuncio, sem erro em lugar nenhum — por
   * isso a checagem acontece aqui, na hora de salvar, e nao em producao.
   */
  .superRefine((valor, ctx) => {
    if (valor.adProvider === 'adsense' && !valor.adsenseClientId?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['adsenseClientId'],
        message: 'Informe o ID do cliente para ativar o AdSense',
      });
    }

    if (valor.adProvider === 'admanager' && !valor.adManagerNetworkCode?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['adManagerNetworkCode'],
        message: 'Informe o código de rede para ativar o Ad Manager',
      });
    }
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

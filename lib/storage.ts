import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { randomBytes } from 'node:crypto';
import { slugify } from '@/lib/utils';

/**
 * Armazenamento de imagens no Supabase Storage.
 *
 * Por que nao gravar em public/uploads: na Vercel o sistema de arquivos das
 * funcoes e efemero e some a cada deploy. Qualquer upload feito pelo painel
 * desapareceria. O Storage resolve isso e ainda serve os arquivos por CDN.
 *
 * A service_role key so existe no servidor — nunca e exposta ao navegador,
 * por isso este modulo nunca deve ser importado por um Client Component.
 */

export const BUCKET = 'media';

/** Tipos aceitos no upload. SVG fica de fora: pode carregar script embutido. */
export const ALLOWED_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
] as const;

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB

const EXTENSION: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
};

/**
 * Identifica o tipo real do arquivo pelos primeiros bytes.
 *
 * O `file.type` que chega na requisicao vem do navegador e e escolhido por
 * quem envia — renomear `payload.html` para `foto.jpg` basta para forjar.
 * Como o Storage serve o arquivo com o content-type que gravamos, aceitar o
 * valor declarado permitiria hospedar HTML no dominio do projeto.
 */
function sniffMime(buffer: Buffer): string | null {
  const startsWith = (...bytes: number[]) =>
    bytes.every((byte, index) => buffer[index] === byte);

  if (startsWith(0xff, 0xd8, 0xff)) return 'image/jpeg';
  if (startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return 'image/png';
  if (startsWith(0x47, 0x49, 0x46, 0x38)) return 'image/gif';

  // WebP e AVIF usam contêineres: RIFF....WEBP e ....ftypavif
  const header = buffer.subarray(0, 16).toString('latin1');
  if (header.startsWith('RIFF') && header.includes('WEBP')) return 'image/webp';
  if (header.includes('ftypavif') || header.includes('ftypavis')) return 'image/avif';

  return null;
}

/**
 * Arquivo recusado por regra de validação — formato, tamanho ou assinatura.
 *
 * Existe como classe própria para a API distinguir "o usuário mandou algo
 * inválido" (400, com explicação) de "algo quebrou aqui dentro" (500).
 * Sem essa distinção, uma recusa legítima aparece como erro interno e a
 * pessoa não sabe o que corrigir.
 */
export class UploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UploadValidationError';
  }
}

/**
 * Endereco do projeto no Supabase.
 *
 * Aceita dois nomes, e a ordem importa. SUPABASE_URL vem primeiro porque
 * este modulo so roda no servidor e nao precisa do prefixo NEXT_PUBLIC_.
 *
 * O prefixo, alias, ja custou caro: variavel NEXT_PUBLIC_ e substituida
 * pelo valor durante o BUILD, enquanto variavel marcada como "Secret" na
 * Vercel so existe em EXECUCAO. Cadastrada como Secret, ela chega vazia ao
 * codigo compilado, e o upload falha em producao dizendo que a variavel
 * nao foi definida — mesmo com ela cadastrada e visivel no painel.
 *
 * Mantemos NEXT_PUBLIC_SUPABASE_URL como alternativa para nao quebrar
 * quem ja tem o .env antigo.
 */
function lerUrl(): string | undefined {
  return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
}

/** Erro de configuração ausente, separado para virar mensagem clara na API. */
export class StorageNotConfiguredError extends Error {
  constructor() {
    const faltando = [
      lerUrl() ? null : 'SUPABASE_URL (ou NEXT_PUBLIC_SUPABASE_URL)',
      process.env.SUPABASE_SERVICE_ROLE_KEY ? null : 'SUPABASE_SERVICE_ROLE_KEY',
    ].filter(Boolean);

    super(
      `Upload indisponível: falta ${faltando.join(' e ')}. ` +
        'Em produção, confira também se a variável não está marcada como ' +
        '"Secret" na Vercel — variável NEXT_PUBLIC_ precisa ser do tipo "Config" ' +
        'para existir durante o build.',
    );
    this.name = 'StorageNotConfiguredError';
  }
}

let cached: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (cached) return cached;

  const url = lerUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) throw new StorageNotConfiguredError();

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}

/** Indica se o upload está habilitado, sem lançar erro. */
export function isStorageConfigured(): boolean {
  return Boolean(lerUrl() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Garante que o bucket existe e é público.
 * Evita um passo manual no painel do Supabase na primeira execução.
 */
async function ensureBucket(client: SupabaseClient): Promise<void> {
  const { data } = await client.storage.getBucket(BUCKET);
  if (data) return;

  const { error } = await client.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: MAX_UPLOAD_BYTES,
    allowedMimeTypes: [...ALLOWED_MIME],
  });

  // Corrida entre dois uploads simultâneos: se já existe, seguimos.
  if (error && !/already exists/i.test(error.message)) {
    throw new Error(`Não foi possível criar o bucket "${BUCKET}": ${error.message}`);
  }
}

/**
 * Monta um nome de arquivo único, previsível e seguro para URL.
 * O sufixo aleatório evita que dois uploads do mesmo arquivo se sobrescrevam.
 */
function buildPath(folder: string, originalName: string, mimeType: string): string {
  const base = slugify(originalName.replace(/\.[^.]+$/, '')) || 'imagem';
  const ext = EXTENSION[mimeType] ?? 'jpg';
  const suffix = randomBytes(4).toString('hex');

  return `${slugify(folder) || 'geral'}/${base.slice(0, 60)}-${suffix}.${ext}`;
}

export interface UploadResult {
  url: string;
  path: string;
  filename: string;
  size: number;
  mimeType: string;
}

/** Envia o arquivo e devolve a URL pública. */
export async function uploadImage(
  file: File,
  folder = 'geral',
): Promise<UploadResult> {
  const client = getClient();

  if (!ALLOWED_MIME.includes(file.type as (typeof ALLOWED_MIME)[number])) {
    throw new UploadValidationError(
      `Formato não aceito (${file.type || 'desconhecido'}). Use JPG, PNG, WebP, AVIF ou GIF.`,
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadValidationError(
      `Arquivo de ${(file.size / 1024 / 1024).toFixed(1)} MB excede o limite de ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`,
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // O tipo real manda. Se os bytes não batem com o declarado, recusamos —
  // e é o tipo detectado que vai para o Storage, nunca o informado.
  const realMime = sniffMime(buffer);

  if (!realMime) {
    throw new UploadValidationError('O arquivo não é uma imagem válida.');
  }

  if (realMime !== file.type) {
    throw new UploadValidationError(
      `O conteúdo do arquivo é ${realMime}, mas foi enviado como ${file.type}. Envie a imagem original.`,
    );
  }

  await ensureBucket(client);

  const path = buildPath(folder, file.name, realMime);

  const { error } = await client.storage.from(BUCKET).upload(path, buffer, {
    contentType: realMime,
    cacheControl: '31536000', // 1 ano — o nome do arquivo já é único
    upsert: false,
  });

  if (error) throw new Error(`Falha no upload: ${error.message}`);

  const { data } = client.storage.from(BUCKET).getPublicUrl(path);

  return {
    url: data.publicUrl,
    path,
    filename: path.split('/').pop() ?? file.name,
    size: buffer.length,
    mimeType: realMime,
  };
}

/**
 * Remove o arquivo do Storage a partir da URL pública.
 * Silencioso para URLs externas ou de /public — não há o que apagar lá.
 */
export async function deleteImageByUrl(url: string): Promise<void> {
  if (!isStorageConfigured()) return;

  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return;

  const path = decodeURIComponent(url.slice(index + marker.length));
  await getClient().storage.from(BUCKET).remove([path]);
}

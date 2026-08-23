import { prisma } from '@/lib/prisma';
import { fail, guard, handleError, ok } from '@/lib/api';
import {
  MAX_UPLOAD_BYTES,
  StorageNotConfiguredError,
  uploadImage,
} from '@/lib/storage';

/**
 * POST /api/media/upload — recebe um arquivo e devolve a URL pública.
 *
 * Corpo: multipart/form-data
 *   file   (obrigatório) — imagem
 *   folder (opcional)    — pasta lógica: cortinas, blog, servicos...
 *   alt    (opcional)    — texto alternativo
 *
 * O arquivo vai para o Supabase Storage e o registro correspondente é criado
 * na biblioteca de mídia, para que a imagem apareça no painel logo em seguida.
 */

// Uploads precisam do runtime Node (Buffer) e não podem ser pré-renderizados.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Margem sobre o limite de 8 MB para o overhead do multipart.
export const maxDuration = 60;

export async function POST(request: Request) {
  const { session, response } = await guard(['ADMIN', 'EDITOR', 'AUTHOR']);
  if (response) return response;

  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (!contentType.includes('multipart/form-data')) {
      return fail('Envie o arquivo como multipart/form-data.', 415);
    }

    const form = await request.formData();
    const file = form.get('file');

    if (!(file instanceof File) || file.size === 0) {
      return fail('Nenhum arquivo recebido.', 400);
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return fail(
        `A imagem tem ${(file.size / 1024 / 1024).toFixed(1)} MB. O limite é ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`,
        413,
      );
    }

    const folder = String(form.get('folder') ?? 'geral');
    const alt = String(form.get('alt') ?? '').trim();

    const uploaded = await uploadImage(file, folder);

    const media = await prisma.media.create({
      data: {
        url: uploaded.url,
        filename: uploaded.filename,
        alt: alt || null,
        mimeType: uploaded.mimeType,
        size: uploaded.size,
        folder,
        uploadedById: session!.user.id,
      },
    });

    return ok(media, 'Imagem enviada.', 201);
  } catch (error) {
    if (error instanceof StorageNotConfiguredError) {
      return fail(error.message, 501);
    }
    // Erros de validação do storage (formato, tamanho) já vêm legíveis
    if (error instanceof Error && /Formato não aceito|excede o limite|Falha no upload/.test(error.message)) {
      return fail(error.message, 400);
    }
    return handleError(error);
  }
}

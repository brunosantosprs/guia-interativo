import type { SiteSettings } from '@prisma/client';
import { formatarCNPJ } from '@/lib/validations/settings';

/**
 * Marcadores substituidos no conteudo das paginas na hora de renderizar.
 *
 * O problema que isso resolve: o e-mail de contato aparecia escrito a mao em
 * dez lugares diferentes das politicas. Trocar o endereco exigiria editar
 * seis paginas uma a uma, e qualquer esquecimento deixaria um canal morto
 * num documento legal — justamente onde o dado precisa estar correto.
 *
 * Agora o texto escreve {{email}} e o valor vem de SiteSettings. Mudar uma
 * vez no painel atualiza o site inteiro.
 */

export const TOKENS_DISPONIVEIS = [
  '{{site}}',
  '{{empresa}}',
  '{{cnpj}}',
  '{{email}}',
  '{{telefone}}',
  '{{endereco}}',
  '{{whatsapp}}',
] as const;

/**
 * Aplica os marcadores ao conteudo.
 *
 * Marcador sem valor correspondente e removido junto com a linha em que
 * aparece sozinho — melhor uma secao a menos do que um documento legal
 * exibindo "{{cnpj}}" para o visitante.
 */
export function applySiteTokens(content: string, settings: SiteSettings): string {
  const valores: Record<string, string> = {
    '{{site}}': settings.siteName,
    '{{empresa}}': settings.companyName ?? settings.siteName,
    '{{cnpj}}': settings.cnpj ? formatarCNPJ(settings.cnpj) : '',
    '{{email}}': settings.email,
    '{{telefone}}': settings.phone ?? '',
    '{{endereco}}': settings.address ?? '',
    '{{whatsapp}}': settings.whatsapp,
  };

  let resultado = content;

  for (const [token, valor] of Object.entries(valores)) {
    if (valor) {
      resultado = resultado.split(token).join(valor);
      continue;
    }

    // Sem valor: descarta a linha inteira se o marcador for o conteúdo dela
    resultado = resultado
      .split('\n')
      .filter((linha) => !(linha.includes(token) && linha.replace(token, '').trim().length < 24))
      .join('\n')
      .split(token)
      .join('');
  }

  return resultado;
}

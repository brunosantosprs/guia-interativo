import { buildArticleNodes } from '@/lib/markdown';
import { AdBlock } from '@/components/shared/ad-block';
import type { AdConfig } from '@/lib/ads';
import type { AdBlock as AdBlockData } from '@/types';
import { cn } from '@/lib/utils';

interface PostContentProps {
  /** Conteúdo em markdown vindo do banco. */
  content: string;
  ads: AdConfig;
  /** Blocos de anúncio configurados no painel (aba Anúncios). */
  blocks?: AdBlockData[];
  className?: string;
}

/**
 * Corpo do artigo.
 *
 * Converte o markdown em HTML no servidor (zero JavaScript enviado ao
 * cliente) e intercala os blocos de anúncio configurados no painel: os de
 * posição automática entram após o N-ésimo parágrafo (3/6/9 por padrão) e os
 * manuais onde o autor colou o atalho `[[ad:id]]`. Sem blocos configurados,
 * renderiza só o texto — nenhum anúncio no meio do artigo.
 *
 * `buildArticleNodes` devolve a sequência ordenada de nós (trechos de HTML e
 * referências a blocos); aqui apenas a percorremos, mantendo a sanitização
 * feita lá dentro.
 */
export function PostContent({ content, ads, blocks = [], className }: PostContentProps) {
  const nodes = buildArticleNodes(content, blocks);
  const byId = new Map(blocks.map((b) => [b.id, b]));

  return (
    <div className={cn('prose-editorial', className)}>
      {nodes.map((node, index) => {
        if (node.kind === 'html') {
          return <div key={index} dangerouslySetInnerHTML={{ __html: node.html }} />;
        }

        const block = byId.get(node.blockId);
        if (!block) return null;

        return (
          <AdBlock key={index} block={block} ads={ads} minHeight={260} className="my-10" />
        );
      })}
    </div>
  );
}

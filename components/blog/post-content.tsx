import { markdownToHtml, splitHtmlAtParagraph } from '@/lib/markdown';
import { AdSlot } from '@/components/shared/ad-slot';
import type { AdConfig } from '@/lib/ads';
import { cn } from '@/lib/utils';

interface PostContentProps {
  /** Conteúdo em markdown vindo do banco. */
  content: string;
  ads: AdConfig;
  /** Insere o bloco in-article após este número de parágrafos. */
  adAfterParagraph?: number;
  className?: string;
}

/**
 * Corpo do artigo.
 *
 * Converte o markdown em HTML no servidor (zero JavaScript enviado ao
 * cliente) e injeta o bloco de anúncio in-article no meio do texto, como
 * recomendam as diretrizes de posicionamento do Google AdSense.
 */
export function PostContent({
  content,
  ads,
  adAfterParagraph = 4,
  className,
}: PostContentProps) {
  const html = markdownToHtml(content);
  const [firstHalf, secondHalf] = splitHtmlAtParagraph(html, adAfterParagraph);

  return (
    <div className={cn('prose-editorial', className)}>
      <div dangerouslySetInnerHTML={{ __html: firstHalf }} />

      {secondHalf ? (
        <>
          <AdSlot
            position="inArticle"
            ads={ads}
            format="fluid"
            minHeight={260}
            className="my-10"
          />
          <div dangerouslySetInnerHTML={{ __html: secondHalf }} />
        </>
      ) : null}
    </div>
  );
}

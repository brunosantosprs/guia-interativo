import { markdownToHtml, splitHtmlAtParagraph } from '@/lib/markdown';
import { AdSlot } from '@/components/shared/adsense';
import { ADSENSE_SLOTS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface PostContentProps {
  /** Conteúdo em markdown vindo do banco. */
  content: string;
  adsenseClientId?: string | null;
  adsenseEnabled?: boolean;
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
  adsenseClientId,
  adsenseEnabled,
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
            slot={ADSENSE_SLOTS.inArticle}
            clientId={adsenseClientId}
            enabled={adsenseEnabled}
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

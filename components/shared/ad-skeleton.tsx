import { cn } from '@/lib/utils';

/**
 * Carregamento exibido enquanto o anúncio não chega.
 *
 * Ele ocupa exatamente a altura que já estava reservada para o anúncio, de
 * modo que nada se move quando o conteúdo real substitui este bloco. É o
 * mesmo motivo pelo qual a altura é reservada desde o início: evitar
 * deslocamento de layout, que o Google mede como CLS.
 *
 * Duas decisões de forma, e as duas são deliberadas:
 *
 * O bloco não imita parágrafo nem imagem. Esqueleto em formato de conteúdo
 * é comum em interface, mas aqui daria a entender que ali vem matéria do
 * site, e o espaço é de publicidade. A política do AdSense pede que o
 * anúncio seja distinguível do editorial, e isso começa antes de ele
 * aparecer.
 *
 * O brilho corre uma vez a cada 1,6 s e some sob prefers-reduced-motion.
 * Animação contínua na periferia da leitura incomoda quem tem sensibilidade
 * vestibular, e o bloco continua legível parado.
 */
export function AdSkeleton({
  minHeight,
  className,
}: {
  minHeight: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-md',
        'border border-border/70 bg-foreground/[0.05]',
        className,
      )}
      style={{ minHeight }}
      aria-hidden="true"
    >
      {/* Faixa de luz que atravessa o bloco, de fora a fora. */}
      <span className="pointer-events-none absolute inset-y-0 left-0 w-full animate-shimmer bg-gradient-to-r from-transparent via-background/60 to-transparent motion-reduce:hidden" />

      <span className="relative text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/40">
        Carregando
      </span>
    </div>
  );
}

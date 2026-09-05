import { cn } from '@/lib/utils';

/**
 * Esqueletos exibidos enquanto uma rota carrega.
 *
 * A regra que orienta o desenho: o esqueleto tem que ter a **forma do que
 * vem depois**. Um carregamento genérico — círculo girando no meio da tela
 * — avisa que algo acontece, mas o conteúdo aparece de repente e o olho
 * precisa se reorientar do zero. Quando as faixas cinza já estão onde vão
 * ficar o título, a imagem e o texto, a troca é quase imperceptível.
 *
 * Nenhuma barra vai até a borda: linha de texto real termina irregular, e
 * bloco retangular perfeito lê como caixa vazia, não como texto chegando.
 */

/** Barra cinza com o brilho correndo por dentro. */
function Barra({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded bg-foreground/[0.07]', className)}>
      <span className="absolute inset-y-0 left-0 w-full animate-shimmer bg-gradient-to-r from-transparent via-background/60 to-transparent motion-reduce:hidden" />
    </div>
  );
}

/** Cabeçalho de seção: rótulo curto, título grande, linha de apoio. */
function CabecalhoFalso() {
  return (
    <div className="space-y-4">
      <Barra className="h-3 w-24" />
      <Barra className="h-9 w-3/4 md:h-11" />
      <Barra className="h-4 w-2/3" />
    </div>
  );
}

/**
 * Artigo e ficha de tipo de cortina: faixa de topo, imagem larga e a
 * coluna de texto com parágrafos de comprimento desigual.
 */
export function ArticleSkeleton() {
  return (
    <div aria-hidden="true">
      <section className="border-b border-border bg-hero-fade">
        <div className="container py-12 md:py-16">
          <Barra className="mb-8 h-3 w-40" />
          <CabecalhoFalso />
        </div>
      </section>

      <section className="container py-14 md:py-16">
        <div className="mx-auto max-w-3xl space-y-10">
          <Barra className="aspect-video w-full rounded-md" />

          {[
            ['w-1/2', ['w-full', 'w-full', 'w-11/12', 'w-4/5']],
            ['w-2/5', ['w-full', 'w-10/12', 'w-full', 'w-3/5']],
            ['w-3/5', ['w-full', 'w-11/12', 'w-2/3']],
          ].map(([titulo, linhas], i) => (
            <div key={i} className="space-y-3">
              <Barra className={cn('mb-5 h-6', titulo as string)} />
              {(linhas as string[]).map((l, j) => (
                <Barra key={j} className={cn('h-4', l)} />
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Listagens: blog, catálogo de tipos e serviços. */
export function ListSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div aria-hidden="true">
      <section className="border-b border-border bg-hero-fade">
        <div className="container py-12 md:py-16">
          <CabecalhoFalso />
        </div>
      </section>

      <section className="container py-14 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cards }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Barra className="aspect-[4/3] w-full rounded-md" />
              <Barra className="h-3 w-20" />
              <Barra className="h-5 w-11/12" />
              <Barra className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

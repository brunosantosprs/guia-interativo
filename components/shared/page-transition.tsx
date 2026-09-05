'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { anunciosPendentes, assinarAnuncios, limparAnuncios } from '@/lib/ad-loading-store';

/**
 * Tela de carregamento da troca de uma página para outra.
 *
 * A saída é amarrada ao que a página está realmente esperando, e não a um
 * tempo fixo. São três condições, todas obrigatórias:
 *
 *   1. a rota nova chegou
 *   2. nenhum bloco de anúncio continua carregando
 *   3. o tempo mínimo em tela foi cumprido
 *
 * A condição 2 é a que o dono do site pediu. Ela usa o registro em
 * lib/ad-loading-store: cada bloco se anota ao montar e se apaga quando o
 * AdSense responde "filled"/"unfilled" ou quando o Ad Manager dispara
 * slotRenderEnded. Em rota sem anúncio nenhum a contagem já nasce zerada e
 * só valem as condições 1 e 3.
 *
 * O teto de espera existe porque anúncio às vezes simplesmente não
 * responde — bloqueador instalado, rede ruim, leilão travado. Sem ele, o
 * visitante ficaria preso numa tela de carregamento por causa de
 * publicidade, que é o pior desfecho possível.
 *
 * Registro honesto do custo: segurar o conteúdo até o anúncio resolver
 * atrasa a leitura em 1 a 3 segundos quando há anúncio na página. Barras
 * de carregamento de sites grandes não fazem isso — elas soltam o conteúdo
 * e deixam o anúncio chegar depois. A escolha aqui é do dono do site, e
 * está concentrada nas constantes abaixo.
 */

/** Piso: abaixo disso a tela pisca e lê como falha grafica. */
const MINIMO_MS = 600;

/** Teto: nunca segurar o conteudo alem disso, aconteca o que acontecer. */
const MAXIMO_MS = 4000;

/** Fade de saida. Precisa bater com a duration da classe. */
const SAIDA_MS = 300;

/** Quanto da barra cabe a rota; o resto cabe aos anuncios. */
const PESO_ROTA = 65;

export function PageTransition() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [ativo, setAtivo] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const [progresso, setProgresso] = useState(0);

  const inicio = useRef(0);
  const rotaChegou = useRef(false);
  const quadro = useRef<number | null>(null);

  const encerrar = useCallback(() => {
    setProgresso(100);
    setSaindo(true);
    window.setTimeout(() => {
      setAtivo(false);
      setSaindo(false);
      setProgresso(0);
    }, SAIDA_MS);
  }, []);

  // Dispara no clique, antes de a navegação começar.
  useEffect(() => {
    function aoClicar(evento: MouseEvent) {
      if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
      if (evento.button !== 0) return;

      const alvo = (evento.target as HTMLElement | null)?.closest('a');
      if (!alvo) return;

      const href = alvo.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      if (alvo.target === '_blank' || alvo.hasAttribute('download')) return;

      const destino = new URL(alvo.href, window.location.href);
      if (destino.origin !== window.location.origin) return;
      if (destino.pathname === window.location.pathname && destino.search === window.location.search)
        return;

      limparAnuncios();
      inicio.current = performance.now();
      rotaChegou.current = false;
      setProgresso(0);
      setSaindo(false);
      setAtivo(true);
    }

    document.addEventListener('click', aoClicar, { capture: true });
    return () => document.removeEventListener('click', aoClicar, { capture: true });
  }, []);

  // A rota nova chegou. Ainda falta o anúncio e o tempo mínimo.
  useEffect(() => {
    if (!ativo) return;
    rotaChegou.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  /**
   * Laço de progresso.
   *
   * Roda em requestAnimationFrame porque a troca de rota ocupa a thread
   * principal e setInterval perde disparos justamente aí — foi o que
   * atrapalhou a medição da barra do topo antes.
   */
  useEffect(() => {
    if (!ativo) return;

    let vivo = true;

    function passo() {
      if (!vivo) return;

      const decorrido = performance.now() - inicio.current;
      const pendentes = anunciosPendentes();

      // Parte da rota: sobe até PESO_ROTA e trava lá até a rota chegar.
      const parteRota = rotaChegou.current
        ? PESO_ROTA
        : Math.min(PESO_ROTA - 5, (decorrido / 500) * PESO_ROTA);

      // Parte do anúncio: só avança depois que a rota chegou.
      const parteAnuncio = !rotaChegou.current
        ? 0
        : pendentes === 0
          ? 100 - PESO_ROTA
          : Math.min(100 - PESO_ROTA - 3, ((decorrido - 300) / 1800) * (100 - PESO_ROTA));

      setProgresso(Math.max(0, Math.min(97, parteRota + parteAnuncio)));

      const pronto = rotaChegou.current && pendentes === 0 && decorrido >= MINIMO_MS;
      const estourou = decorrido >= MAXIMO_MS;

      if (pronto || estourou) {
        vivo = false;
        encerrar();
        return;
      }

      quadro.current = requestAnimationFrame(passo);
    }

    quadro.current = requestAnimationFrame(passo);
    const cancelarAssinatura = assinarAnuncios(() => {});

    return () => {
      vivo = false;
      if (quadro.current) cancelAnimationFrame(quadro.current);
      cancelarAssinatura();
    };
  }, [ativo, encerrar]);

  // Trava a rolagem enquanto a cortina está fechada.
  useEffect(() => {
    if (!ativo) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = anterior;
    };
  }, [ativo]);

  if (!ativo) return null;

  const inteiro = Math.round(progresso);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[190] flex items-center justify-center bg-background',
        'transition-opacity ease-out',
        saindo ? 'opacity-0 duration-300' : 'opacity-100 duration-150',
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex w-full max-w-xs flex-col items-center px-6">
        {/* Marca: os tres tracos do logotipo, subindo em sequencia. */}
        <svg
          width="52"
          height="52"
          viewBox="0 0 52 52"
          fill="none"
          aria-hidden="true"
          className="text-accent"
        >
          {[13, 26, 39].map((x, i) => (
            <rect key={x} x={x - 2.5} y="10" width="5" height="32" rx="2.5" fill="currentColor">
              <animate
                attributeName="opacity"
                values="0.2;1;0.2"
                dur="1.3s"
                begin={`${i * 0.16}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="height"
                values="14;32;14"
                dur="1.3s"
                begin={`${i * 0.16}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="y"
                values="19;10;19"
                dur="1.3s"
                begin={`${i * 0.16}s`}
                repeatCount="indefinite"
              />
            </rect>
          ))}
        </svg>

        <p className="mt-7 font-serif text-lg text-foreground">Carregando seu conteúdo</p>

        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-foreground/[0.08]">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-200 ease-out"
            style={{ width: `${inteiro}%` }}
          />
        </div>

        <span className="mt-3 font-mono text-xs tabular-nums text-muted-foreground">
          {inteiro}%
        </span>
      </div>
    </div>
  );
}

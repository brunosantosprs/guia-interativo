'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Barra de progresso das trocas de página.
 *
 * O problema que ela resolve: no App Router, clicar num link não pinta nada
 * na tela enquanto o servidor não devolve a próxima rota. Em conexão boa
 * isso passa despercebido; em 3G, o visitante clica, não acontece nada
 * visível, e ele clica de novo. A barra dá o retorno no mesmo instante do
 * clique.
 *
 * Por que uma barra e não uma tela de carregamento cobrindo tudo: cobrir a
 * tela esconde o conteúdo que já está pronto e adia a maior pintura da
 * página, que é justamente o que o Google mede como LCP. A barra ocupa
 * três pixels no topo e não disputa espaço com nada.
 *
 * O progresso é simulado, e isso é honesto de dizer: não existe evento de
 * porcentagem numa navegação do Next. A curva desacelera conforme avança e
 * nunca chega sozinha a 100% — só a chegada da nova rota fecha a barra.
 * É o mesmo princípio das barras de carregamento de navegador.
 */

/** Passos da simulacao: avanca rapido no comeco e vai travando. */
const TETO_SIMULADO = 92;
const INTERVALO_MS = 180;

/**
 * Largura com que a barra nasce.
 *
 * Comecou em 8% e era imperceptivel: um fiapo no canto esquerdo que
 * desaparecia antes de o olho registrar. Numa rota estatica ja pre-carregada
 * a navegacao inteira dura menos de 300 ms, entao a barra precisa nascer
 * num tamanho que se enxergue de imediato.
 */
const LARGURA_INICIAL = 22;

/**
 * Tempo minimo em tela.
 *
 * Sem isso, navegacao rapida faz a barra piscar — aparece e some no mesmo
 * quadro, e o efeito lido e de falha grafica, nao de carregamento. Com o
 * piso, ou ela nao aparece, ou ela e vista.
 */
const MINIMO_VISIVEL_MS = 450;

/** Tempo da transicao ate 100% antes de sumir. */
const FECHAMENTO_MS = 260;

export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [progresso, setProgresso] = useState(0);
  const [visivel, setVisivel] = useState(false);
  const timer = useRef<number | null>(null);
  const inicio = useRef<number>(0);

  // Dispara no clique, antes de a navegação começar de fato.
  useEffect(() => {
    function aoClicar(evento: MouseEvent) {
      // Clique com modificador abre em outra aba: a página atual não muda
      if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
      if (evento.button !== 0) return;

      const alvo = (evento.target as HTMLElement | null)?.closest('a');
      if (!alvo) return;

      const href = alvo.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      if (alvo.target === '_blank' || alvo.hasAttribute('download')) return;

      // Link externo troca de site inteiro; quem mostra progresso é o navegador
      const destino = new URL(alvo.href, window.location.href);
      if (destino.origin !== window.location.origin) return;

      // Mesma rota: não há navegação para acompanhar
      if (destino.pathname === window.location.pathname && destino.search === window.location.search)
        return;

      inicio.current = performance.now();
      setVisivel(true);
      setProgresso(LARGURA_INICIAL);
    }

    document.addEventListener('click', aoClicar, { capture: true });
    return () => document.removeEventListener('click', aoClicar, { capture: true });
  }, []);

  // Avanço simulado enquanto a rota não chega.
  useEffect(() => {
    if (!visivel) return;

    timer.current = window.setInterval(() => {
      setProgresso((atual) => {
        if (atual >= TETO_SIMULADO) return atual;
        // Quanto mais perto do teto, menor o passo
        const passo = Math.max(1, (TETO_SIMULADO - atual) * 0.18);
        return Math.min(TETO_SIMULADO, atual + passo);
      });
    }, INTERVALO_MS);

    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [visivel]);

  // A rota mudou: completa e some, respeitando o tempo mínimo em tela.
  useEffect(() => {
    if (!visivel) return;

    const decorrido = performance.now() - inicio.current;
    const esperar = Math.max(0, MINIMO_VISIVEL_MS - decorrido);

    const completar = window.setTimeout(() => setProgresso(100), esperar);
    const sumir = window.setTimeout(() => {
      setVisivel(false);
      setProgresso(0);
    }, esperar + FECHAMENTO_MS);

    return () => {
      window.clearTimeout(completar);
      window.clearTimeout(sumir);
    };
    // Só a mudança de rota deve fechar a barra, não a própria visibilidade
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-[3px]"
      role="progressbar"
      aria-hidden={!visivel}
      aria-label="Carregando página"
    >
      <div
        className="h-full bg-accent shadow-[0_0_10px_rgba(0,0,0,0.15)] transition-[width,opacity] duration-200 ease-out"
        style={{
          width: `${progresso}%`,
          opacity: visivel ? 1 : 0,
        }}
      />
    </div>
  );
}

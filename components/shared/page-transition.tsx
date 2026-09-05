'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

/**
 * Carregamento exibido na troca de uma página para outra.
 *
 * Por que ele é forçado, e não condicionado à demora: as 113 páginas do
 * site são geradas estaticamente e o Next as pré-carrega quando o link
 * entra na tela, então a troca costuma acontecer em menos de 300 ms. O
 * loading.tsx nativo, que só aparece quando há espera de verdade, na
 * prática nunca aparecia. O resultado era a página trocar de conteúdo sem
 * nenhum aviso, o que lê como salto, não como navegação.
 *
 * Aqui a tela de carregamento entra no clique e fica um tempo mínimo,
 * independentemente de a rota já estar pronta.
 *
 * O custo disso é honesto de registrar: uma navegação que levaria 150 ms
 * passa a levar cerca de 600 ms. Não afeta o LCP, que o Google mede apenas
 * no carregamento inicial da página e não nas trocas internas — mas afeta
 * a sensação de velocidade, e é uma troca deliberada por continuidade
 * visual.
 */

/** Tempo em tela antes de revelar a página nova. */
const DURACAO_MINIMA_MS = 620;

/** Fade de saída. Precisa bater com a duration da classe abaixo. */
const SAIDA_MS = 280;

export function PageTransition() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [ativo, setAtivo] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const inicio = useRef(0);

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

      inicio.current = performance.now();
      setSaindo(false);
      setAtivo(true);
    }

    document.addEventListener('click', aoClicar, { capture: true });
    return () => document.removeEventListener('click', aoClicar, { capture: true });
  }, []);

  // A rota chegou: cumpre o tempo mínimo, some e devolve a rolagem ao topo.
  useEffect(() => {
    if (!ativo) return;

    const restante = Math.max(0, DURACAO_MINIMA_MS - (performance.now() - inicio.current));

    const iniciarSaida = window.setTimeout(() => setSaindo(true), restante);
    const encerrar = window.setTimeout(() => {
      setAtivo(false);
      setSaindo(false);
    }, restante + SAIDA_MS);

    return () => {
      window.clearTimeout(iniciarSaida);
      window.clearTimeout(encerrar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Trava a rolagem enquanto a cortina está fechada, senão o leitor rola
  // uma página que ele não está vendo.
  useEffect(() => {
    if (!ativo) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = anterior;
    };
  }, [ativo]);

  if (!ativo) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[190] flex items-center justify-center bg-background',
        'transition-opacity ease-out',
        saindo ? 'opacity-0 duration-[280ms]' : 'opacity-100 duration-150',
      )}
      role="status"
      aria-live="polite"
      aria-label="Carregando página"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Marca desenhada em SVG, com os três traços do logotipo subindo
            em sequência. Repete a linguagem visual do cabeçalho em vez de
            usar um spinner genérico. */}
        <svg
          width="46"
          height="46"
          viewBox="0 0 46 46"
          fill="none"
          aria-hidden="true"
          className="text-accent"
        >
          {[10, 23, 36].map((x, i) => (
            <rect key={x} x={x - 2} y="8" width="4" height="30" rx="2" fill="currentColor">
              <animate
                attributeName="opacity"
                values="0.25;1;0.25"
                dur="1.2s"
                begin={`${i * 0.15}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="height"
                values="14;30;14"
                dur="1.2s"
                begin={`${i * 0.15}s`}
                repeatCount="indefinite"
              />
            </rect>
          ))}
        </svg>

        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Carregando
        </span>
      </div>
    </div>
  );
}

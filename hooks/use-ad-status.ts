'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * Estado de um bloco de anúncio.
 *
 *   carregando  — o script foi chamado, nada voltou ainda
 *   preenchido  — veio anúncio e ele está na tela
 *   vazio       — o leilão não teve vencedor, ou o script nem chegou
 *
 * Por que isso precisa existir: o espaço do anúncio é reservado antes de
 * saber se haverá anúncio, senão a página pula quando ele chega (CLS). Só
 * que reservar sem saber cria dois defeitos visíveis. Enquanto carrega, o
 * leitor vê um retângulo vazio com "Publicidade" escrito em cima. E quando
 * o leilão não é preenchido — o que é rotina, não exceção — esse retângulo
 * vazio fica ali para sempre.
 *
 * Saber o estado permite mostrar um carregamento no primeiro caso e
 * recolher o bloco inteiro no segundo.
 */
export type AdStatus = 'carregando' | 'preenchido' | 'vazio';

/** Depois disso, assume-se que nao vem anuncio nenhum. */
const ESPERA_MAXIMA_MS = 6000;

/**
 * Observa o atributo data-ad-status que o AdSense grava na tag <ins>.
 *
 * O valor chega como "filled" ou "unfilled" algum tempo depois do push,
 * e não existe callback para isso — daí o MutationObserver.
 *
 * O tempo limite cobre o caso em que o atributo nunca aparece: bloqueador
 * de anúncio impedindo o script, rede caída, ou domínio ainda não aprovado.
 * Sem ele, o carregamento ficaria girando eternamente na tela de quem usa
 * bloqueador, que é justamente quem nunca verá anúncio nenhum.
 */
export function useAdSenseStatus(ref: RefObject<HTMLElement | null>): AdStatus {
  const [status, setStatus] = useState<AdStatus>('carregando');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ler = () => {
      const valor = el.getAttribute('data-ad-status');
      if (valor === 'filled') return setStatus('preenchido');
      if (valor === 'unfilled') return setStatus('vazio');
    };

    ler(); // pode já estar resolvido antes do efeito rodar

    const observador = new MutationObserver(ler);
    observador.observe(el, { attributes: true, attributeFilter: ['data-ad-status'] });

    const limite = window.setTimeout(() => {
      setStatus((atual) => (atual === 'carregando' ? 'vazio' : atual));
    }, ESPERA_MAXIMA_MS);

    return () => {
      observador.disconnect();
      window.clearTimeout(limite);
    };
  }, [ref]);

  return status;
}

/**
 * Mesmo estado, para o Google Ad Manager.
 *
 * O GPT tem evento próprio (slotRenderEnded) e informa se o slot voltou
 * vazio, então aqui não é preciso observar o DOM. O tempo limite continua,
 * pelo mesmo motivo do AdSense.
 */
export function useAdManagerStatus(divId: string): AdStatus {
  const [status, setStatus] = useState<AdStatus>('carregando');

  useEffect(() => {
    const googletag = (window.googletag = window.googletag || { cmd: [] });

    // Guardado fora do cmd.push para o cleanup conseguir remover o listener
    let ouvinte: ((evento: { slot: unknown; isEmpty: boolean }) => void) | null = null;

    googletag.cmd.push(() => {
      const pubads = googletag.pubads?.() as
        | {
            addEventListener: (nome: string, fn: (e: never) => void) => void;
            removeEventListener?: (nome: string, fn: (e: never) => void) => void;
          }
        | undefined;
      if (!pubads) return;

      ouvinte = (evento: { slot: unknown; isEmpty: boolean }) => {
        const alvo = evento.slot as { getSlotElementId?: () => string } | null;
        if (alvo?.getSlotElementId?.() !== divId) return;
        setStatus(evento.isEmpty ? 'vazio' : 'preenchido');
      };

      pubads.addEventListener('slotRenderEnded', ouvinte as (e: never) => void);
    });

    const limite = window.setTimeout(() => {
      setStatus((atual) => (atual === 'carregando' ? 'vazio' : atual));
    }, ESPERA_MAXIMA_MS);

    return () => {
      window.clearTimeout(limite);
      if (!ouvinte) return;
      window.googletag?.cmd.push(() => {
        const pubads = window.googletag?.pubads?.() as
          | { removeEventListener?: (nome: string, fn: (e: never) => void) => void }
          | undefined;
        pubads?.removeEventListener?.('slotRenderEnded', ouvinte as (e: never) => void);
      });
    };
  }, [divId]);

  return status;
}

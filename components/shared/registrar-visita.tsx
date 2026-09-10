'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Avisa o servidor que a página foi vista.
 *
 * Fica montado no layout público e dispara a cada troca de rota, porque em
 * navegação client-side o componente não remonta.
 *
 * Duas proteções contra contagem inflada, ambas no navegador:
 * 1. Um atraso curto, que descarta quem abriu e fechou na mesma respiração.
 * 2. Uma marca por caminho no sessionStorage, para recarregar a página várias
 *    vezes na mesma sessão não virar várias visitas.
 */
const ATRASO_MS = 1500;
const PREFIXO = 'visita:';

export function RegistrarVisita() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const chave = PREFIXO + pathname;

    try {
      if (window.sessionStorage.getItem(chave)) return;
    } catch {
      // sessionStorage bloqueado (janela anônima, configuração do navegador).
      // Seguimos sem a proteção de duplicata, que é conveniência, não requisito.
    }

    const temporizador = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(chave, '1');
      } catch {
        // idem
      }

      void fetch('/api/visitas', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ path: pathname }),
        keepalive: true,
      }).catch(() => {
        // Contagem é secundária: nenhum erro aqui pode chegar ao visitante.
      });
    }, ATRASO_MS);

    return () => window.clearTimeout(temporizador);
  }, [pathname]);

  return null;
}

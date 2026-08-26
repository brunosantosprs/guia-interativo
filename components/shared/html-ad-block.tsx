'use client';

import { useEffect, useRef } from 'react';

/**
 * Renderiza o HTML de um bloco de anuncio colado no painel e RE-EXECUTA os
 * seus <script>.
 *
 * `dangerouslySetInnerHTML` injeta o markup, mas o navegador NAO executa
 * <script> inserido por innerHTML — e codigo de rede de anuncio quase sempre
 * depende de um <script>. Por isso, depois de montar, recriamos cada script
 * como um novo elemento (o navegador entao o executa). Tecnica padrao para
 * "colar o codigo de qualquer rede", como faz o Ad Inserter no WordPress.
 *
 * Confianca: apenas ADMIN grava blocos HTML (guard(['ADMIN']) na API), mesmo
 * modelo do Ad Inserter — por isso o conteudo NAO passa por saneamento.
 */
export function HtmlAdBlock({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // Recria cada <script> para que o navegador o execute.
    for (const antigo of Array.from(container.querySelectorAll('script'))) {
      const novo = document.createElement('script');
      for (const attr of Array.from(antigo.attributes)) {
        novo.setAttribute(attr.name, attr.value);
      }
      novo.text = antigo.textContent ?? '';
      antigo.replaceWith(novo);
    }
  }, [html]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}

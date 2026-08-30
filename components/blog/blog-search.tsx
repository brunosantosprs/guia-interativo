'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface BlogSearchProps {
  /** Termo vindo da URL, para o campo abrir preenchido. */
  termo?: string;
  /** Categoria ativa, preservada ao buscar. */
  categoria?: string;
  /** Quantos artigos o termo atual encontrou. */
  encontrados?: number;
  className?: string;
}

/**
 * Busca do blog.
 *
 * Diferente do catálogo de tipos de cortinas, aqui a filtragem acontece no
 * servidor: os artigos são longos e paginados, e trazer todos para o
 * navegador só para filtrar seria desperdício de banda a cada visita.
 *
 * O termo vira parâmetro na URL — o que torna o resultado compartilhável,
 * sobrevive ao botão voltar e continua funcionando com a paginação.
 */
export function BlogSearch({ termo = '', categoria, encontrados, className }: BlogSearchProps) {
  const router = useRouter();
  const [valor, setValor] = useState(termo);

  // Mantém o campo alinhado quando a navegação muda a URL (voltar, limpar
  // filtro, clicar numa categoria).
  useEffect(() => {
    setValor(termo);
  }, [termo]);

  function montarHref(busca: string): string {
    const query = new URLSearchParams();
    if (busca.trim()) query.set('q', busca.trim());
    if (categoria) query.set('categoria', categoria);
    // A página volta para 1: o resultado é outro conjunto de artigos.
    return query.toString() ? `/blog?${query.toString()}` : '/blog';
  }

  function buscar(evento: React.FormEvent) {
    evento.preventDefault();
    router.push(montarHref(valor));
  }

  function limpar() {
    setValor('');
    router.push(montarHref(''));
  }

  return (
    <div className={className}>
      <form onSubmit={buscar} role="search" className="relative">
        {/*
          A lupa é o proprio botao de enviar, por dois motivos: muita gente
          clica nela esperando que busque, e um botao submit no formulario
          garante que o Enter funcione em qualquer navegador.
        */}
        <button
          type="submit"
          aria-label="Buscar"
          className="absolute left-0 top-0 flex h-full w-10 items-center justify-center rounded-l-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Search className="h-4 w-4" aria-hidden />
        </button>
        <Input
          type="search"
          name="q"
          value={valor}
          onChange={(evento) => setValor(evento.target.value)}
          placeholder="Buscar no blog — ex.: blackout, medir janela, quarto de bebê"
          className={cn('bg-background pl-10', valor && 'pr-10')}
          aria-label="Buscar artigos no blog"
        />
        {valor ? (
          <button
            type="button"
            onClick={limpar}
            aria-label="Limpar busca"
            className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </form>

      {termo ? (
        <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
          {encontrados === 0
            ? 'Nenhum artigo encontrado para '
            : `${encontrados} ${encontrados === 1 ? 'artigo encontrado' : 'artigos encontrados'} para `}
          <span className="font-medium text-foreground">“{termo}”</span>
        </p>
      ) : null}
    </div>
  );
}

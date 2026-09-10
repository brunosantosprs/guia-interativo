import Link from 'next/link';
import { ArrowUpRight, BarChart3, Info } from 'lucide-react';
import type { RelatorioGa } from '@/lib/analytics';
import { PERIODOS, type ArtigoVisitado, type PeriodoId, type ResumoVisitas } from '@/lib/visitas';

/**
 * Bloco de audiência do painel.
 *
 * O filtro de período no topo comanda tudo o que está abaixo: os totais, o
 * ranking de artigos da contagem própria e o ranking de páginas do Google
 * Analytics. Ele é um conjunto de links com ?periodo= na URL, e não um
 * componente de cliente — assim o servidor refaz as consultas com a janela
 * certa e o endereço fica compartilhável.
 */

type PaginaVista = { path: string; visualizacoes: number };

const RESUMO_POR_PERIODO: Record<PeriodoId, (r: ResumoVisitas) => number> = {
  hoje: (r) => r.hoje,
  ontem: (r) => r.ontem,
  '7dias': (r) => r.seteDias,
  '30dias': (r) => r.trintaDias,
  tudo: (r) => r.total,
};

export function PainelAudiencia({
  periodo,
  ga,
  visitas,
  artigos,
  paginas,
}: {
  periodo: PeriodoId;
  ga: RelatorioGa;
  visitas: ResumoVisitas;
  artigos: ArtigoVisitado[];
  paginas: PaginaVista[];
}) {
  const rotulo = PERIODOS.find((p) => p.id === periodo)?.label ?? '7 dias';
  const totalPeriodo = RESUMO_POR_PERIODO[periodo](visitas);

  return (
    <section className="space-y-4">
      {/* Filtro de período */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-lg">Audiência</h2>

        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label="Filtrar relatórios por período"
        >
          {PERIODOS.map((item) => (
            <Link
              key={item.id}
              href={`/admin?periodo=${item.id}`}
              scroll={false}
              aria-current={periodo === item.id ? 'true' : undefined}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                periodo === item.id
                  ? 'border-transparent bg-secondary text-secondary-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Totais do período escolhido */}
      <div className="rounded-lg border border-border bg-background">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3.5">
          <h3 className="text-sm font-medium">Páginas vistas · {rotulo}</h3>
          <span className="text-xs text-muted-foreground">
            {visitas.total.toLocaleString('pt-BR')} desde o início da contagem
          </span>
        </header>

        <div className="grid gap-px bg-border sm:grid-cols-3">
          <div className="bg-background px-5 py-4">
            <p className="font-serif text-3xl">{totalPeriodo.toLocaleString('pt-BR')}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Contagem do site · {rotulo.toLowerCase()}
            </p>
          </div>

          <div className="bg-background px-5 py-4">
            <p className="font-serif text-3xl">
              {ga.configurado ? ga.resumo.visualizacoes.toLocaleString('pt-BR') : '—'}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Google Analytics · {rotulo.toLowerCase()}
            </p>
          </div>

          <div className="bg-background px-5 py-4">
            <p className="font-serif text-3xl">
              {ga.configurado ? ga.resumo.visitantes.toLocaleString('pt-BR') : '—'}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">Pessoas diferentes · GA</p>
          </div>
        </div>

        {visitas.total === 0 ? (
          <p className="flex items-start gap-2 border-t border-border px-5 py-3 text-xs leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            A contagem própria começou agora, então 7 e 30 dias só ficam completos com o tempo. O
            Google Analytics, quando conectado, traz o histórico que já existe.
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Ranking da contagem própria */}
        <div className="rounded-lg border border-border bg-background">
          <header className="border-b border-border px-5 py-3.5">
            <h3 className="text-sm font-medium">Mais vistos · {rotulo}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Pela contagem do próprio site</p>
          </header>

          <ol className="divide-y divide-border">
            {artigos.map((artigo, indice) => (
              <li key={artigo.slug}>
                <Link
                  href={`/blog/${artigo.slug}`}
                  target="_blank"
                  className="flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-surface"
                >
                  <span className="w-4 shrink-0 text-xs text-muted-foreground">{indice + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-sm">{artigo.title}</span>
                  <span className="shrink-0 text-sm font-medium">
                    {artigo.visualizacoes.toLocaleString('pt-BR')}
                  </span>
                </Link>
              </li>
            ))}

            {artigos.length === 0 ? (
              <li className="px-5 py-8 text-center text-sm text-muted-foreground">
                Nenhum artigo visitado {rotulo.toLowerCase()}.
              </li>
            ) : null}
          </ol>

          {paginas.length > 0 ? (
            <div className="border-t border-border px-5 py-3">
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                Todas as páginas, inclusive fichas e institucionais
              </p>
              <ul className="space-y-1">
                {paginas.slice(0, 5).map((pagina) => (
                  <li key={pagina.path} className="flex items-center gap-3 text-xs">
                    <span className="min-w-0 flex-1 truncate text-muted-foreground">
                      {pagina.path}
                    </span>
                    <span className="shrink-0 font-medium">
                      {pagina.visualizacoes.toLocaleString('pt-BR')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {/* Ranking do Google Analytics */}
        <div className="rounded-lg border border-border bg-background">
          <header className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <div>
              <h3 className="text-sm font-medium">Google Analytics · {rotulo}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {ga.configurado ? 'Top 10 páginas do site inteiro' : 'Integração pendente'}
              </p>
            </div>
            <BarChart3 className="h-4 w-4 text-accent" strokeWidth={1.6} />
          </header>

          {ga.configurado ? (
            <ol className="divide-y divide-border">
              {ga.topPaginas.map((pagina, indice) => (
                <li key={pagina.path}>
                  <Link
                    href={pagina.path}
                    target="_blank"
                    className="flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-surface"
                  >
                    <span className="w-4 shrink-0 text-xs text-muted-foreground">{indice + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{pagina.titulo}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {pagina.path}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-medium">
                      {pagina.visualizacoes.toLocaleString('pt-BR')}
                    </span>
                  </Link>
                </li>
              ))}

              {ga.topPaginas.length === 0 ? (
                <li className="px-5 py-8 text-center text-sm text-muted-foreground">
                  Sem dados {rotulo.toLowerCase()}.
                </li>
              ) : null}
            </ol>
          ) : (
            <div className="space-y-3 px-5 py-5">
              <p className="text-sm leading-relaxed text-muted-foreground">{ga.motivo}</p>

              <ol className="space-y-1.5 text-xs leading-relaxed text-muted-foreground">
                <li>
                  1. No Google Cloud, crie uma conta de serviço e ative a{' '}
                  <span className="font-medium text-foreground">Google Analytics Data API</span>.
                </li>
                <li>
                  2. Gere uma chave JSON dessa conta e guarde o arquivo. Ele não vai para o
                  repositório.
                </li>
                <li>
                  3. No Google Analytics, em Administrador · Acesso à propriedade, adicione o e-mail
                  da conta de serviço como{' '}
                  <span className="font-medium text-foreground">Leitor</span>.
                </li>
                <li>
                  4. Copie do JSON o <code className="rounded bg-surface px-1">client_email</code> e
                  a <code className="rounded bg-surface px-1">private_key</code>, e o número da
                  propriedade em Administrador · Detalhes da propriedade.
                </li>
                <li>
                  5. Coloque no <code className="rounded bg-surface px-1">.env</code> como{' '}
                  <code className="rounded bg-surface px-1">GA_PROPERTY_ID</code>,{' '}
                  <code className="rounded bg-surface px-1">GA_CLIENT_EMAIL</code> e{' '}
                  <code className="rounded bg-surface px-1">GA_PRIVATE_KEY</code>.
                </li>
              </ol>

              <a
                href="https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-foreground transition-colors hover:text-accent"
              >
                Abrir o Google Cloud
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import { ArrowUpRight, BarChart3, Info } from 'lucide-react';
import type { RelatorioGa } from '@/lib/analytics';
import type { ArtigoVisitado, ResumoVisitas } from '@/lib/visitas';

/**
 * Bloco de audiência do painel: números por período e as páginas mais vistas.
 *
 * Duas fontes lado a lado, cada uma no que faz melhor. O Google Analytics
 * traz o histórico que já existe e o ranking do site inteiro; a contagem
 * própria traz o número por artigo, sem depender de bloqueador de anúncios.
 */

function Numero({ valor }: { valor: number }) {
  return <span className="font-serif text-2xl">{valor.toLocaleString('pt-BR')}</span>;
}

export function PainelAudiencia({
  ga,
  visitas,
  artigos,
}: {
  ga: RelatorioGa;
  visitas: ResumoVisitas;
  artigos: ArtigoVisitado[];
}) {
  const proprios = [
    { label: 'Hoje', valor: visitas.hoje },
    { label: 'Ontem', valor: visitas.ontem },
    { label: '7 dias', valor: visitas.seteDias },
    { label: '30 dias', valor: visitas.trintaDias },
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 className="font-serif text-lg">Audiência</h2>
        <p className="text-xs text-muted-foreground">
          Contagem própria desde a instalação · Google Analytics com o histórico completo
        </p>
      </div>

      {/* Períodos, contagem própria */}
      <div className="rounded-lg border border-border bg-background">
        <header className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h3 className="text-sm font-medium">Páginas vistas (contagem do site)</h3>
          <span className="text-xs text-muted-foreground">
            {visitas.total.toLocaleString('pt-BR')} no total
          </span>
        </header>

        <div className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
          {proprios.map((item) => (
            <div key={item.label} className="px-5 py-4">
              <Numero valor={item.valor} />
              <p className="mt-0.5 text-xs text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>

        {visitas.total === 0 ? (
          <p className="flex items-start gap-2 border-t border-border px-5 py-3 text-xs leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Ainda sem registros. A contagem começa a partir da primeira visita depois desta
            atualização, então os números de 7 e 30 dias só ficam completos com o tempo.
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top artigos, contagem própria */}
        <div className="rounded-lg border border-border bg-background">
          <header className="border-b border-border px-5 py-3.5">
            <h3 className="text-sm font-medium">Artigos mais vistos · 30 dias</h3>
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
              <li className="px-5 py-10 text-center text-sm text-muted-foreground">
                Nenhuma visita registrada ainda.
              </li>
            ) : null}
          </ol>
        </div>

        {/* Google Analytics */}
        <div className="rounded-lg border border-border bg-background">
          <header className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <div>
              <h3 className="text-sm font-medium">Google Analytics</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {ga.configurado ? 'Top 10 páginas · 30 dias' : 'Integração pendente'}
              </p>
            </div>
            <BarChart3 className="h-4 w-4 text-accent" strokeWidth={1.6} />
          </header>

          {ga.configurado ? (
            <>
              <div className="grid grid-cols-2 divide-x divide-y divide-border border-b border-border sm:grid-cols-4 sm:divide-y-0">
                {ga.periodos.map((periodo) => (
                  <div key={periodo.id} className="px-4 py-3">
                    <p className="font-serif text-xl">
                      {periodo.visualizacoes.toLocaleString('pt-BR')}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {periodo.label} · {periodo.visitantes.toLocaleString('pt-BR')} pessoas
                    </p>
                  </div>
                ))}
              </div>

              <ol className="divide-y divide-border">
                {ga.topPaginas.map((pagina, indice) => (
                  <li key={pagina.path}>
                    <Link
                      href={pagina.path}
                      target="_blank"
                      className="flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-surface"
                    >
                      <span className="w-4 shrink-0 text-xs text-muted-foreground">
                        {indice + 1}
                      </span>
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
                  <li className="px-5 py-10 text-center text-sm text-muted-foreground">
                    Sem dados no período.
                  </li>
                ) : null}
              </ol>
            </>
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
                  da conta de serviço como <span className="font-medium text-foreground">Leitor</span>.
                </li>
                <li>
                  4. Copie do JSON o <code className="rounded bg-surface px-1">client_email</code> e a{' '}
                  <code className="rounded bg-surface px-1">private_key</code>, e o número da
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

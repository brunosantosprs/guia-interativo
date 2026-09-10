import { BetaAnalyticsDataClient } from '@google-analytics/data';

/**
 * Leitura do Google Analytics 4 para o painel.
 *
 * O GA já roda no site pelo script de medição, que só envia dados. Para
 * ler de volta é preciso a Data API, e ela usa uma credencial de serviço,
 * independente da tag: três variáveis de ambiente, descritas no README.
 *
 *   GA_PROPERTY_ID   — o número da propriedade, não o G-XXXXXXXX
 *   GA_CLIENT_EMAIL  — o e-mail da conta de serviço
 *   GA_PRIVATE_KEY   — a chave privada dessa conta
 *
 * Enquanto elas não existirem, `configurado` é falso e o painel mostra o
 * passo a passo em vez de um gráfico vazio.
 */

export type PeriodoId = 'hoje' | 'ontem' | '7dias' | '30dias';

export const PERIODOS: { id: PeriodoId; label: string; inicio: string; fim: string }[] = [
  { id: 'hoje', label: 'Hoje', inicio: 'today', fim: 'today' },
  { id: 'ontem', label: 'Ontem', inicio: 'yesterday', fim: 'yesterday' },
  { id: '7dias', label: '7 dias', inicio: '7daysAgo', fim: 'today' },
  { id: '30dias', label: '30 dias', inicio: '30daysAgo', fim: 'today' },
];

export type ResumoPeriodo = {
  id: PeriodoId;
  label: string;
  visualizacoes: number;
  visitantes: number;
};

export type PaginaTop = {
  path: string;
  titulo: string;
  visualizacoes: number;
};

export type RelatorioGa =
  | { configurado: false; motivo: string }
  | { configurado: true; periodos: ResumoPeriodo[]; topPaginas: PaginaTop[] };

function credenciais() {
  const propertyId = process.env.GA_PROPERTY_ID?.trim();
  const clientEmail = process.env.GA_CLIENT_EMAIL?.trim();
  // A chave vem do .env com \n escapado; o cliente precisa das quebras reais.
  const privateKey = process.env.GA_PRIVATE_KEY?.trim().replace(/\\n/g, '\n');

  if (!propertyId || !clientEmail || !privateKey) return null;

  return { propertyId, clientEmail, privateKey };
}

let clienteEmCache: BetaAnalyticsDataClient | null = null;

function cliente(clientEmail: string, privateKey: string) {
  clienteEmCache ??= new BetaAnalyticsDataClient({
    credentials: { client_email: clientEmail, private_key: privateKey },
  });

  return clienteEmCache;
}

const numero = (valor?: string | null) => Number(valor ?? 0) || 0;

/**
 * Busca os quatro períodos e as dez páginas mais vistas nos últimos 30 dias.
 *
 * Uma única chamada de rede para os períodos, usando dateRanges múltiplos, e
 * outra para o ranking.
 */
export async function relatorioGa(): Promise<RelatorioGa> {
  const config = credenciais();

  if (!config) {
    return {
      configurado: false,
      motivo:
        'Faltam as variáveis GA_PROPERTY_ID, GA_CLIENT_EMAIL e GA_PRIVATE_KEY. Sem elas o painel não consegue ler os dados que o Google já está coletando.',
    };
  }

  try {
    const api = cliente(config.clientEmail, config.privateKey);
    const property = `properties/${config.propertyId}`;

    const [resumo, ranking] = await Promise.all([
      api.runReport({
        property,
        dateRanges: PERIODOS.map((p) => ({
          startDate: p.inicio,
          endDate: p.fim,
          name: p.id,
        })),
        metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }],
      }),
      api.runReport({
        property,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),
    ]);

    // Com vários dateRanges, cada linha traz a dimensão implícita dateRange.
    const linhas = resumo[0].rows ?? [];

    const periodos: ResumoPeriodo[] = PERIODOS.map((periodo, indice) => {
      const linha =
        linhas.find((item) => item.dimensionValues?.[0]?.value === periodo.id) ?? linhas[indice];

      return {
        id: periodo.id,
        label: periodo.label,
        visualizacoes: numero(linha?.metricValues?.[0]?.value),
        visitantes: numero(linha?.metricValues?.[1]?.value),
      };
    });

    const topPaginas: PaginaTop[] = (ranking[0].rows ?? []).map((linha) => ({
      path: linha.dimensionValues?.[0]?.value ?? '/',
      titulo: (linha.dimensionValues?.[1]?.value ?? '').split(' | ')[0] || '—',
      visualizacoes: numero(linha.metricValues?.[0]?.value),
    }));

    return { configurado: true, periodos, topPaginas };
  } catch (error) {
    return {
      configurado: false,
      motivo:
        error instanceof Error
          ? `O Google recusou a consulta: ${error.message}`
          : 'Não foi possível consultar o Google Analytics.',
    };
  }
}

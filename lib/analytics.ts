import { BetaAnalyticsDataClient } from '@google-analytics/data';
import type { PeriodoId } from '@/lib/visitas';

/**
 * Leitura do Google Analytics 4 para o painel.
 *
 * O GA já roda no site pelo script de medição, que só envia dados. Para
 * ler de volta é preciso a Data API, e ela usa uma credencial de serviço,
 * independente da tag: três variáveis de ambiente, descritas no .env.example.
 *
 *   GA_PROPERTY_ID   — o número da propriedade, não o G-XXXXXXXX
 *   GA_CLIENT_EMAIL  — o e-mail da conta de serviço
 *   GA_PRIVATE_KEY   — a chave privada dessa conta
 *
 * Enquanto elas não existirem, `configurado` é falso e o painel mostra o
 * passo a passo em vez de um gráfico vazio.
 */

export type ResumoPeriodo = {
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
  | { configurado: true; resumo: ResumoPeriodo; topPaginas: PaginaTop[] };

/** O mesmo período do filtro, traduzido para a linguagem de datas do GA. */
function intervalo(periodo: PeriodoId): { startDate: string; endDate: string } {
  switch (periodo) {
    case 'hoje':
      return { startDate: 'today', endDate: 'today' };
    case 'ontem':
      return { startDate: 'yesterday', endDate: 'yesterday' };
    case '7dias':
      return { startDate: '7daysAgo', endDate: 'today' };
    case '30dias':
      return { startDate: '30daysAgo', endDate: 'today' };
    case 'tudo':
      // O GA4 guarda no máximo 14 meses no padrão da conta.
      return { startDate: '2020-01-01', endDate: 'today' };
  }
}

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

/** Totais e as dez páginas mais vistas no período escolhido. */
export async function relatorioGa(periodo: PeriodoId = '7dias'): Promise<RelatorioGa> {
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
    const dateRanges = [intervalo(periodo)];

    const [resumo, ranking] = await Promise.all([
      api.runReport({
        property,
        dateRanges,
        metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }],
      }),
      api.runReport({
        property,
        dateRanges,
        dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),
    ]);

    const linha = resumo[0].rows?.[0];

    const topPaginas: PaginaTop[] = (ranking[0].rows ?? []).map((item) => ({
      path: item.dimensionValues?.[0]?.value ?? '/',
      titulo: (item.dimensionValues?.[1]?.value ?? '').split(' | ')[0] || '—',
      visualizacoes: numero(item.metricValues?.[0]?.value),
    }));

    return {
      configurado: true,
      resumo: {
        visualizacoes: numero(linha?.metricValues?.[0]?.value),
        visitantes: numero(linha?.metricValues?.[1]?.value),
      },
      topPaginas,
    };
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

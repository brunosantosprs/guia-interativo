import { prisma } from '@/lib/prisma';

/**
 * Relatórios da contagem própria, lidos da tabela page_views.
 *
 * Convivem com os números do Google Analytics no painel. A diferença entre
 * as duas fontes é esperada e tem explicação: o GA não conta quem usa
 * bloqueador de anúncios nem quem recusa os cookies, e esta contagem conta.
 */

export type PeriodoId = 'hoje' | 'ontem' | '7dias' | '30dias' | 'tudo';

export const PERIODOS: { id: PeriodoId; label: string }[] = [
  { id: 'hoje', label: 'Hoje' },
  { id: 'ontem', label: 'Ontem' },
  { id: '7dias', label: '7 dias' },
  { id: '30dias', label: '30 dias' },
  { id: 'tudo', label: 'Tudo' },
];

/** Aceita qualquer coisa vinda da URL e devolve um período válido. */
export function periodoValido(valor?: string | string[]): PeriodoId {
  const bruto = Array.isArray(valor) ? valor[0] : valor;
  const encontrado = PERIODOS.find((p) => p.id === bruto);
  return encontrado?.id ?? '7dias';
}

export type ResumoVisitas = {
  hoje: number;
  ontem: number;
  seteDias: number;
  trintaDias: number;
  total: number;
};

export type ArtigoVisitado = {
  title: string;
  slug: string;
  visualizacoes: number;
};

/** Meia-noite de hoje no fuso de São Paulo, em UTC. */
function inicioDoDia(diasAtras = 0) {
  const agora = new Date();
  const saoPaulo = new Date(agora.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));

  saoPaulo.setHours(0, 0, 0, 0);
  saoPaulo.setDate(saoPaulo.getDate() - diasAtras);

  const deslocamento = agora.getTime() - saoPaulo.getTime();
  return new Date(agora.getTime() - deslocamento);
}

/**
 * Traduz o período escolhido para uma janela de datas.
 *
 * "Ontem" é o único fechado dos dois lados: vai da meia-noite de ontem até a
 * meia-noite de hoje. Os demais são abertos no fim, terminando agora.
 */
export function janela(periodo: PeriodoId): { gte?: Date; lt?: Date } {
  switch (periodo) {
    case 'hoje':
      return { gte: inicioDoDia(0) };
    case 'ontem':
      return { gte: inicioDoDia(1), lt: inicioDoDia(0) };
    case '7dias':
      return { gte: inicioDoDia(7) };
    case '30dias':
      return { gte: inicioDoDia(30) };
    case 'tudo':
      return {};
  }
}

export async function resumoVisitas(): Promise<ResumoVisitas> {
  const [aHoje, aOntem, aSete, aTrinta, total] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: janela('hoje') } }),
    prisma.pageView.count({ where: { createdAt: janela('ontem') } }),
    prisma.pageView.count({ where: { createdAt: janela('7dias') } }),
    prisma.pageView.count({ where: { createdAt: janela('30dias') } }),
    prisma.pageView.count(),
  ]);

  return { hoje: aHoje, ontem: aOntem, seteDias: aSete, trintaDias: aTrinta, total };
}

/** Os artigos mais vistos pela contagem própria, no período escolhido. */
export async function artigosMaisVistos(
  periodo: PeriodoId = '30dias',
  quantidade = 10,
): Promise<ArtigoVisitado[]> {
  const createdAt = janela(periodo);

  const agrupado = await prisma.pageView.groupBy({
    by: ['postId'],
    where: {
      postId: { not: null },
      ...(Object.keys(createdAt).length ? { createdAt } : {}),
    },
    _count: { postId: true },
    orderBy: { _count: { postId: 'desc' } },
    take: quantidade,
  });

  if (agrupado.length === 0) return [];

  const ids = agrupado.map((linha) => linha.postId!).filter(Boolean);

  const posts = await prisma.post.findMany({
    where: { id: { in: ids } },
    select: { id: true, title: true, slug: true },
  });

  const porId = new Map(posts.map((post) => [post.id, post]));

  return agrupado
    .map((linha) => {
      const post = porId.get(linha.postId!);
      if (!post) return null;

      return {
        title: post.title,
        slug: post.slug,
        visualizacoes: linha._count.postId,
      };
    })
    .filter((item): item is ArtigoVisitado => item !== null);
}

/** As páginas mais vistas no período, artigos e não-artigos juntos. */
export async function paginasMaisVistas(periodo: PeriodoId = '30dias', quantidade = 10) {
  const createdAt = janela(periodo);

  const agrupado = await prisma.pageView.groupBy({
    by: ['path'],
    ...(Object.keys(createdAt).length ? { where: { createdAt } } : {}),
    _count: { path: true },
    orderBy: { _count: { path: 'desc' } },
    take: quantidade,
  });

  return agrupado.map((linha) => ({
    path: linha.path,
    visualizacoes: linha._count.path,
  }));
}

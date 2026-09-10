import { prisma } from '@/lib/prisma';

/**
 * Relatórios da contagem própria, lidos da tabela page_views.
 *
 * Convivem com os números do Google Analytics no painel. A diferença entre
 * as duas fontes é esperada e tem explicação: o GA não conta quem usa
 * bloqueador de anúncios nem quem recusa os cookies, e esta contagem conta.
 */

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

export async function resumoVisitas(): Promise<ResumoVisitas> {
  const hoje = inicioDoDia(0);
  const ontem = inicioDoDia(1);
  const sete = inicioDoDia(7);
  const trinta = inicioDoDia(30);

  const [aHoje, aOntem, aSete, aTrinta, total] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: hoje } } }),
    prisma.pageView.count({ where: { createdAt: { gte: ontem, lt: hoje } } }),
    prisma.pageView.count({ where: { createdAt: { gte: sete } } }),
    prisma.pageView.count({ where: { createdAt: { gte: trinta } } }),
    prisma.pageView.count(),
  ]);

  return { hoje: aHoje, ontem: aOntem, seteDias: aSete, trintaDias: aTrinta, total };
}

/** Os artigos mais vistos pela contagem própria, na janela informada. */
export async function artigosMaisVistos(dias = 30, quantidade = 10): Promise<ArtigoVisitado[]> {
  const desde = inicioDoDia(dias);

  const agrupado = await prisma.pageView.groupBy({
    by: ['postId'],
    where: { postId: { not: null }, createdAt: { gte: desde } },
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

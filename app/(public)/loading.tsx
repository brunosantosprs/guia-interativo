import { ListSkeleton } from '@/components/shared/page-skeleton';

/**
 * Carregamento padrao das rotas publicas.
 *
 * O App Router usa este arquivo como fronteira de Suspense: ele aparece no
 * instante do clique e sai quando a rota termina de renderizar no servidor.
 * Rotas com forma propria (artigo, ficha) trazem o proprio loading.tsx.
 */
export default function Loading() {
  return <ListSkeleton />;
}

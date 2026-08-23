'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExternalLink, Loader2, Pencil, Search, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { STATUS_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { ContentStatus } from '@prisma/client';

export interface ContentRow {
  id: string;
  title: string;
  /** Linha secundária: slug, categoria, resumo curto. */
  subtitle?: string;
  status?: ContentStatus;
  /** Informações extras exibidas em colunas próprias. */
  meta?: { label: string; value: string }[];
  editHref: string;
  /** Link para a página pública correspondente. */
  viewHref?: string;
}

interface ContentTableProps {
  rows: ContentRow[];
  /** Endpoint base do recurso, ex.: /api/posts. */
  endpoint: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  /** Rótulo do item no singular, usado nas mensagens de confirmação. */
  itemLabel?: string;
  /** Colunas extras exibidas no cabeçalho (mesma ordem de `meta`). */
  metaColumns?: string[];
}

/**
 * Tabela reutilizável de conteúdo do painel.
 *
 * Concentra busca, filtro por status e exclusão com confirmação — as três
 * operações que se repetem em Posts, Páginas, Tipos de Cortinas e Serviços.
 */
export function ContentTable({
  rows,
  endpoint,
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'Nenhum registro encontrado.',
  itemLabel = 'registro',
  metaColumns = [],
}: ContentTableProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'TODOS'>('TODOS');
  const [target, setTarget] = useState<ContentRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const hasStatus = rows.some((row) => row.status);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (statusFilter !== 'TODOS' && row.status !== statusFilter) return false;
      if (!term) return true;
      return `${row.title} ${row.subtitle ?? ''}`.toLowerCase().includes(term);
    });
  }, [rows, query, statusFilter]);

  async function handleDelete() {
    if (!target) return;
    setDeleting(true);

    try {
      const response = await fetch(`${endpoint}/${target.id}`, { method: 'DELETE' });
      const result = await response.json();

      if (!response.ok || !result.success) {
        toast({
          variant: 'destructive',
          title: 'Não foi possível excluir',
          description: result.error ?? 'Tente novamente.',
        });
        return;
      }

      toast({ variant: 'success', title: 'Excluído', description: result.message });
      setTarget(null);
      router.refresh();
    } catch {
      toast({ variant: 'destructive', title: 'Falha de conexão' });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="bg-background pl-10"
          />
        </div>

        {hasStatus ? (
          <div className="flex gap-1.5">
            {(['TODOS', 'PUBLISHED', 'DRAFT', 'ARCHIVED'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStatusFilter(option)}
                aria-pressed={statusFilter === option}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                  statusFilter === option
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-border bg-background text-muted-foreground hover:border-accent',
                )}
              >
                {option === 'TODOS' ? 'Todos' : STATUS_LABELS[option]}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <p className="mt-4 text-xs text-muted-foreground" aria-live="polite">
        {filtered.length} de {rows.length} {rows.length === 1 ? 'item' : 'itens'}
      </p>

      {/* Tabela */}
      <div className="mt-3 overflow-hidden rounded-lg border border-border bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Título
                </th>
                {metaColumns.map((column) => (
                  <th
                    key={column}
                    className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground md:table-cell"
                  >
                    {column}
                  </th>
                ))}
                {hasStatus ? (
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>
                ) : null}
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filtered.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-surface">
                  <td className="px-5 py-3.5">
                    <Link href={row.editHref} className="font-medium hover:text-accent">
                      {row.title}
                    </Link>
                    {row.subtitle ? (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {row.subtitle}
                      </p>
                    ) : null}
                  </td>

                  {(row.meta ?? []).map((item) => (
                    <td
                      key={item.label}
                      className="hidden px-5 py-3.5 text-muted-foreground md:table-cell"
                    >
                      {item.value}
                    </td>
                  ))}

                  {hasStatus ? (
                    <td className="px-5 py-3.5">
                      {row.status ? (
                        <Badge
                          variant={
                            row.status === 'PUBLISHED'
                              ? 'success'
                              : row.status === 'DRAFT'
                                ? 'warning'
                                : 'muted'
                          }
                        >
                          {STATUS_LABELS[row.status]}
                        </Badge>
                      ) : null}
                    </td>
                  ) : null}

                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      {row.viewHref ? (
                        <Link
                          href={row.viewHref}
                          target="_blank"
                          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                          title="Ver no site"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      ) : null}

                      <Link
                        href={row.editHref}
                        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setTarget(row)}
                        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-background hover:text-destructive"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={metaColumns.length + (hasStatus ? 3 : 2)}
                    className="px-5 py-16 text-center text-sm text-muted-foreground"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmação de exclusão */}
      <Dialog open={Boolean(target)} onOpenChange={(open) => !open && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir {itemLabel}?</DialogTitle>
            <DialogDescription>
              <span className="font-medium text-foreground">{target?.title}</span> será removido
              permanentemente. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)} disabled={deleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Excluir definitivamente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

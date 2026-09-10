'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, Mail, Phone, Search, Trash2 } from 'lucide-react';
import type { LeadStatus } from '@prisma/client';
import { LEAD_STATUS_LABELS } from '@/lib/constants';
import { formatDateShort } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export type MensagemItem = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: LeadStatus;
  originPath: string | null;
  referrer: string | null;
  createdAt: Date;
};

const STATUS_VARIANT: Record<LeadStatus, 'warning' | 'accent' | 'success' | 'muted'> = {
  NOVO: 'warning',
  EM_ATENDIMENTO: 'accent',
  RESPONDIDO: 'success',
  ARQUIVADO: 'muted',
};

const FILTROS = [
  { id: 'TODAS', label: 'Todas' },
  { id: 'NOVO', label: 'Novas' },
  { id: 'EM_ATENDIMENTO', label: 'Em atendimento' },
  { id: 'RESPONDIDO', label: 'Respondidas' },
  { id: 'ARQUIVADO', label: 'Arquivadas' },
] as const;

/**
 * Caixa de entrada do formulário de contato.
 *
 * Lista à esquerda, mensagem aberta à direita. O corpo do texto nunca é
 * editável: o que se altera é só o status do atendimento.
 */
export function MessagesInbox({ items }: { items: MensagemItem[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]['id']>('TODAS');
  const [busca, setBusca] = useState('');
  const [selecionada, setSelecionada] = useState<string | null>(items[0]?.id ?? null);
  const [salvando, setSalvando] = useState(false);

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return items.filter((item) => {
      if (filtro !== 'TODAS' && item.status !== filtro) return false;
      if (!termo) return true;

      return [item.name, item.email, item.subject, item.message].some((campo) =>
        campo.toLowerCase().includes(termo),
      );
    });
  }, [items, filtro, busca]);

  const aberta = items.find((item) => item.id === selecionada) ?? visiveis[0] ?? null;

  async function mudarStatus(id: string, status: LeadStatus) {
    setSalvando(true);

    try {
      const resposta = await fetch(`/api/mensagens/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const resultado = await resposta.json();

      if (!resposta.ok) {
        toast({ variant: 'destructive', title: 'Não foi possível salvar', description: resultado.error });
        return;
      }

      toast({ variant: 'success', title: 'Status atualizado' });
      router.refresh();
    } catch {
      toast({ variant: 'destructive', title: 'Falha de conexão' });
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(id: string) {
    if (!window.confirm('Excluir esta mensagem? A ação não pode ser desfeita.')) return;

    setSalvando(true);

    try {
      const resposta = await fetch(`/api/mensagens/${id}`, { method: 'DELETE' });
      const resultado = await resposta.json();

      if (!resposta.ok) {
        toast({ variant: 'destructive', title: 'Não foi possível excluir', description: resultado.error });
        return;
      }

      toast({ variant: 'success', title: 'Mensagem excluída' });
      setSelecionada(null);
      router.refresh();
    } catch {
      toast({ variant: 'destructive', title: 'Falha de conexão' });
    } finally {
      setSalvando(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-background p-12 text-center">
        <p className="text-sm text-muted-foreground">
          Nenhuma mensagem recebida até o momento. As mensagens enviadas pelo formulário da página de
          contato aparecem aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros e busca */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {FILTROS.map((item) => {
            const total =
              item.id === 'TODAS'
                ? items.length
                : items.filter((mensagem) => mensagem.status === item.id).length;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFiltro(item.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  filtro === item.id
                    ? 'border-transparent bg-secondary text-secondary-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label} ({total})
              </button>
            );
          })}
        </div>

        <div className="relative ml-auto min-w-[220px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar por nome, e-mail ou texto..."
            className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-accent"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* Lista */}
        <div className="overflow-hidden rounded-lg border border-border bg-background lg:col-span-5">
          <ul className="max-h-[70vh] divide-y divide-border overflow-y-auto">
            {visiveis.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelecionada(item.id)}
                  className={`w-full px-4 py-3.5 text-left transition-colors hover:bg-surface ${
                    aberta?.id === item.id ? 'bg-surface' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p
                      className={`truncate text-sm ${
                        item.status === 'NOVO' ? 'font-semibold' : 'font-medium'
                      }`}
                    >
                      {item.name}
                    </p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDateShort(item.createdAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.subject}</p>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground/80">
                    {item.message}
                  </p>
                </button>
              </li>
            ))}

            {visiveis.length === 0 ? (
              <li className="px-4 py-10 text-center text-sm text-muted-foreground">
                Nenhuma mensagem com esse filtro.
              </li>
            ) : null}
          </ul>
        </div>

        {/* Mensagem aberta */}
        <div className="rounded-lg border border-border bg-background lg:col-span-7">
          {aberta ? (
            <article>
              <header className="border-b border-border px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-serif text-lg">{aberta.subject}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {aberta.name} · {formatDateShort(aberta.createdAt)}
                    </p>
                  </div>
                  <Badge variant={STATUS_VARIANT[aberta.status]}>
                    {LEAD_STATUS_LABELS[aberta.status]}
                  </Badge>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={`mailto:${aberta.email}?subject=${encodeURIComponent(`Re: ${aberta.subject}`)}`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-surface"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {aberta.email}
                  </a>

                  {aberta.phone ? (
                    <a
                      href={`https://wa.me/${aberta.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-surface"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {aberta.phone}
                    </a>
                  ) : null}
                </div>
              </header>

              <div className="px-5 py-5">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{aberta.message}</p>
              </div>

              {/* De onde a pessoa escreveu */}
              <div className="border-t border-border px-5 py-3">
                {aberta.originPath || aberta.referrer ? (
                  <dl className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs">
                    {aberta.originPath ? (
                      <div className="flex items-center gap-1.5">
                        <dt className="text-muted-foreground">Enviada de:</dt>
                        <dd>
                          <a
                            href={aberta.originPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-medium transition-colors hover:text-accent"
                          >
                            {aberta.originPath}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </dd>
                      </div>
                    ) : null}

                    {aberta.referrer ? (
                      <div className="flex items-center gap-1.5">
                        <dt className="text-muted-foreground">Página anterior:</dt>
                        <dd>
                          <a
                            href={aberta.referrer}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-medium transition-colors hover:text-accent"
                          >
                            {aberta.referrer}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Origem não registrada. Mensagens recebidas antes desta atualização não guardaram
                    de qual página vieram.
                  </p>
                )}
              </div>

              <footer className="flex flex-wrap items-center gap-2 border-t border-border px-5 py-4">
                <span className="mr-1 text-xs text-muted-foreground">Marcar como:</span>

                {(Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]).map((status) => (
                  <Button
                    key={status}
                    type="button"
                    variant={aberta.status === status ? 'default' : 'outline'}
                    size="sm"
                    disabled={salvando || aberta.status === status}
                    onClick={() => mudarStatus(aberta.id, status)}
                  >
                    {LEAD_STATUS_LABELS[status]}
                  </Button>
                ))}

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-destructive hover:text-destructive"
                  disabled={salvando}
                  onClick={() => excluir(aberta.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Excluir
                </Button>
              </footer>
            </article>
          ) : (
            <div className="p-12 text-center text-sm text-muted-foreground">
              Selecione uma mensagem à esquerda para ler.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

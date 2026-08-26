'use client';

import { useState } from 'react';
import { Check, Copy, Plus, X } from 'lucide-react';
import type { AdBlock } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Repetidor de blocos de anúncio (aba Anúncios), no espírito do Ad Inserter.
 *
 * Controlado por fora (`values`/`onChange`), como PairField — o settings-form
 * o liga ao react-hook-form via `setValue('adBlocks', next)`. Cada bloco é um
 * anúncio do AdSense (por ID) OU um HTML livre, com posição automática (após o
 * N-ésimo parágrafo) ou manual (atalho `[[ad:id]]` colado no texto).
 */

/**
 * Sugestão inicial quando o site ainda não tem blocos: os três pontos do
 * artigo (3/6/9) pedidos pelo dono + um bloco livre de exemplo. Vêm com o ID
 * do AdSense em branco de propósito — enquanto vazios, mostram só o espaço
 * reservado, o que é adequado durante a análise do Google.
 */
export const DEFAULT_AD_BLOCKS: AdBlock[] = [
  {
    id: 'artigo-1',
    name: 'No meio do artigo (após o 3º parágrafo)',
    enabled: true,
    type: 'adsense',
    adsenseSlot: '',
    format: 'fluid',
    html: '',
    placement: 'paragraph',
    afterParagraph: 3,
  },
  {
    id: 'artigo-2',
    name: 'No meio do artigo (após o 6º parágrafo)',
    enabled: true,
    type: 'adsense',
    adsenseSlot: '',
    format: 'fluid',
    html: '',
    placement: 'paragraph',
    afterParagraph: 6,
  },
  {
    id: 'artigo-3',
    name: 'No meio do artigo (após o 9º parágrafo)',
    enabled: true,
    type: 'adsense',
    adsenseSlot: '',
    format: 'fluid',
    html: '',
    placement: 'paragraph',
    afterParagraph: 9,
  },
  {
    id: 'livre-1',
    name: 'Bloco livre (cole o atalho onde quiser)',
    enabled: true,
    type: 'adsense',
    adsenseSlot: '',
    format: 'rectangle',
    html: '',
    placement: 'manual',
    afterParagraph: 3,
  },
];

const TIPOS = [
  { value: 'adsense', label: 'Bloco do AdSense (por ID)' },
  { value: 'html', label: 'Código HTML (qualquer rede)' },
] as const;

const FORMATOS = [
  { value: 'auto', label: 'Automático (responsivo)' },
  { value: 'rectangle', label: 'Retângulo — 300×250' },
  { value: 'horizontal', label: 'Horizontal — banner' },
  { value: 'vertical', label: 'Vertical — arranha-céu' },
  { value: 'fluid', label: 'Fluido — dentro do artigo' },
] as const;

const POSICOES = [
  { value: 'paragraph', label: 'Automático — após N parágrafos' },
  { value: 'manual', label: 'Manual — via atalho no texto' },
] as const;

/** Próximo id livre no formato bloco-N (estável e curto, bom para o atalho). */
function novoId(existentes: AdBlock[]): string {
  const usados = new Set(existentes.map((b) => b.id));
  let n = 1;
  while (usados.has(`bloco-${n}`)) n += 1;
  return `bloco-${n}`;
}

function blocoVazio(existentes: AdBlock[]): AdBlock {
  return {
    id: novoId(existentes),
    name: '',
    enabled: true,
    type: 'adsense',
    adsenseSlot: '',
    format: 'auto',
    html: '',
    placement: 'paragraph',
    afterParagraph: 3,
  };
}

/** Campo somente-leitura com o atalho e um botão de copiar. */
function AtalhoCopiavel({ id }: { id: string }) {
  const [copiado, setCopiado] = useState(false);
  const atalho = `[[ad:${id}]]`;

  async function copiar() {
    try {
      await navigator.clipboard.writeText(atalho);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Sem permissão de clipboard: dá pra selecionar e copiar à mão.
    }
  }

  return (
    <div className="flex gap-2">
      <Input
        readOnly
        value={atalho}
        onFocus={(event) => event.currentTarget.select()}
        className="bg-background font-mono text-xs"
      />
      <Button type="button" variant="outline" size="sm" onClick={copiar}>
        {copiado ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copiado ? 'Copiado' : 'Copiar'}
      </Button>
    </div>
  );
}

interface AdBlocksFieldProps {
  values: AdBlock[];
  onChange: (values: AdBlock[]) => void;
}

export function AdBlocksField({ values, onChange }: AdBlocksFieldProps) {
  function update(index: number, patch: Partial<AdBlock>) {
    onChange(values.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-3">
      {values.map((bloco, index) => (
        <div key={bloco.id} className="rounded-md border border-border bg-surface p-4">
          {/* Cabeçalho: ligado/desligado + remover */}
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Switch
                id={`ad-enabled-${bloco.id}`}
                checked={bloco.enabled}
                onCheckedChange={(checked) => update(index, { enabled: checked })}
              />
              <label
                htmlFor={`ad-enabled-${bloco.id}`}
                className="cursor-pointer text-xs font-medium text-muted-foreground"
              >
                {bloco.enabled ? 'Ativo' : 'Desativado'}
              </label>
            </div>
            <button
              type="button"
              onClick={() => onChange(values.filter((_, i) => i !== index))}
              className="text-muted-foreground transition-colors hover:text-destructive"
              aria-label={`Remover bloco ${index + 1}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <Input
            value={bloco.name}
            onChange={(event) => update(index, { name: event.target.value })}
            placeholder="Nome do bloco (ex.: No meio do artigo)"
            className="bg-background"
          />

          {/* Tipo + (formato do AdSense) */}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Tipo de conteúdo</label>
              <Select
                value={bloco.type}
                onValueChange={(value) => update(index, { type: value as AdBlock['type'] })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {bloco.type === 'adsense' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Formato</label>
                <Select
                  value={bloco.format}
                  onValueChange={(value) => update(index, { format: value as AdBlock['format'] })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMATOS.map((formato) => (
                      <SelectItem key={formato.value} value={formato.value}>
                        {formato.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>

          {/* Conteúdo: ID do AdSense OU código HTML */}
          {bloco.type === 'adsense' ? (
            <div className="mt-3 space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                ID do bloco do AdSense
              </label>
              <Input
                value={bloco.adsenseSlot}
                onChange={(event) => update(index, { adsenseSlot: event.target.value })}
                placeholder="1234567890"
                inputMode="numeric"
                className="bg-background font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Só os números do bloco criado no AdSense (o valor de{' '}
                <code className="rounded bg-background px-1 py-0.5">data-ad-slot</code>). Vazio =
                espaço reservado, sem anúncio.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Código HTML</label>
              <Textarea
                value={bloco.html}
                onChange={(event) => update(index, { html: event.target.value })}
                rows={4}
                placeholder="<!-- Cole aqui o código do anúncio -->"
                className="bg-background font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Cole o código exatamente como a rede fornece — os scripts são executados no site.
              </p>
            </div>
          )}

          {/* Posicionamento: automático (após N) ou manual (atalho) */}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Onde aparece</label>
              <Select
                value={bloco.placement}
                onValueChange={(value) =>
                  update(index, { placement: value as AdBlock['placement'] })
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POSICOES.map((posicao) => (
                    <SelectItem key={posicao.value} value={posicao.value}>
                      {posicao.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {bloco.placement === 'paragraph' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Após qual parágrafo
                </label>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={bloco.afterParagraph}
                  onChange={(event) =>
                    update(index, { afterParagraph: Number(event.target.value) || 1 })
                  }
                  className="bg-background"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Atalho para colar no texto
                </label>
                <AtalhoCopiavel id={bloco.id} />
              </div>
            )}
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...values, blocoVazio(values)])}
      >
        <Plus className="h-3.5 w-3.5" />
        Adicionar bloco
      </Button>
    </div>
  );
}

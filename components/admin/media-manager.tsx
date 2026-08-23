'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  Copy,
  Link as LinkIcon,
  Loader2,
  Plus,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field } from '@/components/admin/form-fields';
import { cn, formatBytes } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Media } from '@prisma/client';

interface MediaManagerProps {
  items: (Media & { uploadedBy: { name: string } | null })[];
  folders: string[];
}

/**
 * Biblioteca de mídia.
 *
 * Os arquivos enviados vão para o Supabase Storage e são servidos por CDN.
 * Gravar em public/uploads não funcionaria: na Vercel o sistema de arquivos
 * das funções é efêmero e some a cada deploy.
 *
 * Também é possível cadastrar apenas a URL, para imagens que já estão em
 * /public ou em outro CDN.
 */
export function MediaManager({ items, folders }: MediaManagerProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [query, setQuery] = useState('');
  const [folder, setFolder] = useState<string>('todas');
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [target, setTarget] = useState<Media | null>(null);

  const [form, setForm] = useState({ url: '', filename: '', alt: '', folder: 'geral' });

  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  /**
   * Envia os arquivos em sequência, não em paralelo: uploads simultâneos
   * competem pela banda e um erro no meio deixa o estado ambíguo.
   * A pasta usada é a que estiver filtrada no momento.
   */
  async function uploadFiles(files: File[]) {
    setUploading(true);
    setProgress({ done: 0, total: files.length });

    const destination = folder === 'todas' ? 'geral' : folder;
    let sent = 0;
    const failures: string[] = [];

    for (const file of files) {
      try {
        const body = new FormData();
        body.append('file', file);
        body.append('folder', destination);

        const response = await fetch('/api/media/upload', { method: 'POST', body });
        const result = await response.json();

        if (!response.ok || !result.success) {
          failures.push(`${file.name}: ${result.error ?? 'falhou'}`);
        } else {
          sent++;
        }
      } catch {
        failures.push(`${file.name}: falha de conexão`);
      }

      setProgress((current) => ({ ...current, done: current.done + 1 }));
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';

    if (sent > 0) {
      toast({
        variant: 'success',
        title: `${sent} ${sent === 1 ? 'imagem enviada' : 'imagens enviadas'}`,
        description: `Pasta: ${destination}`,
      });
      router.refresh();
    }

    if (failures.length > 0) {
      toast({
        variant: 'destructive',
        title: `${failures.length} não ${failures.length === 1 ? 'foi enviada' : 'foram enviadas'}`,
        description: failures[0],
      });
    }
  }

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      if (folder !== 'todas' && item.folder !== folder) return false;
      if (!term) return true;
      return `${item.filename} ${item.alt ?? ''}`.toLowerCase().includes(term);
    });
  }, [items, query, folder]);

  async function addMedia() {
    setSaving(true);
    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          filename: form.filename || form.url.split('/').pop() || 'imagem',
          mimeType: form.url.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg',
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        toast({
          variant: 'destructive',
          title: 'Não foi possível adicionar',
          description: result.error ?? 'Verifique a URL informada.',
        });
        return;
      }

      toast({ variant: 'success', title: 'Imagem adicionada' });
      setAdding(false);
      setForm({ url: '', filename: '', alt: '', folder: 'geral' });
      router.refresh();
    } catch {
      toast({ variant: 'destructive', title: 'Falha de conexão' });
    } finally {
      setSaving(false);
    }
  }

  async function removeMedia() {
    if (!target) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/media/${target.id}`, { method: 'DELETE' });
      const result = await response.json();

      if (!response.ok || !result.success) {
        toast({ variant: 'destructive', title: 'Não foi possível remover' });
        return;
      }

      toast({ variant: 'success', title: 'Item removido' });
      setTarget(null);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      // Sem permissão de área de transferência.
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
            placeholder="Buscar por nome ou descrição..."
            className="bg-background pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {['todas', ...folders].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFolder(option)}
              aria-pressed={folder === option}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize transition-colors',
                folder === option
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border bg-background text-muted-foreground hover:border-accent',
              )}
            >
              {option}
            </button>
          ))}
        </div>

        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          className="hidden"
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            if (files.length) uploadFiles(files);
          }}
        />

        <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? 'Enviando...' : 'Enviar imagens'}
        </Button>

        <Button variant="outline" onClick={() => setAdding(true)}>
          <LinkIcon className="h-4 w-4" />
          Por URL
        </Button>
      </div>

      {/* Área de arrastar e soltar */}
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const files = Array.from(event.dataTransfer.files ?? []);
          if (files.length) uploadFiles(files);
        }}
        className={cn(
          'mt-4 rounded-lg border-2 border-dashed p-6 text-center text-sm transition-colors',
          dragging
            ? 'border-accent bg-accent/5 text-foreground'
            : 'border-border bg-surface text-muted-foreground',
        )}
      >
        {uploading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando {progress.done} de {progress.total}...
          </span>
        ) : (
          <>
            Arraste imagens aqui para enviar de uma vez
            <span className="mt-1 block text-xs">
              JPG, PNG, WebP, AVIF ou GIF · até 8 MB cada
            </span>
          </>
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? 'item' : 'itens'}
      </p>

      {/* Grade */}
      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((item) => (
            <figure
              key={item.id}
              className="group overflow-hidden rounded-lg border border-border bg-background"
            >
              <div className="relative aspect-[4/3] bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.alt ?? item.filename}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-secondary/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => copyUrl(item.url)}
                    className="rounded-md bg-background p-2 text-foreground transition-colors hover:text-accent"
                    title="Copiar URL"
                  >
                    {copied === item.url ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTarget(item)}
                    className="rounded-md bg-background p-2 text-foreground transition-colors hover:text-destructive"
                    title="Remover"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <figcaption className="p-3">
                <p className="truncate text-xs font-medium">{item.filename}</p>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  {item.folder} · {formatBytes(item.size)}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-border py-20 text-center">
          <p className="font-serif text-lg">Nenhuma imagem encontrada</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Adicione arquivos em <code className="rounded bg-surface px-1.5 py-0.5">public/images</code>{' '}
            e cadastre a URL aqui, ou use uma URL de CDN.
          </p>
        </div>
      )}

      {/* Diálogo de cadastro */}
      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar imagem</DialogTitle>
            <DialogDescription>
              Informe o caminho de um arquivo em /public ou a URL completa de um CDN.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Field label="URL" required htmlFor="media-url">
              <Input
                id="media-url"
                value={form.url}
                onChange={(event) => setForm({ ...form, url: event.target.value })}
                placeholder="/images/cortinas/arquivo.jpg"
              />
            </Field>

            <Field label="Nome do arquivo" htmlFor="media-filename">
              <Input
                id="media-filename"
                value={form.filename}
                onChange={(event) => setForm({ ...form, filename: event.target.value })}
                placeholder="arquivo.svg"
              />
            </Field>

            <Field label="Texto alternativo" htmlFor="media-alt">
              <Textarea
                id="media-alt"
                rows={2}
                value={form.alt}
                onChange={(event) => setForm({ ...form, alt: event.target.value })}
                placeholder="Descreva a imagem para acessibilidade e SEO"
              />
            </Field>

            <Field label="Pasta" htmlFor="media-folder">
              <Input
                id="media-folder"
                value={form.folder}
                onChange={(event) => setForm({ ...form, folder: event.target.value })}
                placeholder="cortinas, blog, servicos..."
              />
            </Field>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAdding(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={addMedia} disabled={saving || !form.url}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmação de remoção */}
      <Dialog open={Boolean(target)} onOpenChange={(open) => !open && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover imagem?</DialogTitle>
            <DialogDescription>
              <span className="font-medium text-foreground">{target?.filename}</span> sairá da
              biblioteca. O arquivo em si não é apagado — apenas o registro.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={removeMedia} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

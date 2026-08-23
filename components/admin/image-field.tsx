'use client';

import { useEffect, useRef, useState } from 'react';
import { ImageIcon, Library, Loader2, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn, formatBytes } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Media } from '@prisma/client';

interface ImageFieldProps {
  label: string;
  /** URL atual da imagem. */
  value: string;
  onChange: (url: string) => void;
  /** Pasta lógica de destino no Storage. */
  folder?: string;
  hint?: string;
  error?: string;
  /** Proporção da pré-visualização. */
  aspect?: 'video' | 'square' | 'photo' | 'wide';
  /**
   * Como a imagem preenche a área.
   * `cover` recorta para preencher — certo para fotos.
   * `contain` mostra a imagem inteira — obrigatório para logotipo e favicon,
   * que ficariam mutilados se fossem recortados.
   */
  fit?: 'cover' | 'contain';
  /** Formatos aceitos, quando diferem do padrão. */
  accept?: string;
  /** Exemplo mostrado no campo de URL manual. */
  placeholder?: string;
}

/** Converte a lista de MIME types em algo legível: "JPG, PNG ou WebP". */
function formatList(accept: string): string {
  const names: Record<string, string> = {
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
    'image/webp': 'WebP',
    'image/avif': 'AVIF',
    'image/gif': 'GIF',
  };

  const labels = accept
    .split(',')
    .map((type) => names[type.trim()])
    .filter(Boolean);

  if (labels.length === 0) return 'imagem';
  if (labels.length === 1) return labels[0];

  return `${labels.slice(0, -1).join(', ')} ou ${labels[labels.length - 1]}`;
}

const ASPECT = {
  video: 'aspect-video',
  square: 'aspect-square',
  photo: 'aspect-[4/3]',
  wide: 'aspect-[5/1]',
} as const;

/**
 * Campo de imagem do painel.
 *
 * Três caminhos para a mesma coisa: enviar um arquivo (clique ou arrastar),
 * escolher algo já existente na biblioteca, ou colar uma URL externa. O
 * upload vai para o Supabase Storage e já entra na biblioteca de mídia.
 */
export function ImageField({
  label,
  value,
  onChange,
  folder = 'geral',
  hint,
  error,
  aspect = 'video',
  fit = 'cover',
  accept = 'image/jpeg,image/png,image/webp,image/avif,image/gif',
  placeholder,
}: ImageFieldProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [value]);

  async function upload(file: File) {
    setUploading(true);

    try {
      const body = new FormData();
      body.append('file', file);
      body.append('folder', folder);

      const response = await fetch('/api/media/upload', { method: 'POST', body });
      const result = await response.json();

      if (!response.ok || !result.success) {
        toast({
          variant: 'destructive',
          title: 'Falha no envio',
          description: result.error ?? 'Tente novamente.',
        });
        return;
      }

      onChange(result.data.url);
      toast({ variant: 'success', title: 'Imagem enviada' });
    } catch {
      toast({ variant: 'destructive', title: 'Falha de conexão' });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) upload(file);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {/* Pré-visualização ou área de soltar */}
      {value && !broken ? (
        <div
          className={cn(
            'group relative overflow-hidden rounded-md border border-border',
            // Fundo visível atrás de logos com transparência
            fit === 'contain' && 'bg-surface',
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Pré-visualização"
            onError={() => setBroken(true)}
            className={cn(
              'w-full',
              ASPECT[aspect],
              fit === 'contain' ? 'object-contain p-3' : 'object-cover',
            )}
          />

          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-secondary/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-3.5 w-3.5" />
              Trocar
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setLibraryOpen(true)}
            >
              <Library className="h-3.5 w-3.5" />
              Biblioteca
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => onChange('')}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center justify-center rounded-md border-2 border-dashed p-7 text-center transition-colors',
            dragging ? 'border-accent bg-accent/5' : 'border-border bg-surface',
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-accent" aria-hidden />
              <p className="mt-3 text-sm text-muted-foreground">Enviando...</p>
            </>
          ) : (
            <>
              <ImageIcon className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} aria-hidden />

              <p className="mt-3 text-sm">
                {broken && value ? (
                  <span className="text-destructive">A imagem não carregou. </span>
                ) : null}
                Arraste uma imagem aqui
              </p>

              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => inputRef.current?.click()}
                >
                  <Upload className="h-3.5 w-3.5" />
                  Escolher arquivo
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setLibraryOpen(true)}
                >
                  <Library className="h-3.5 w-3.5" />
                  Biblioteca
                </Button>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                {formatList(accept)} · até 8 MB
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) upload(file);
        }}
      />

      {/* URL manual, para imagens de /public ou de CDN externo */}
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? `ou cole uma URL: /images/${folder}/arquivo.jpg`}
        className="font-mono text-xs"
      />

      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      <MediaLibraryDialog
        open={libraryOpen}
        onOpenChange={setLibraryOpen}
        onSelect={(url) => {
          onChange(url);
          setLibraryOpen(false);
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Seletor da biblioteca de mídia
// ---------------------------------------------------------------------------

interface MediaLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}

function MediaLibraryDialog({ open, onOpenChange, onSelect }: MediaLibraryDialogProps) {
  const [items, setItems] = useState<Media[] | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) return;

    let active = true;
    setItems(null);

    fetch('/api/media')
      .then((response) => response.json())
      .then((result) => {
        if (active) setItems(result.success ? result.data : []);
      })
      .catch(() => {
        if (active) setItems([]);
      });

    return () => {
      active = false;
    };
  }, [open]);

  const term = query.trim().toLowerCase();
  const filtered = (items ?? []).filter((item) =>
    `${item.filename} ${item.alt ?? ''} ${item.folder}`.toLowerCase().includes(term),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] max-w-3xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Biblioteca de mídia</DialogTitle>
          <DialogDescription>Clique em uma imagem para usá-la.</DialogDescription>
        </DialogHeader>

        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por nome, descrição ou pasta..."
        />

        <div className="max-h-[55dvh] overflow-y-auto">
          {items === null ? (
            <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Carregando...
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Nenhuma imagem encontrada.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.url)}
                  className="group overflow-hidden rounded-md border border-border text-left transition-colors hover:border-accent"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.alt ?? item.filename}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <span className="block truncate p-2 text-[11px] text-muted-foreground">
                    {item.filename} · {formatBytes(item.size)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

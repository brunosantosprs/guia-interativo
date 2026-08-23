'use client';

import { useState } from 'react';
import { Eye, EyeOff, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { markdownToHtml } from '@/lib/markdown';
import { cn, wordCount } from '@/lib/utils';

/**
 * Blocos reutilizados pelos formulários do painel.
 * Todos são "controlados por fora": recebem valor e callback, o que os torna
 * compatíveis tanto com react-hook-form quanto com estado local.
 */

// ---------------------------------------------------------------------------
// Seção do formulário
// ---------------------------------------------------------------------------

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <section className={cn('rounded-lg border border-border bg-background p-6', className)}>
      <header className="mb-5">
        <h2 className="font-serif text-lg">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Campo simples com rótulo, dica e erro
// ---------------------------------------------------------------------------

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  /** Contador exibido à direita do rótulo (ex.: 58/60). */
  counter?: string;
}

export function Field({ label, htmlFor, hint, error, required, children, counter }: FieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={htmlFor}>
          {label} {required ? <span className="text-accent">*</span> : null}
        </Label>
        {counter ? <span className="text-xs text-muted-foreground">{counter}</span> : null}
      </div>

      {children}

      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Lista de textos (vantagens, ambientes, materiais...)
// ---------------------------------------------------------------------------

interface ArrayFieldProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export function ArrayField({
  label,
  values,
  onChange,
  placeholder = 'Digite e pressione Enter',
  hint,
  error,
  required,
}: ArrayFieldProps) {
  const [draft, setDraft] = useState('');

  function add() {
    const value = draft.trim();
    if (!value || values.includes(value)) return;
    onChange([...values, value]);
    setDraft('');
  }

  return (
    <Field label={label} hint={hint} error={error} required={required}>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <Button type="button" variant="outline" size="icon" onClick={add} aria-label={`Adicionar em ${label}`}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {values.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {values.map((value, index) => (
            <li
              key={`${value}-${index}`}
              className="flex items-start gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm"
            >
              <span className="flex-1 leading-relaxed">{value}</span>
              <button
                type="button"
                onClick={() => onChange(values.filter((_, i) => i !== index))}
                className="mt-0.5 shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                aria-label={`Remover ${value}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </Field>
  );
}

// ---------------------------------------------------------------------------
// Lista de objetos (etapas de serviço, FAQ)
// ---------------------------------------------------------------------------

interface PairFieldProps {
  label: string;
  values: { title: string; description: string }[];
  onChange: (values: { title: string; description: string }[]) => void;
  titleLabel?: string;
  descriptionLabel?: string;
  hint?: string;
}

export function PairField({
  label,
  values,
  onChange,
  titleLabel = 'Título',
  descriptionLabel = 'Descrição',
  hint,
}: PairFieldProps) {
  function update(index: number, patch: Partial<{ title: string; description: string }>) {
    onChange(values.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-3">
        {values.map((item, index) => (
          <div key={index} className="rounded-md border border-border bg-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Item {index + 1}
              </span>
              <button
                type="button"
                onClick={() => onChange(values.filter((_, i) => i !== index))}
                className="text-muted-foreground transition-colors hover:text-destructive"
                aria-label={`Remover item ${index + 1}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <Input
              value={item.title}
              onChange={(event) => update(index, { title: event.target.value })}
              placeholder={titleLabel}
              className="bg-background"
            />
            <Textarea
              value={item.description}
              onChange={(event) => update(index, { description: event.target.value })}
              placeholder={descriptionLabel}
              rows={3}
              className="mt-2 bg-background"
            />
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...values, { title: '', description: '' }])}
        >
          <Plus className="h-3.5 w-3.5" />
          Adicionar item
        </Button>
      </div>
    </Field>
  );
}

// ---------------------------------------------------------------------------
// Editor markdown com pré-visualização
// ---------------------------------------------------------------------------

interface MarkdownEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
  error?: string;
  required?: boolean;
}

export function MarkdownEditor({
  label,
  value,
  onChange,
  rows = 22,
  hint,
  error,
  required,
}: MarkdownEditorProps) {
  const [preview, setPreview] = useState(false);
  const words = wordCount(value);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Label>
          {label} {required ? <span className="text-accent">*</span> : null}
        </Label>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {words} {words === 1 ? 'palavra' : 'palavras'} · ~{Math.max(1, Math.round(words / 210))}{' '}
            min
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setPreview((current) => !current)}
          >
            {preview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {preview ? 'Editar' : 'Pré-visualizar'}
          </Button>
        </div>
      </div>

      {preview ? (
        <div
          className="prose-editorial max-h-[560px] overflow-y-auto rounded-md border border-border bg-background p-6"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
        />
      ) : (
        <Textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={rows}
          className="font-mono text-[13px] leading-relaxed"
          placeholder={'## Título da seção\n\nTexto do parágrafo em **markdown**.\n\n- item de lista\n- outro item'}
        />
      )}

      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pré-visualização do resultado na busca do Google
// ---------------------------------------------------------------------------

interface SerpPreviewProps {
  title: string;
  description: string;
  path: string;
}

export function SerpPreview({ title, description, path }: SerpPreviewProps) {
  return (
    <div className="rounded-md border border-border bg-surface p-4">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Prévia no Google
      </p>
      <p className="text-xs text-muted-foreground">guiainterativo.com{path}</p>
      <p className="mt-1 line-clamp-1 text-[1.05rem] leading-snug text-[#1a0dab]">
        {title || 'Título da página'}
      </p>
      <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted-foreground">
        {description || 'A meta descrição aparece aqui. Ideal entre 140 e 160 caracteres.'}
      </p>
    </div>
  );
}

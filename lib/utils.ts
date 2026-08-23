import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import slugifyLib from 'slugify';

/** Combina classes condicionais resolvendo conflitos do Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Gera um slug limpo, em minusculas, seguro para URLs. */
export function slugify(value: string): string {
  return slugifyLib(value, {
    lower: true,
    strict: true,
    locale: 'pt',
    trim: true,
  });
}

/** Formata uma data no padrao brasileiro por extenso. */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(d);
}

/** Formata data curta (dd/mm/aaaa). */
export function formatDateShort(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(d);
}

/** Formato ISO usado em atributos `dateTime` e JSON-LD. */
export function toISO(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

/**
 * Estima o tempo de leitura em minutos.
 * Media adotada: 210 palavras por minuto (leitura em portugues na web).
 */
export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 210));
}

/** Conta palavras de um texto (usado no admin). */
export function wordCount(content: string): number {
  if (!content.trim()) return 0;
  return content.trim().split(/\s+/).length;
}

/** Corta um texto preservando palavras inteiras. */
export function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, clean.lastIndexOf(' ', max))}...`;
}

/** Remove marcacao markdown basica para gerar resumos/meta descriptions. */
export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Monta a URL absoluta do site a partir de um caminho relativo. */
export function absoluteUrl(path = '/'): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
    'https://guiainterativo.com';
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Monta o link do WhatsApp com mensagem pre-preenchida. */
export function whatsappLink(numero: string, mensagem?: string): string {
  const digits = numero.replace(/\D/g, '');
  const text = mensagem ? `?text=${encodeURIComponent(mensagem)}` : '';
  return `https://wa.me/${digits}${text}`;
}

/** Aplica mascara de telefone brasileiro enquanto o usuario digita. */
export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

/** Iniciais para avatares. */
export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/** Converte bytes em texto legivel (biblioteca de midia). */
export function formatBytes(bytes: number): string {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/** Embaralhamento estavel usado em "conteudos relacionados". */
export function pickRelated<T>(items: T[], count: number, exclude?: (i: T) => boolean): T[] {
  const pool = exclude ? items.filter((i) => !exclude(i)) : items;
  return pool.slice(0, count);
}

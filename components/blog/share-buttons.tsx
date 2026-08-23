'use client';

import { useState } from 'react';
import { Check, Link2, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/components/shared/analytics';

interface ShareButtonsProps {
  /** URL absoluta do conteúdo. */
  url: string;
  title: string;
  className?: string;
}

/** Compartilhamento nativo, WhatsApp, Facebook, X e cópia de link. */
export function ShareButtons({ url, title, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const targets = [
    {
      label: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} — ${url}`)}`,
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackEvent('share', { method: 'copy_link', content_type: 'article' });
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Navegadores sem permissão de área de transferência: nada a fazer.
    }
  }

  async function nativeShare() {
    if (!navigator.share) return;
    try {
      await navigator.share({ title, url });
      trackEvent('share', { method: 'native', content_type: 'article' });
    } catch {
      // Usuário cancelou o compartilhamento.
    }
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="mr-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Compartilhar
      </span>

      {targets.map((target) => (
        <a
          key={target.label}
          href={target.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent('share', { method: target.label.toLowerCase(), content_type: 'article' })
          }
          className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium transition-colors hover:border-accent hover:text-accent"
        >
          {target.label}
        </a>
      ))}

      <button
        type="button"
        onClick={copyLink}
        className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium transition-colors hover:border-accent hover:text-accent"
        aria-label="Copiar link do artigo"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" aria-hidden />
            Copiado
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5" aria-hidden />
            Copiar link
          </>
        )}
      </button>

      <button
        type="button"
        onClick={nativeShare}
        className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium transition-colors hover:border-accent hover:text-accent sm:hidden"
        aria-label="Compartilhar"
      >
        <Share2 className="h-3.5 w-3.5" aria-hidden />
        Mais
      </button>
    </div>
  );
}

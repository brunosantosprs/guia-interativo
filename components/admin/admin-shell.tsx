'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { ExternalLink, LogOut, Menu, X } from 'lucide-react';
import { ADMIN_NAV, ROLE_LABELS } from '@/lib/constants';
import { cn, initials } from '@/lib/utils';
import { Icon } from '@/components/shared/icon';
import { Button } from '@/components/ui/button';
import type { Role } from '@prisma/client';

interface AdminShellProps {
  user: { name: string; email: string; image?: string | null; role: Role };
  children: React.ReactNode;
}

/**
 * Estrutura do painel administrativo: barra lateral fixa em telas grandes,
 * menu deslizante no mobile e cabeçalho com identificação do usuário.
 */
export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = ADMIN_NAV.filter(
    (item) => !('adminOnly' in item && item.adminOnly) || user.role === 'ADMIN',
  );

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-dvh bg-surface">
      {/* ============ SIDEBAR ============ */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r border-border bg-background transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link href="/admin" className="flex items-center">
            <Image
              src="/images/logo.svg"
              alt="Guia Interativo"
              width={160}
              height={35}
              className="h-8 w-auto"
            />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-1.5 hover:bg-surface lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Menu administrativo">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-secondary text-secondary-foreground'
                  : 'text-muted-foreground hover:bg-surface hover:text-foreground',
              )}
            >
              <Icon name={item.icon} className="h-4 w-4" strokeWidth={1.8} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
            Ver o site
          </Link>

          <div className="mt-2 flex items-center gap-3 rounded-md border border-border p-3">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={36}
                height={36}
                className="h-9 w-9 shrink-0 rounded-full border border-border"
              />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-medium">
                {initials(user.name)}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</p>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface hover:text-destructive"
              aria-label="Sair"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay do menu mobile */}
      {open ? (
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-secondary/40 backdrop-blur-sm lg:hidden"
          aria-label="Fechar menu"
        />
      ) : null}

      {/* ============ CONTEÚDO ============ */}
      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/90 px-5 backdrop-blur-md lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
            className="lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <p className="text-sm font-medium">
            {items.find((item) => isActive(item.href))?.label ?? 'Painel'}
          </p>
        </header>

        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

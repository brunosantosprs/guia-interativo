'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, MessageCircle } from 'lucide-react';
import { MAIN_NAV } from '@/lib/constants';
import { cn, whatsappLink } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  siteName: string;
  logoUrl?: string | null;
  whatsapp: string;
  whatsappMessage?: string;
}

/**
 * Cabeçalho principal do site público.
 *
 * Fica transparente sobre o hero e ganha fundo sólido com sombra após a
 * rolagem. O menu mobile abre em painel deslizante com trava de scroll.
 */
export function Header({ siteName, logoUrl, whatsapp, whatsappMessage }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fecha o menu ao navegar
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Trava a rolagem do corpo enquanto o menu mobile estiver aberto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-border bg-background/90 backdrop-blur-md shadow-soft'
            : 'border-b border-transparent bg-background/70 backdrop-blur-sm',
        )}
      >
        <div className="container flex h-[72px] items-center justify-between gap-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
            aria-label={`${siteName} — página inicial`}
          >
            <Image
              src={logoUrl || '/images/logo.svg'}
              alt={siteName}
              width={176}
              height={38}
              priority
              className="h-9 w-auto"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative rounded-md px-3.5 py-2 text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
                {isActive(item.href) ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3.5 -bottom-0.5 h-px bg-accent"
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="accent" size="sm" className="hidden sm:inline-flex">
              <a
                href={whatsappLink(whatsapp, whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                Falar no WhatsApp
              </a>
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-surface lg:hidden"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            /**
             * `overflow-y-auto`: com o menu aberto a rolagem do corpo fica
             * travada, entao quem precisa rolar e este painel. Sem isso, em
             * tela baixa — celular deitado, principalmente — os ultimos itens
             * e o botao do WhatsApp ficam abaixo da dobra e simplesmente nao
             * ha como alcanca-los. Medido: 606px de conteudo em 375px de
             * altura.
             */
            className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-background pt-[72px] lg:hidden"
          >
            <nav className="container flex flex-col py-8" aria-label="Navegação mobile">
              {MAIN_NAV.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between border-b border-border py-4 font-serif text-2xl transition-colors',
                      isActive(item.href) ? 'text-accent' : 'text-foreground hover:text-accent',
                    )}
                  >
                    {item.label}
                    <span className="text-xs font-sans text-muted-foreground">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </Link>
                </motion.div>
              ))}

              <Button asChild variant="accent" size="lg" className="mt-8">
                <a
                  href={whatsappLink(whatsapp, whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                  Falar no WhatsApp
                </a>
              </Button>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { whatsappLink } from '@/lib/utils';
import { trackEvent } from '@/components/shared/analytics';

interface WhatsAppFloatProps {
  /** Número com DDI e DDD, apenas dígitos (ex.: 5511999999999). */
  number: string;
  /** Mensagem pré-preenchida no app do WhatsApp. */
  message?: string;
}

/**
 * Botão flutuante de WhatsApp, presente em todas as páginas públicas.
 *
 * Aparece após uma rolagem mínima para não competir com o hero, abre um
 * balão de convite depois de alguns segundos e registra o clique no GA4.
 */
export function WhatsAppFloat({ number, message }: WhatsAppFloatProps) {
  const [visible, setVisible] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 320);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!visible || tooltipDismissed) return;
    const timer = window.setTimeout(() => setTooltipOpen(true), 2500);
    return () => window.clearTimeout(timer);
  }, [visible, tooltipDismissed]);

  const href = whatsappLink(number, message);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-4 z-[65] flex items-end gap-3 md:bottom-7 md:right-7"
        >
          <AnimatePresence>
            {tooltipOpen ? (
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                className="relative mb-1 hidden max-w-[240px] rounded-lg border border-border bg-background p-3.5 pr-8 text-sm shadow-elevated sm:block"
              >
                <button
                  type="button"
                  onClick={() => {
                    setTooltipOpen(false);
                    setTooltipDismissed(true);
                  }}
                  className="absolute right-2 top-2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Fechar convite"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <p className="font-medium">Ficou com dúvida?</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Fale com um especialista pelo WhatsApp — resposta em horário comercial.
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { location: 'floating_button' })}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elevated transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            aria-label="Falar no WhatsApp"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20" aria-hidden />
            <MessageCircle className="relative h-7 w-7" strokeWidth={1.8} />
          </a>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

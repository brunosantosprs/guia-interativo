'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'gi-cookie-consent';

/**
 * Aviso de cookies.
 *
 * Requisito prático para AdSense e para a LGPD: o visitante precisa ser
 * informado sobre cookies de análise e publicidade e poder recusá-los.
 * A escolha fica registrada por 12 meses no localStorage.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Consulta adiada para não bloquear a primeira pintura.
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (!stored) {
          setVisible(true);
          return;
        }
        const { expiresAt } = JSON.parse(stored) as { expiresAt: number };
        if (Date.now() > expiresAt) setVisible(true);
      } catch {
        setVisible(true);
      }
    }, 1200);

    return () => window.clearTimeout(timer);
  }, []);

  function decide(choice: 'accepted' | 'rejected') {
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ choice, expiresAt: Date.now() + oneYear }),
      );
    } catch {
      // Modo privativo pode bloquear o storage — apenas fechamos o aviso.
    }

    // Informa o Consent Mode do Google, quando presente.
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: choice === 'accepted' ? 'granted' : 'denied',
        ad_storage: choice === 'accepted' ? 'granted' : 'denied',
        ad_user_data: choice === 'accepted' ? 'granted' : 'denied',
        ad_personalization: choice === 'accepted' ? 'granted' : 'denied',
      });
    }

    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-3xl md:inset-x-6 md:bottom-6"
          role="dialog"
          aria-live="polite"
          aria-label="Aviso de cookies"
        >
          <div className="flex flex-col gap-4 rounded-lg border border-border bg-background/95 p-5 shadow-elevated backdrop-blur md:flex-row md:items-center md:gap-6 md:p-6">
            <Cookie className="hidden h-8 w-8 shrink-0 text-accent md:block" aria-hidden />
            <div className="flex-1 text-sm leading-relaxed text-muted-foreground">
              <p>
                Usamos cookies para medir a audiência e exibir anúncios que mantêm o conteúdo
                gratuito. Você pode recusar os cookies opcionais sem perder acesso a nada.{' '}
                <Link
                  href="/politica-de-cookies"
                  className="font-medium text-foreground underline decoration-accent decoration-2 underline-offset-4"
                >
                  Ler a Política de Cookies
                </Link>
                .
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="sm" onClick={() => decide('rejected')}>
                Recusar
              </Button>
              <Button variant="accent" size="sm" onClick={() => decide('accepted')}>
                Aceitar
              </Button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

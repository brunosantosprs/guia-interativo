'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Barra de progresso de leitura fixa abaixo do cabeçalho.
 * Usa `useScroll` + `useSpring` para um movimento suave sem custo de layout
 * (anima apenas `scaleX`, propriedade acelerada por GPU).
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-[72px] z-40 h-0.5 origin-left bg-accent"
      aria-hidden
    />
  );
}

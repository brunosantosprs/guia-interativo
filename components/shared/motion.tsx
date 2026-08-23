'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Wrappers de animação usados no site público.
 *
 * Todas as animações respeitam `prefers-reduced-motion` e usam apenas
 * `transform` e `opacity`, propriedades aceleradas por GPU — importante para
 * não prejudicar INP e CLS nos Core Web Vitals.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

interface FadeInProps {
  children: ReactNode;
  /** Atraso em segundos antes de iniciar. */
  delay?: number;
  /** Deslocamento vertical inicial, em pixels. */
  y?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li';
}

/** Revela o conteúdo ao entrar na viewport. */
export function FadeIn({ children, delay = 0, y = 18, className, as = 'div' }: FadeInProps) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {children}
    </Component>
  );
}

const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

interface StaggerProps {
  children: ReactNode;
  className?: string;
}

/** Container que revela os filhos em cascata. */
export function Stagger({ children, className }: StaggerProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={staggerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Item individual de um Stagger. */
export function StaggerItem({ children, className }: StaggerProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

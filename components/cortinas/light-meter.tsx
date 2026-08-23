import { LIGHT_BLOCKING_LABELS, LIGHT_BLOCKING_LEVEL } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { LightBlocking } from '@prisma/client';

interface LightMeterProps {
  level: LightBlocking;
  /** Exibe o rótulo textual acima da barra. */
  showLabel?: boolean;
  className?: string;
}

/**
 * Medidor visual de bloqueio de luz.
 *
 * Traduz o enum `LightBlocking` em uma barra proporcional — é a informação
 * mais consultada de cada tipo de cortina e precisa ser lida em um relance.
 */
export function LightMeter({ level, showLabel = true, className }: LightMeterProps) {
  const percentage = LIGHT_BLOCKING_LEVEL[level];

  return (
    <div className={cn('w-full', className)}>
      {showLabel ? (
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Bloqueio de luz
          </span>
          <span className="text-xs font-semibold text-foreground">{percentage}%</span>
        </div>
      ) : null}

      <div
        className="h-2 w-full overflow-hidden rounded-full bg-secondary/20"
        role="meter"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Bloqueio de luz: ${LIGHT_BLOCKING_LABELS[level]}`}
      >
        <div
          className="h-full rounded-full bg-accent shadow-[0_0_0_1px_hsl(var(--accent))] transition-[width] duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {showLabel ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{LIGHT_BLOCKING_LABELS[level]}</p>
      ) : null}
    </div>
  );
}

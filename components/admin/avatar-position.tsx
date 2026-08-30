'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Move, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface AvatarPositionProps {
  /** URL da foto. Sem ela o controle não aparece. */
  src: string;
  /** Recorte no formato "50% 30%", como o object-position do CSS. */
  value: string;
  /** Aproximação: 1 é o enquadramento original. */
  zoom: number;
  onChange: (posicao: string, zoom: number) => void;
}

const PADRAO = '50% 50%';
const ZOOM_MIN = 1;
const ZOOM_MAX = 3;

function lerPosicao(valor: string): { x: number; y: number } {
  const m = valor.match(/^(\d{1,3})%\s+(\d{1,3})%$/);
  if (!m) return { x: 50, y: 50 };
  return { x: Number(m[1]), y: Number(m[2]) };
}

const limitar = (n: number) => Math.min(100, Math.max(0, Math.round(n)));
const limitarZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(z * 100) / 100));

/**
 * Recorte da foto no avatar: aproximar e escolher o que aparece.
 *
 * Mover sozinho nao resolvia o caso mais comum — retrato de meio corpo, em
 * que o rosto fica pequeno demais no circulo por mais bem posicionado que
 * esteja. Por isso o zoom veio junto.
 *
 * O que se guarda sao dois numeros. A imagem original nao e tocada, entao da
 * para reajustar quantas vezes quiser sem perder qualidade, e a mesma foto
 * pode ser reenquadrada depois sem precisar subir de novo.
 */
export function AvatarPosition({ src, value, zoom, onChange }: AvatarPositionProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [arrastando, setArrastando] = useState(false);
  const pos = lerPosicao(value || PADRAO);
  const z = limitarZoom(zoom || 1);

  /**
   * Onde o arraste comecou: ponteiro e recorte naquele instante.
   *
   * O movimento e relativo a isso. Calcular a posicao direto das coordenadas
   * do ponteiro faz a foto saltar assim que se encosta nela.
   */
  const inicio = useRef({ px: 0, py: 0, x: 50, y: 50 });

  const mover = useCallback(
    (clientX: number, clientY: number) => {
      const area = areaRef.current;
      if (!area) return;

      const r = area.getBoundingClientRect();
      const ref = inicio.current;

      /**
       * Quanto mais aproximada a foto, menor o passo do arraste.
       *
       * Sem isso o controle fica intratavel justamente quando se precisa de
       * precisao: com zoom alto, a area escondida da imagem e maior, e um
       * mesmo deslocamento do dedo varreria a foto inteira.
       */
      const dx = ((clientX - ref.px) / r.width) * 100 * (1 / z);
      const dy = ((clientY - ref.py) / r.height) * 100 * (1 / z);

      // Invertido: arrastar para a direita revela o lado esquerdo da foto.
      onChange(`${limitar(ref.x - dx)}% ${limitar(ref.y - dy)}%`, z);
    },
    [onChange, z],
  );

  useEffect(() => {
    if (!arrastando) return;

    const aoMover = (e: PointerEvent) => {
      e.preventDefault();
      mover(e.clientX, e.clientY);
    };
    const aoSoltar = () => setArrastando(false);

    window.addEventListener('pointermove', aoMover);
    window.addEventListener('pointerup', aoSoltar);
    window.addEventListener('pointercancel', aoSoltar);

    return () => {
      window.removeEventListener('pointermove', aoMover);
      window.removeEventListener('pointerup', aoSoltar);
      window.removeEventListener('pointercancel', aoSoltar);
    };
  }, [arrastando, mover]);

  // A roda do mouse sobre o círculo aproxima e afasta. Registrado à mão
  // porque o React trata onWheel como passivo e não deixa cancelar a
  // rolagem da página.
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;

    const aoRolar = (e: WheelEvent) => {
      e.preventDefault();
      onChange(value || PADRAO, limitarZoom(z + (e.deltaY < 0 ? 0.1 : -0.1)));
    };

    area.addEventListener('wheel', aoRolar, { passive: false });
    return () => area.removeEventListener('wheel', aoRolar);
  }, [onChange, value, z]);

  if (!src) return null;

  function aoTeclar(e: React.KeyboardEvent) {
    const passo = e.shiftKey ? 10 : 2;
    const mapa: Record<string, [number, number]> = {
      ArrowLeft: [-passo, 0],
      ArrowRight: [passo, 0],
      ArrowUp: [0, -passo],
      ArrowDown: [0, passo],
    };

    if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      return onChange(value || PADRAO, limitarZoom(z + 0.1));
    }
    if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      return onChange(value || PADRAO, limitarZoom(z - 0.1));
    }

    const delta = mapa[e.key];
    if (!delta) return;
    e.preventDefault();
    onChange(`${limitar(pos.x + delta[0])}% ${limitar(pos.y + delta[1])}%`, z);
  }

  const noPadrao = (!value || value === PADRAO) && z === 1;

  return (
    <div className="rounded-md border border-border p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Label>Enquadramento da foto</Label>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Aproxime e arraste até o rosto ficar como você quer.
          </p>
        </div>
        {!noPadrao ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(PADRAO, 1)}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Recomeçar
          </Button>
        ) : null}
      </div>

      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start">
        <div
          ref={areaRef}
          role="slider"
          tabIndex={0}
          aria-label="Enquadramento: arraste para mover, use + e - para aproximar"
          aria-valuetext={`horizontal ${pos.x}%, vertical ${pos.y}%, aproximação ${z.toFixed(1)}x`}
          aria-valuenow={pos.y}
          aria-valuemin={0}
          aria-valuemax={100}
          onPointerDown={(e) => {
            e.preventDefault();
            inicio.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y };
            setArrastando(true);
          }}
          onKeyDown={aoTeclar}
          className={`relative h-40 w-40 shrink-0 touch-none select-none overflow-hidden rounded-full border-2 bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            arrastando
              ? 'cursor-grabbing border-solid border-accent'
              : 'cursor-grab border-dashed border-accent/60 hover:border-accent'
          }`}
        >
          {/* img simples, e não next/image: a origem muda a cada upload e o
              tamanho é fixo e pequeno. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            draggable={false}
            className="pointer-events-none h-full w-full select-none object-cover"
            style={{ objectPosition: `${pos.x}% ${pos.y}%`, transform: `scale(${z})` }}
          />

          {!arrastando ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
              <span className="flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium shadow-soft">
                <Move className="h-3.5 w-3.5" aria-hidden />
                Arraste
              </span>
            </div>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <ZoomOut className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              type="range"
              min={ZOOM_MIN}
              max={ZOOM_MAX}
              step={0.05}
              value={z}
              onChange={(e) => onChange(value || PADRAO, limitarZoom(Number(e.target.value)))}
              aria-label="Aproximação da foto"
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-accent"
            />
            <ZoomIn className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground">
              {z.toFixed(1)}x
            </span>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            É assim que a foto aparece no rodapé dos artigos.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            A roda do mouse sobre o círculo também aproxima. Pelo teclado: setas movem, mais e menos
            aproximam, e Shift move mais rápido.
          </p>
        </div>
      </div>
    </div>
  );
}

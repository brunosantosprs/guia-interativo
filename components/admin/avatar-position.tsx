'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Move, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface AvatarPositionProps {
  /** URL da foto. Sem ela o controle não aparece. */
  src: string;
  /** Valor no formato "50% 30%", como o object-position do CSS. */
  value: string;
  onChange: (posicao: string) => void;
}

const PADRAO = '50% 50%';

/** Lê "50% 30%" como {x: 50, y: 30}, caindo no centro se vier torto. */
function lerPosicao(valor: string): { x: number; y: number } {
  const m = valor.match(/^(\d{1,3})%\s+(\d{1,3})%$/);
  if (!m) return { x: 50, y: 50 };
  return { x: Number(m[1]), y: Number(m[2]) };
}

const limitar = (n: number) => Math.min(100, Math.max(0, Math.round(n)));

/**
 * Ajuste do recorte da foto no avatar.
 *
 * A foto entra num circulo e o navegador corta pelo centro. Quando a pessoa
 * posou fora do meio do quadro — o que e comum — o corte pega o lugar
 * errado, e ate hoje a unica saida era editar a imagem por fora e subir de
 * novo.
 *
 * Aqui a pessoa arrasta a propria foto dentro do circulo e ve o resultado
 * exato que vai aparecer no site. O que se guarda e so um par de
 * porcentagens; a imagem original nao e alterada, entao da para reajustar
 * quantas vezes quiser sem perder qualidade.
 */
export function AvatarPosition({ src, value, onChange }: AvatarPositionProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [arrastando, setArrastando] = useState(false);
  const pos = lerPosicao(value || PADRAO);

  /**
   * Onde o arraste comecou: ponteiro e posicao da foto naquele instante.
   *
   * O movimento precisa ser relativo a isso. Calcular a posicao direto das
   * coordenadas do ponteiro faz a foto saltar assim que se encosta nela, o
   * que parece defeito — foi exatamente o que acontecia antes.
   */
  const inicio = useRef({ px: 0, py: 0, x: 50, y: 50 });

  const mover = useCallback(
    (clientX: number, clientY: number) => {
      const area = areaRef.current;
      if (!area) return;

      const r = area.getBoundingClientRect();
      const ref = inicio.current;

      // Quanto o ponteiro andou, em porcentagem da largura do circulo.
      const dx = ((clientX - ref.px) / r.width) * 100;
      const dy = ((clientY - ref.py) / r.height) * 100;

      // Sinal invertido: arrastar para a direita revela o lado esquerdo da
      // foto, e object-position mede o oposto disso.
      onChange(`${limitar(ref.x - dx)}% ${limitar(ref.y - dy)}%`);
    },
    [onChange],
  );

  // Os listeners ficam na janela para o arraste continuar valendo mesmo
  // quando o ponteiro sai do circulo, que e o comportamento esperado.
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

  if (!src) return null;

  /** Teclado: mesma precisão do arraste, para quem não usa mouse. */
  function aoTeclar(e: React.KeyboardEvent) {
    const passo = e.shiftKey ? 10 : 2;
    const mapa: Record<string, [number, number]> = {
      ArrowLeft: [-passo, 0],
      ArrowRight: [passo, 0],
      ArrowUp: [0, -passo],
      ArrowDown: [0, passo],
    };
    const delta = mapa[e.key];
    if (!delta) return;

    e.preventDefault();
    onChange(`${limitar(pos.x + delta[0])}% ${limitar(pos.y + delta[1])}%`);
  }

  return (
    <div className="rounded-md border border-border p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Label>Enquadramento da foto</Label>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Arraste a foto para escolher o que aparece no círculo.
          </p>
        </div>
        {value && value !== PADRAO ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(PADRAO)}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Centralizar
          </Button>
        ) : null}
      </div>

      <div className="mt-4 flex items-center gap-6">
        <div
          ref={areaRef}
          role="slider"
          tabIndex={0}
          aria-label="Enquadramento da foto: arraste ou use as setas do teclado"
          aria-valuetext={`horizontal ${pos.x}%, vertical ${pos.y}%`}
          aria-valuenow={pos.y}
          aria-valuemin={0}
          aria-valuemax={100}
          onPointerDown={(e) => {
            e.preventDefault();
            // Marca o ponto de partida; a foto só se move a partir daqui.
            inicio.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y };
            setArrastando(true);
          }}
          onKeyDown={aoTeclar}
          className={`relative h-36 w-36 shrink-0 touch-none overflow-hidden rounded-full border-2 border-dashed border-accent/60 bg-surface transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            arrastando ? 'cursor-grabbing border-solid border-accent' : 'cursor-grab'
          }`}
        >
          {/* img simples, e não next/image: aqui a origem é uma URL que muda
              a cada upload e o tamanho é fixo e pequeno. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            draggable={false}
            className="h-full w-full select-none object-cover"
            style={{ objectPosition: `${pos.x}% ${pos.y}%` }}
          />

          {/* Visível desde o começo: o controle passa despercebido se o
              convite ao arraste só aparecer no hover. */}
          {!arrastando ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1.5 text-xs font-medium shadow-soft">
                <Move className="h-3.5 w-3.5" aria-hidden />
                Arraste
              </span>
            </div>
          ) : null}
        </div>

        <div className="min-w-0 text-sm text-muted-foreground">
          <p>É assim que a foto aparece no rodapé dos artigos.</p>
          <p className="mt-2 text-xs">
            Com o círculo selecionado, as setas do teclado ajustam de pouco em pouco. Segure Shift
            para mover mais rápido.
          </p>
          <p className="mt-2 font-mono text-xs text-foreground/70">
            {pos.x}% {pos.y}%
          </p>
        </div>
      </div>
    </div>
  );
}

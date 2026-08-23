import {
  Blinds,
  BookOpen,
  ClipboardList,
  Drill,
  Files,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  Ruler,
  Scissors,
  Settings,
  Sparkles,
  SprayCan,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * Registro de ícones referenciados por nome no banco de dados
 * (Service.icon e ADMIN_NAV.icon).
 *
 * Import explícito em vez de acesso dinâmico ao pacote inteiro: o bundler
 * consegue eliminar o que não é usado, mantendo o JavaScript enviado ao
 * cliente pequeno.
 */
const ICONS: Record<string, LucideIcon> = {
  Blinds,
  BookOpen,
  ClipboardList,
  Drill,
  Files,
  FileText,
  Image: ImageIcon,
  LayoutDashboard,
  Ruler,
  Scissors,
  Settings,
  Sparkles,
  SprayCan,
  Users,
  Wrench,
  Zap,
};

interface IconProps {
  /** Nome do ícone (chave do registro acima). */
  name: string;
  className?: string;
  strokeWidth?: number;
}

/** Renderiza um ícone pelo nome, com fallback seguro. */
export function Icon({ name, className, strokeWidth = 1.5 }: IconProps) {
  const Component = ICONS[name] ?? Sparkles;
  return <Component className={className} strokeWidth={strokeWidth} aria-hidden />;
}

export { ICONS };

import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        /**
         * `text-base sm:text-sm`: 16px no celular, 14px do tablet para cima.
         *
         * O Safari do iPhone da zoom na pagina inteira quando o campo que
         * recebe foco tem fonte menor que 16px, e o visitante precisa fechar
         * o zoom com os dedos para continuar. Aos 16px ele nao faz isso. O
         * `sm:text-sm` devolve o tamanho original onde o problema nao existe.
         */
        'flex h-11 w-full rounded-md border border-input bg-background px-3.5 py-2 text-base transition-colors sm:text-sm',
        'placeholder:text-muted-foreground/70',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export { Input };

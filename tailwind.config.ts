import type { Config } from 'tailwindcss';

/**
 * Configuracao do Tailwind CSS do Guia Interativo.
 * As cores sao lidas de CSS Custom Properties (definidas em app/globals.css),
 * o que permite trocar a paleta inteira em runtime via atributo `data-theme`
 * no elemento <html> — recurso controlado pelo painel administrativo.
 */
const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        surface: 'hsl(var(--surface))',
        'surface-soft': 'hsl(var(--surface-soft))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'ui-serif', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-lg': ['clamp(2.75rem, 6vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(2rem, 4.2vw, 3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'display-sm': ['clamp(1.6rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(28,25,23,.04), 0 8px 24px -12px rgba(28,25,23,.12)',
        elevated: '0 2px 6px rgba(28,25,23,.05), 0 24px 48px -24px rgba(28,25,23,.22)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down .2s ease-out',
        'accordion-up': 'accordion-up .2s ease-out',
        'fade-up': 'fade-up .6s cubic-bezier(.22,1,.36,1) both',
        shimmer: 'shimmer 1.6s infinite',
      },
      typography: undefined,
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;

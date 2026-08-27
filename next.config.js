/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'guiainterativo.com' },
      // Imagens enviadas pelo painel (Supabase Storage)
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // As ilustracoes do seed sao SVGs gerados pelo proprio projeto (public/images).
    // O contentSecurityPolicy abaixo impede execucao de script dentro deles.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'date-fns'],
    // Teto de workers na geração estática. Cada worker abre o próprio pool do
    // Prisma; sem esse limite, uma máquina com muitos núcleos estoura o
    // max_connections do PostgreSQL durante o build.
    cpus: 4,
  },
  async headers() {
    // Content-Security-Policy — segunda linha de defesa contra XSS.
    //
    // 'unsafe-inline' em script-src é uma concessão real, não descuido: o
    // Next.js injeta scripts inline de hidratação, e o AdSense injeta os
    // seus em runtime. Uma CSP com nonce exigiria renderização dinâmica em
    // todas as páginas, o que derrubaria o ISR e os Core Web Vitals.
    //
    // Por isso o saneamento de HTML em lib/markdown.ts é a defesa primária,
    // não esta política. A CSP aqui limita o dano: restringe de onde scripts
    // podem vir, impede exfiltração para domínios arbitrários e bloqueia
    // enquadramento em iframe de terceiros.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googlesyndication.com https://*.googletagmanager.com https://*.google-analytics.com https://*.adtrafficquality.google https://*.doubleclick.net https://*.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self'",
      // connect-src precisa cobrir os endpoints REAIS de coleta do GA4, que
      // nao sao obvios:
      //   - analytics.google.com (sem subdominio!) e www.google.com recebem
      //     o page_view. Um padrao "*.analytics.google.com" NAO casa com o
      //     host nu "analytics.google.com" — por isso "*.google.com", que
      //     cobre os dois. Sem isso a CSP bloqueia toda a coleta em silencio:
      //     o gtag carrega, cria os cookies _ga e parece funcionar, mas nenhum
      //     dado chega aos relatorios.
      //   - adtrafficquality.google e usado pelo AdSense na deteccao de
      //     trafego invalido; bloquea-lo atrapalha a veiculacao.
      "connect-src 'self' https://*.google-analytics.com https://*.google.com https://*.googletagmanager.com https://*.googlesyndication.com https://*.adtrafficquality.google https://*.doubleclick.net https://*.supabase.co",
      // Anúncios do AdSense são servidos dentro de iframes
      "frame-src https://*.googlesyndication.com https://*.adtrafficquality.google https://*.doubleclick.net https://*.google.com",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Só tem efeito em HTTPS; ignorado no localhost.
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
      {
        // O painel nunca deve ser indexado nem ficar em cache compartilhado
        source: '/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/posts/:slug', destination: '/blog/:slug', permanent: true },
    ];
  },
};

module.exports = nextConfig;

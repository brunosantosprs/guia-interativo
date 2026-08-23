# Guia Interativo

Portal de conteúdo técnico sobre **cortinas e persianas**, com blog editorial, catálogo de 26 tipos de cortinas, páginas de serviços e painel administrativo completo no estilo WordPress.

Construído para gerar autoridade no nicho e chegar à análise do **Google AdSense** com tudo o que o programa exige: conteúdo original e profundo, políticas legais, navegação clara e slots de anúncio bem posicionados.

**Domínio:** guiainterativo.com · **Idioma:** Português do Brasil

---

## Índice

- [Stack](#stack)
- [O que já vem pronto](#o-que-já-vem-pronto)
- [Instalação](#instalação)
- [Banco de dados](#banco-de-dados)
- [Scripts](#scripts)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Paletas de cores](#paletas-de-cores)
- [Painel administrativo](#painel-administrativo)
- [Google Analytics 4](#google-analytics-4)
- [Google AdSense](#google-adsense)
- [SEO](#seo)
- [Imagens](#imagens)
- [Segurança](#segurança)
- [Deploy na Vercel](#deploy-na-vercel)
- [Checklist de aprovação no AdSense](#checklist-de-aprovação-no-adsense)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) + React 18 |
| Linguagem | TypeScript (strict) |
| Estilo | Tailwind CSS + shadcn/ui (Radix UI) |
| Animações | Framer Motion |
| Banco | PostgreSQL + Prisma ORM |
| Autenticação | NextAuth.js (credenciais + bcrypt) |
| Formulários | React Hook Form + Zod |
| Conteúdo | Markdown (`marked`) renderizado no servidor |
| Analytics | Google Analytics 4 |
| Monetização | Google AdSense |

---

## O que já vem pronto

O seed popula o banco com **todo o conteúdo inicial** — o site nasce publicável.

- **26 tipos de cortinas e persianas**, cada um com descrição rica de 180–250 palavras, vantagens, desvantagens, melhores ambientes, nível de bloqueio de luz, manutenção, instalação e critério de "quando escolher"
- **10 artigos de blog**, todos com mais de 900 palavras, hierarquia de títulos, tabelas comparativas, checklists e links internos
- **6 serviços** com processo passo a passo, entregáveis e FAQ
- **6 páginas institucionais e legais**: Política de Privacidade (LGPD), Termos de Uso, Política de Cookies, Aviso Legal, Política Editorial e Direitos Autorais
- **7 categorias** e tags do blog
- **2 usuários** (administrador e editor)
- **42 registros** na biblioteca de mídia
- Configurações globais do site

Páginas públicas: Home, Tipos de Cortinas (+ detalhe), Serviços (+ detalhe), Blog (+ artigo), Sobre, Contato e os seis documentos institucionais.

---

## Instalação

### Pré-requisitos

- **Node.js 18.17+** (recomendado 20 ou 22)
- **PostgreSQL 14+** rodando localmente, ou uma instância gerenciada (Neon, Supabase, Railway)

### Passo a passo

```bash
npm install
```

Se não tiver PostgreSQL instalado, suba um com Docker (o `docker-compose.yml` já vem configurado com as credenciais do `.env.example`):

```bash
docker compose up -d
```

```bash
cp .env.example .env
```

Abra o `.env` e ajuste, no mínimo:

- `DATABASE_URL` — string de conexão do PostgreSQL
- `NEXTAUTH_SECRET` — gere com `openssl rand -base64 32`

Crie as tabelas e popule o banco:

```bash
npm run db:push
```

```bash
npm run db:seed
```

Suba o servidor:

```bash
npm run dev
```

- Site: <http://localhost:3000>
- Painel: <http://localhost:3000/admin>

**Credenciais de acesso**

O seed **não usa senha padrão**. Ele gera uma senha aleatória forte e a imprime **uma única vez** no terminal, ao criar o usuário:

```
⚠️  ANOTE AGORA — estas senhas não voltam a ser exibidas:

    admin@guiainterativo.com
    ZHL7LNK5FxiKdwf7s_x6FE62
```

Isso é proposital: uma senha fixa no repositório vira a senha de todo mundo que clonar o projeto.

Perdeu a senha? Gere outra:

```bash
npm run admin:password
```

> A senha existe apenas como hash bcrypt na tabela `users`. Nunca fica no `.env`, no código ou em texto puro no banco.

---

## Banco de dados

`prisma/schema.prisma` modela:

| Modelo | Função |
|---|---|
| `User`, `Account`, `Session` | Autenticação e papéis (ADMIN / EDITOR / AUTHOR) |
| `Post`, `Category`, `Tag` | Blog |
| `Page` | Páginas institucionais e legais (aparecem no rodapé conforme `showInFooter`) |
| `CurtainType` | Catálogo de tipos de cortinas |
| `Service` | Serviços, com `steps` e `faq` em JSON |
| `Media` | Biblioteca de mídia |
| `SiteSettings` | Configurações globais (registro único) |
| `ContactMessage`, `Subscriber` | Formulário de contato e newsletter |

### Desenvolvimento vs. produção

- **Desenvolvimento:** `npm run db:push` sincroniza o schema sem gerar migrations
- **Produção:** `npm run db:migrate` gera migrations versionadas em `prisma/migrations/`

O seed é **idempotente** — pode ser executado quantas vezes for necessário.

### Conectando ao Supabase

No painel do Supabase: **Connect → ORMs → Prisma**. Copie as duas strings para o `.env`.

| Variável | Qual usar | Porta | Parâmetros obrigatórios |
|---|---|---|---|
| `DATABASE_URL` | Transaction pooler | `6543` | `?pgbouncer=true&connection_limit=1` |
| `DIRECT_URL` | Session pooler | `5432` | — |

Três pontos que costumam travar a conexão:

**Use o pooler nas duas variáveis.** O host direto (`db.<ref>.supabase.co`) resolve **apenas em IPv6**. Muitas redes domésticas e as funções da Vercel não alcançam IPv6, e o erro que aparece é um `ENETUNREACH` pouco descritivo.

**`pgbouncer=true` não é opcional.** O pgBouncer em modo *transaction* não suporta *prepared statements*. Sem a flag, a aplicação conecta e depois quebra em runtime com `prepared statement "s0" already exists`.

**O usuário é `postgres.<project-ref>`**, não `postgres`. Com o usuário errado o erro é `Tenant or user not found`.

Se a senha tiver caracteres especiais (`@ : / ? # & %`), aplique percent-encoding — `@` vira `%40`, `#` vira `%23`, e assim por diante.

Para validar antes de criar as tabelas:

```bash
npm run db:check
```

O comando testa as duas conexões separadamente, mostra host e porta (nunca a senha) e traduz os erros mais comuns em instrução direta.

---

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (roda `prisma generate` antes) |
| `npm run start` | Servidor de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | Verificação de tipos sem emitir arquivos |
| `npm run db:check` | Testa DATABASE_URL e DIRECT_URL e explica os erros |
| `npm run db:push` | Sincroniza o schema com o banco |
| `npm run db:migrate` | Cria e aplica uma migration |
| `npm run db:seed` | Popula o banco com o conteúdo inicial |
| `npm run db:harden` | Revoga privilégios do PostgREST e garante RLS |
| `npm run db:studio` | Abre o Prisma Studio |
| `npm run db:reset` | Recria o banco do zero e roda o seed |
| `npm run admin:password` | Gera uma nova senha para um usuário do painel |

---

## Estrutura de pastas

```
/
├── app/
│   ├── (public)/              # site público
│   │   ├── page.tsx           # home
│   │   ├── sobre/
│   │   ├── servicos/          # + [slug]
│   │   ├── tipos-de-cortinas/ # + [slug]
│   │   ├── blog/              # + [slug]
│   │   ├── contato/
│   │   ├── politica-de-privacidade/
│   │   ├── termos-de-uso/
│   │   ├── politica-de-cookies/
│   │   ├── [slug]/            # aviso-legal, politica-editorial,
│   │   │                      # direitos-autorais e páginas do painel
│   │   └── layout.tsx
│   ├── (admin)/
│   │   ├── login/
│   │   └── admin/
│   │       ├── page.tsx       # dashboard
│   │       ├── posts/         # + novo, [id]
│   │       ├── pages/         # + novo, [id]
│   │       ├── cortinas/      # + novo, [id]
│   │       ├── servicos/      # + novo, [id]
│   │       ├── media/
│   │       ├── users/
│   │       ├── settings/
│   │       └── layout.tsx
│   ├── api/                   # route handlers
│   ├── layout.tsx
│   ├── globals.css
│   ├── sitemap.ts
│   ├── robots.ts
│   └── not-found.tsx
├── components/
│   ├── ui/                    # shadcn/ui
│   ├── layout/                # header, footer, whatsapp
│   ├── blog/
│   ├── cortinas/
│   ├── admin/
│   └── shared/
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── api.ts
│   ├── markdown.ts
│   ├── settings.ts
│   ├── utils.ts
│   ├── constants.ts
│   └── validations/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   ├── data/                  # conteúdo do seed
│   └── migrations/
├── types/
├── hooks/
├── public/images/
├── middleware.ts
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Rota curinga `(public)/[slug]`

Páginas criadas no painel ganham URL própria automaticamente (`guiainterativo.com/minha-pagina`). Segmentos estáticos como `/blog` e `/servicos` têm prioridade no roteamento do Next.js, então não há conflito.

O rodapé lista as páginas marcadas com **"Exibir no rodapé"** no painel — criar um novo documento legal e ligar esse interruptor já o publica no rodapé, sem tocar em código. `LEGAL_NAV`, em `lib/constants.ts`, serve apenas de rede de segurança caso o banco não responda.

---

## Paletas de cores

Três paletas completas, trocáveis em tempo real pelo painel (**Configurações → Tema**). O tema é aplicado como `data-theme` no `<html>`, e todas as cores do Tailwind derivam de CSS Custom Properties definidas em `app/globals.css`.

### 1. Elegante Neutra Premium — padrão

| Papel | Cor |
|---|---|
| Primária | `#F5F0E9` |
| Secundária | `#2C2C2C` |
| Destaque | `#C4A77D` |
| Fundo | `#FFFFFF` (miolo de leitura) / `#F5F0E9` (seções alternadas) |
| Texto | `#1A1A1A` |

O bege da paleta é usado **cheio** nas seções, não como um branco levemente quente — é o que dá o ritmo visual da página. O grafite aparece em uma faixa no meio da home e no rodapé, e o dourado preenche botões primários, badges e barras de bloqueio de luz.

Esta é a **paleta aprovada e padrão do projeto**. Ela vale em três lugares, e os três precisam concordar:

| Onde | Valor |
|---|---|
| `app/globals.css` | bloco `:root, [data-theme='elegante-neutra']` |
| `lib/settings.ts` | `theme: 'elegante-neutra'` no fallback |
| `prisma/seed.ts` | `theme: 'elegante-neutra'` na criação das configurações |

Trocar o tema no painel altera **apenas** o registro no banco. Um `npm run db:reset` volta para esta paleta.

#### Tokens do tema padrão

| Token | HSL | Uso |
|---|---|---|
| `--background` | `0 0% 100%` | miolo de leitura |
| `--surface` | `35 37% 94%` | seções alternadas, bege cheio |
| `--surface-soft` | `36 33% 97%` | onde o bege cheio pesaria demais |
| `--secondary` | `0 0% 17%` | faixa escura da home e rodapé |
| `--accent` | `35 38% 63%` | botões primários, badges, medidor de luz |
| `--foreground` | `0 0% 10%` | texto |
| `--muted-foreground` | `30 6% 38%` | texto secundário |
| `--border` | `34 24% 86%` | divisórias e contornos |

> Os hex da tabela acima e o HSL do CSS podem diferir em **1 unidade de RGB** por arredondamento da conversão. É imperceptível: o hex é a cor canônica do briefing, o HSL é como o navegador a renderiza.

### 2. Moderna Sofisticada

`#F8F7F4` · `#1F2A24` · `#8A9A7B`

### 3. Aconchegante Premium

`#F9F5F0` · `#3E2F28` · `#B87A5A`

### Tipografia

- **Playfair Display** — títulos (`font-serif`)
- **Inter** — corpo e interface (`font-sans`)

Ambas carregadas via `next/font` com `display: swap`, sem requisição bloqueante.

---

## Painel administrativo

Acesse `/admin` (o middleware redireciona para `/login` se não houver sessão).

### Recursos

- **Dashboard** com métricas de conteúdo, últimas edições e mensagens recebidas
- **CRUD completo** de Posts, Páginas, Tipos de Cortinas e Serviços
- **Editor markdown** com pré-visualização, contador de palavras e tempo estimado de leitura
- **Prévia do resultado no Google** (SERP) em cada formulário
- **Biblioteca de mídia** com filtro por pasta e cópia rápida de URL
- **Gerenciamento de usuários** com três papéis
- **Configurações**: nome, logo, tema, WhatsApp, redes sociais, IDs de Analytics e AdSense, SEO padrão
- **Botão "Republicar"** que dispara revalidação sob demanda (ISR)

### Papéis

| Papel | Permissões |
|---|---|
| **Administrador** | Acesso total, inclusive usuários e configurações |
| **Editor** | Gerencia todo o conteúdo |
| **Autor** | Cria e edita apenas os próprios artigos |

Salvaguardas: não é possível excluir a própria conta, remover o último administrador ativo, nem excluir um usuário com artigos publicados.

---

## Google Analytics 4

1. Crie uma propriedade GA4 e copie o **ID de medição** (`G-XXXXXXXXXX`)
2. Cole em **Configurações → Integrações**, ou defina `NEXT_PUBLIC_GA_MEASUREMENT_ID` no `.env`

Já implementado:

- Anonimização de IP ativada
- `page_view` disparado a cada navegação do App Router
- Eventos personalizados: `whatsapp_click`, `share`, `generate_lead`
- Google Consent Mode atualizado conforme a escolha no aviso de cookies

Deixe o campo vazio em desenvolvimento — nada é carregado.

---

## Google AdSense

### Slots já posicionados

| Slot | Onde aparece |
|---|---|
| `topBanner` | Faixa horizontal na home |
| `inArticle` | No meio do corpo dos artigos e das fichas de cortina |
| `sidebar` | Lateral fixa em telas grandes |
| `footer` | Antes do rodapé, em listagens |
| `inFeed` | Entre blocos de conteúdo do catálogo |

### Como ativar

1. Aprove sua conta no AdSense
2. Copie o **ID do cliente** (`ca-pub-...`) e cole em **Configurações → Integrações**
3. Ative a chave **"Exibir anúncios"**
4. Gere os blocos no painel do AdSense e substitua os IDs de exemplo em `lib/constants.ts` → `ADSENSE_SLOTS`

Enquanto o AdSense estiver desativado, os slots renderizam **espaços reservados discretos** — o layout já fica validado antes da aprovação, sem nenhuma requisição externa.

### Conformidade

- Todo bloco é rotulado como **"Publicidade"** e visualmente separado do conteúdo
- Os slots reservam altura mínima, evitando *layout shift* (CLS)
- Aviso de cookies com opção de recusa e integração ao Consent Mode
- Aviso editorial no rodapé e ao final de cada artigo
- `robots.txt` libera explicitamente o `Mediapartners-Google`

---

## SEO

Implementado em todas as páginas:

- **Metadata API** do Next.js com título, descrição, canonical, Open Graph e Twitter Card
- **JSON-LD**: `Organization`, `WebSite`, `Article`, `Product`, `Service`, `FAQPage`, `BreadcrumbList`
- **Sitemap dinâmico** em `/sitemap.xml`, gerado a partir do banco
- **robots.txt** com bloqueio de `/admin` e `/api`
- **Breadcrumbs** visíveis e estruturados
- **Sumário automático** nos artigos, a partir dos títulos H2/H3
- **ISR** com revalidação por rota e republicação sob demanda

### Core Web Vitals

- Fontes com `display: swap` e pré-conexão
- Imagens via `next/image` com AVIF/WebP e `sizes` explícito
- Markdown convertido no servidor — zero JS enviado para renderizar o texto
- Animações apenas em `transform` e `opacity`, com `prefers-reduced-motion` respeitado
- Slots de anúncio com altura reservada

---

## Imagens

O projeto acompanha **46 fotografias reais** de cortinas, persianas e ambientes, em `public/images/` (~12 MB no total):

| Pasta | Conteúdo |
|---|---|
| `cortinas/` | 26 fotos, uma por tipo do catálogo |
| `blog/` | 10 capas de artigo |
| `servicos/` | 6 fotos de serviço |
| raiz | `hero`, `sobre`, `contato`, `og-default` |

As imagens vêm do **Unsplash**, sob a [Licença Unsplash](https://unsplash.com/license) — uso livre, inclusive comercial, sem necessidade de permissão. A lista completa com fotógrafo e link do original está em [`public/images/CREDITOS.md`](public/images/CREDITOS.md).

O logotipo (`logo.svg`), o favicon (`app/icon.svg`) e os avatares de autor continuam em SVG, gerados para o projeto.

### Upload pelo painel

O painel tem upload de arquivo em todos os campos de imagem — artigos, tipos de cortinas, serviços e a biblioteca de mídia. Três formas de usar:

- **Arrastar e soltar** o arquivo sobre a área tracejada
- **Escolher arquivo** pelo seletor do sistema
- **Biblioteca** para reaproveitar uma imagem já enviada

Os arquivos vão para o **Supabase Storage**, no bucket `media` (criado automaticamente no primeiro upload), e são servidos por CDN. Cada upload também vira um registro na biblioteca de mídia.

| Detalhe | Valor |
|---|---|
| Formatos | JPG, PNG, WebP, AVIF, GIF |
| Tamanho máximo | 8 MB |
| Bucket | `media` (público) |
| Rota | `POST /api/media/upload` |

**Por que não `public/uploads/`:** na Vercel o sistema de arquivos das funções é efêmero — qualquer arquivo gravado ali some no próximo deploy.

**SVG não é aceito** no upload: pode carregar script embutido. Os SVGs do projeto (logo, favicon, avatares) são versionados em `public/images/`.

Para habilitar, preencha no `.env`:

```
NEXT_PUBLIC_SUPABASE_URL="https://SEU_PROJECT_REF.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="..."
```

A `service_role` está em **Supabase → Settings → API**. Ela ignora todas as regras de RLS, então é usada **somente no servidor** — nunca com prefixo `NEXT_PUBLIC_`. Sem ela, o upload retorna uma mensagem explicando o que falta, e o campo de URL continua funcionando normalmente.

### Trocar uma imagem sem upload

1. Substitua o arquivo em `public/images/` mantendo o nome, **ou**
2. Cole a URL no campo abaixo da pré-visualização
3. Para hosts externos, adicione o domínio em `next.config.js` → `images.remotePatterns`

> `dangerouslyAllowSVG` está habilitado com CSP restritiva (`script-src 'none'; sandbox`), necessário para o logotipo em SVG. Se for aceitar SVG enviado por terceiros, desative essa opção.

---

## Segurança

### Banco de dados

O Supabase publica o schema `public` na internet via PostgREST (`https://<ref>.supabase.co/rest/v1/…`), usando a chave `anon` — que é pública por design. Como esta aplicação acessa o banco **apenas pelo Prisma**, os papéis do PostgREST não precisam de privilégio nenhum:

```bash
npm run db:harden
```

O script ([`prisma/security.sql`](prisma/security.sql)) revoga todos os privilégios de `anon` e `authenticated`, inclusive para tabelas futuras (`ALTER DEFAULT PRIVILEGES`), e garante RLS ligado em tudo.

Antes: consultas como `anon` retornavam 0 linhas — protegidas apenas pelo RLS.
Depois: retornam `permission denied` (42501). A proteção deixou de depender de o RLS continuar ligado.

> Se um dia quiser usar `supabase-js` no navegador, reverta os GRANTs e crie políticas RLS explícitas. As instruções estão no cabeçalho do arquivo.

### Conteúdo

O HTML gerado a partir do markdown é sanitizado em [`lib/markdown.ts`](lib/markdown.ts) antes de ir para a página:

- Tags removidas: `script`, `iframe`, `object`, `embed`, `form`, `base`, `meta`, `link`, `style`
- Atributos `on*` (onclick, onerror, onload…) removidos
- URLs em `href`/`src` restritas a `http`, `https`, `mailto`, `tel` e caminhos relativos

O filtro de URL normaliza entidades HTML e caracteres de controle antes de comparar — `java&#115;cript:` e `java\tscript:` são bloqueados, não só a forma literal.

Isso vale mesmo com o conteúdo vindo de usuários autenticados: uma conta de autor comprometida não deve conseguir gravar XSS persistente.

### Upload

- Tipo verificado pelos **bytes do arquivo**, não pelo `Content-Type` (que é falsificável)
- SVG recusado — aceita script embutido
- Limite de 8 MB, validado no cliente e no servidor
- A `service_role` é usada só no servidor, nunca com prefixo `NEXT_PUBLIC_`
- Remover um item da biblioteca apaga também o arquivo no Storage

### Autenticação

- Senhas apenas como hash **bcrypt** (custo 12) — nunca em texto puro
- **8 tentativas** por e-mail em 15 minutos; depois disso até a senha correta é recusada
- Comparação bcrypt executada mesmo sem usuário, para não revelar quais e-mails existem por tempo de resposta
- Sem senha padrão: o seed gera uma aleatória e mostra uma vez

### Cabeçalhos HTTP

| Cabeçalho | Valor |
|---|---|
| `Content-Security-Policy` | restringe origens de script, estilo, fonte, imagem e frame |
| `Strict-Transport-Security` | 2 anos, `includeSubDomains`, `preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | câmera, microfone, geolocalização e FLoC desabilitados |

`/admin/*` e `/api/*` recebem ainda `X-Robots-Tag: noindex` e `Cache-Control: no-store`.

> A CSP usa `'unsafe-inline'` em `script-src`. Não é descuido: o Next.js injeta scripts inline de hidratação e o AdSense injeta os seus em runtime. Usar `nonce` exigiria renderização dinâmica em toda página, o que derrubaria o ISR. Por isso a sanitização de HTML é a defesa primária — a CSP limita o dano.

### O que continua sendo sua responsabilidade

- Rodar `npm run db:harden` também em qualquer novo ambiente
- Não commitar o `.env` (já coberto pelo `.gitignore`)
- Rotacionar a senha do banco se ela vazar: **Supabase → Settings → Database → Reset database password**
- Em produção, considerar rate limiting de borda (WAF da Vercel) — o limitador de login é em memória e, em serverless, cada instância tem o seu

---

## Deploy na Vercel

1. Suba o repositório para o GitHub
2. Importe o projeto em [vercel.com/new](https://vercel.com/new)
3. Provisione um PostgreSQL pelo **Vercel Marketplace** (Neon é uma boa escolha) ou use um banco externo
4. Configure as variáveis de ambiente:

| Variável | Observação |
|---|---|
| `DATABASE_URL` | Connection string (com `?sslmode=require`) |
| `DIRECT_URL` | Conexão direta, exigida por provedores com pooling |
| `NEXTAUTH_URL` | `https://guiainterativo.com` |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | `https://guiainterativo.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Só números, com DDI |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Opcional |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Opcional |
| `REVALIDATE_SECRET` | Token para revalidação via webhook |

5. Faça o deploy
6. Rode as migrations e o seed apontando para o banco de produção:

```bash
npx prisma migrate deploy
```

```bash
npm run db:seed
```

7. Aponte o domínio `guiainterativo.com` para a Vercel
8. Envie `https://guiainterativo.com/sitemap.xml` ao Google Search Console

O build roda `prisma generate` automaticamente. As páginas com ISR seguem funcionando mesmo que o banco fique indisponível — todas as consultas têm fallback.

---

## Checklist de aprovação no AdSense

- [x] Conteúdo original, extenso e útil (26 fichas + 10 artigos de 900+ palavras)
- [x] Política de Privacidade completa, com LGPD e divulgação do AdSense
- [x] Termos de Uso
- [x] Política de Cookies com tabela de cookies e instruções de desativação
- [x] Aviso Legal com isenção de responsabilidade sobre orientação técnica
- [x] Política Editorial declarando fontes, revisão e independência de anunciantes
- [x] Política de Direitos Autorais com procedimento de notificação
- [x] Página Sobre com política editorial e transparência sobre monetização
- [x] Página de Contato funcional
- [x] Navegação clara e consistente
- [x] Design responsivo e profissional
- [x] Aviso de cookies com opção de recusa
- [x] Aviso editorial separando conteúdo de publicidade
- [x] Sitemap e robots.txt configurados
- [ ] Domínio próprio apontado e com HTTPS ativo
- [ ] Tráfego orgânico inicial (recomenda-se aguardar algumas semanas antes de solicitar)
- [ ] IDs reais de AdSense preenchidos nas configurações

---

## Licença

Projeto proprietário do **Guia Interativo**. O código pode ser adaptado livremente pelo proprietário do domínio.

/**
 * Verificacao de ambiente executada antes do build.
 *
 * Por que existe: quando DATABASE_URL chega vazia, o Next.js compila o
 * projeto inteiro normalmente e so quebra minutos depois, ao pre-renderizar
 * a primeira pagina que le o banco. O erro que aparece no log e do Prisma,
 * aponta para schema.prisma:13 e nao menciona variavel de ambiente nenhuma.
 * Quem le conclui que o problema esta no codigo.
 *
 * Este script falha em dois segundos, nomeando a variavel que falta e onde
 * preenche-la. Tambem barra as tres armadilhas de configuracao que ja
 * custaram tempo neste projeto: host direto do Supabase (IPv6), pooler de
 * transacao sem pgbouncer=true, e service_role exposta ao navegador.
 *
 * Nenhuma senha e impressa: as URLs aparecem sempre mascaradas.
 */

import fs from 'node:fs';

const naVercel = process.env.VERCEL === '1';
const erros = [];
const avisos = [];

/**
 * Carrega o .env local.
 *
 * Necessario porque este script roda antes do Next.js, que e quem
 * normalmente le o arquivo. Na Vercel nao existe .env — as variaveis ja
 * chegam no ambiente — entao a ausencia do arquivo nao e problema.
 *
 * Valores ja presentes no ambiente tem prioridade e nunca sao sobrescritos.
 */
function carregarEnvLocal(arquivo = '.env') {
  if (!fs.existsSync(arquivo)) return;

  for (const linha of fs.readFileSync(arquivo, 'utf8').split('\n')) {
    const par = /^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/i.exec(linha);
    if (!par) continue;

    const [, chave, bruto] = par;
    if (process.env[chave] !== undefined) continue;

    // Remove aspas ao redor e comentario solto depois de valor sem aspas
    const valor = /^(['"])([\s\S]*)\1\s*$/.exec(bruto.trim());
    process.env[chave] = valor ? valor[2] : bruto.split(' #')[0].trim();
  }
}

if (!naVercel) carregarEnvLocal();

/** Esconde a senha antes de qualquer coisa ir para o log de build. */
function mascarar(url) {
  return String(url).replace(/(\/\/[^:/@]+):[^@]*@/, '$1:****@');
}

/** Devolve {host, port, params} ou null se a URL nao for interpretavel. */
function analisar(url) {
  try {
    const u = new URL(url);
    return { host: u.hostname, port: u.port, params: u.searchParams };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Banco de dados — sem isto o build nao tem como gerar pagina nenhuma
// ---------------------------------------------------------------------------

const databaseUrl = process.env.DATABASE_URL?.trim();
const directUrl = process.env.DIRECT_URL?.trim();

if (!databaseUrl) {
  erros.push(
    'DATABASE_URL esta vazia.\n' +
      '    O conteudo do site (artigos, tipos de cortina, paginas legais) vive\n' +
      '    no banco. Sem esta variavel o build nao tem o que publicar.\n' +
      '    Preencha em: Vercel > Settings > Environment Variables',
  );
}

if (!directUrl) {
  erros.push(
    'DIRECT_URL esta vazia.\n' +
      '    Use o Session pooler do Supabase (porta 5432).',
  );
}

if (databaseUrl) {
  const db = analisar(databaseUrl);

  if (!db) {
    erros.push(
      `DATABASE_URL nao pode ser interpretada: ${mascarar(databaseUrl)}\n` +
        '    Se a senha tiver @ : / ? # & ou %, ela precisa de percent-encoding\n' +
        '    (@ = %40, # = %23, & = %26, / = %2F, : = %3A, ? = %3F, % = %25).',
    );
  } else {
    // Host direto do Supabase so resolve em IPv6. As funcoes da Vercel nao
    // alcancam IPv6, e o erro em runtime e um ENETUNREACH sem explicacao.
    if (/^db\.[a-z0-9]+\.supabase\.co$/i.test(db.host)) {
      erros.push(
        `DATABASE_URL aponta para o host direto do Supabase (${db.host}).\n` +
          '    Esse endereco responde apenas em IPv6, que a Vercel nao alcanca.\n' +
          '    Troque pelo pooler: Supabase > Connect > ORMs > Prisma',
      );
    }

    // pgBouncer em modo transaction nao suporta prepared statements.
    if (db.port === '6543' && db.params.get('pgbouncer') !== 'true') {
      erros.push(
        'DATABASE_URL usa o Transaction pooler (porta 6543) sem pgbouncer=true.\n' +
          '    O Prisma quebra em runtime assim. Acrescente ao final da URL:\n' +
          '    ?pgbouncer=true&connection_limit=1',
      );
    }
  }
}

if (directUrl) {
  const direct = analisar(directUrl);

  if (direct?.port === '6543') {
    avisos.push(
      'DIRECT_URL esta na porta 6543 (Transaction pooler).\n' +
        '    prisma migrate e db push precisam de conexao real — use a 5432.',
    );
  }
}

// ---------------------------------------------------------------------------
// Autenticacao do painel
// ---------------------------------------------------------------------------

const secret = process.env.NEXTAUTH_SECRET?.trim();

if (!secret) {
  const recado =
    'NEXTAUTH_SECRET esta vazia. Sem ela o login do painel nao funciona.\n' +
    '    Gere um valor novo com:\n' +
    '    node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"';
  // Em producao isso e falha; localmente e so um aviso.
  (naVercel ? erros : avisos).push(recado);
} else if (secret.length < 32) {
  avisos.push(`NEXTAUTH_SECRET tem apenas ${secret.length} caracteres. Use 32 ou mais.`);
}

const nextauthUrl = process.env.NEXTAUTH_URL?.trim();

if (naVercel && nextauthUrl && !nextauthUrl.startsWith('https://')) {
  erros.push(
    `NEXTAUTH_URL = ${nextauthUrl}\n` +
      '    Em producao precisa ser o dominio publico, com https.\n' +
      '    Com localhost aqui, o login redireciona para a maquina do visitante.',
  );
}

// ---------------------------------------------------------------------------
// Seguranca — service_role nunca pode chegar ao navegador
// ---------------------------------------------------------------------------

/**
 * Descreve o que ha de perigoso no valor, ou null se nao houver nada.
 *
 * Conferir so o nome da variavel nao basta: uma service_role colada dentro
 * de algo chamado NEXT_PUBLIC_SUPABASE_ANON_KEY passaria batido — nome
 * inocente, conteudo que ignora todas as regras de seguranca do banco.
 */
function segredoNoValor(valor) {
  if (!valor) return null;

  // Chaves novas do Supabase trazem o proposito no prefixo
  if (valor.startsWith('sb_secret_')) return 'e uma chave secreta do Supabase';

  // Strings de conexao carregam a senha do banco
  if (/^postgres(ql)?:\/\//i.test(valor)) return 'e uma string de conexao com o banco';

  // Chaves classicas do Supabase sao JWTs: o papel esta no payload
  if (valor.startsWith('eyJ')) {
    const payload = valor.split('.')[1];
    if (!payload) return null;
    try {
      const { role } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
      if (role && role !== 'anon') return `e um token com papel "${role}"`;
    } catch {
      // Nao era JWT legivel — nada a declarar
    }
  }

  return null;
}

for (const [chave, valor] of Object.entries(process.env)) {
  if (!chave.startsWith('NEXT_PUBLIC_')) continue;

  const porNome = /SERVICE_ROLE|SECRET|PASSWORD|PRIVATE/i.test(chave)
    ? 'o nome indica um segredo'
    : null;
  const porValor = segredoNoValor(valor);

  if (porNome || porValor) {
    erros.push(
      `${chave} tem o prefixo NEXT_PUBLIC_, mas ${porValor ?? porNome}.\n` +
        '    Tudo com esse prefixo e embutido no JavaScript enviado ao\n' +
        '    navegador, onde qualquer visitante le. Remova o prefixo e use\n' +
        '    a variavel apenas no servidor.',
    );
  }
}

if (naVercel && !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
  avisos.push(
    'SUPABASE_SERVICE_ROLE_KEY esta vazia.\n' +
      '    O site publica normalmente, mas o upload de imagens pelo painel\n' +
      '    vai responder "armazenamento nao configurado".',
  );
}

// ---------------------------------------------------------------------------
// Resultado
// ---------------------------------------------------------------------------

if (avisos.length > 0) {
  console.warn(`\n  Avisos (${avisos.length}) — o build continua:\n`);
  for (const aviso of avisos) console.warn(`  ! ${aviso}\n`);
}

if (erros.length > 0) {
  console.error(`\n${'='.repeat(72)}`);
  console.error(`  BUILD INTERROMPIDO — ${erros.length} variavel(is) de ambiente com problema`);
  console.error(`${'='.repeat(72)}\n`);
  for (const erro of erros) console.error(`  x ${erro}\n`);
  console.error(`${'='.repeat(72)}`);
  console.error('  Corrija os itens acima e rode o deploy de novo.');
  console.error(`${'='.repeat(72)}\n`);
  process.exit(1);
}

console.log('  Ambiente verificado: banco, autenticacao e chaves em ordem.');

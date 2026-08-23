/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

/**
 * Diagnostico de conexao com o banco.
 *
 * Testa as duas variaveis separadamente, porque elas falham por motivos
 * diferentes: DATABASE_URL passa pelo pooler (runtime) e DIRECT_URL e usada
 * por migrate/db push. Em provedores como o Supabase e comum uma funcionar e
 * a outra nao.
 *
 * Executar com: npm run db:check
 */

interface Target {
  label: string;
  env: 'DATABASE_URL' | 'DIRECT_URL';
  hint: string;
}

const TARGETS: Target[] = [
  {
    label: 'DATABASE_URL (runtime da aplicação)',
    env: 'DATABASE_URL',
    hint: 'No Supabase deve ser o Transaction pooler (porta 6543) com ?pgbouncer=true&connection_limit=1',
  },
  {
    label: 'DIRECT_URL (migrations e db push)',
    env: 'DIRECT_URL',
    hint: 'No Supabase deve ser o Session pooler (porta 5432), sem pgbouncer=true',
  },
];

/** Mostra host, porta e parâmetros sem nunca imprimir a senha. */
function describe(raw: string): string {
  try {
    const url = new URL(raw);
    const params = url.searchParams.toString();
    return `${url.username}@${url.hostname}:${url.port || '5432'}${url.pathname}${params ? `?${params}` : ''}`;
  } catch {
    return '(string de conexão inválida)';
  }
}

/**
 * Extrai a linha realmente informativa do erro do Prisma.
 * A primeira linha costuma ser só "Invalid `prisma.x()` invocation:", que não
 * diz nada — a causa aparece algumas linhas abaixo.
 */
function meaningfulLine(message: string): string {
  const lines = message
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^Invalid `.*` invocation:?$/.test(line))
    .filter((line) => !/^at\s/.test(line));

  return lines[0] ?? message.trim();
}

/**
 * Problemas detectáveis antes de tentar conectar — evita erro de rede
 * confuso quando a causa é simplesmente o .env incompleto.
 */
function preflight(raw: string): string | null {
  try {
    const url = new URL(raw);

    // Só o valor exato conta como placeholder: uma senha real pode
    // perfeitamente conter a palavra "senha".
    const placeholders = [
      '[your-password]',
      'your-password',
      'sua_senha',
      '[senha]',
      'senha',
      '[password]',
      'password',
    ];
    if (placeholders.includes(decodeURIComponent(url.password).toLowerCase())) {
      return 'A senha ainda é o placeholder. Substitua no .env pela senha real do banco.';
    }

    if (!url.password) {
      return 'A string não tem senha. O formato é postgresql://usuario:SENHA@host:porta/banco';
    }
    if (/supabase\.com$/i.test(url.hostname) && !url.username.includes('.')) {
      return 'No pooler do Supabase o usuário precisa ser postgres.<project-ref>.';
    }
    if (/^db\..*\.supabase\.co$/i.test(url.hostname)) {
      return 'Este é o host direto do Supabase, que só responde em IPv6. Use o pooler (*.pooler.supabase.com).';
    }
  } catch {
    return 'String de conexão malformada.';
  }

  return null;
}

/** Traduz os erros mais comuns em uma instrução acionável. */
function explain(message: string): string | null {
  if (/prepared statement .* already exists|bind message/i.test(message)) {
    return 'Falta ?pgbouncer=true na DATABASE_URL (pgBouncer em modo transaction não aceita prepared statements).';
  }
  if (/password authentication failed|Authentication failed against/i.test(message)) {
    return 'Host, porta e usuário estão corretos — só a senha está errada. Redefina em Supabase → Settings → Database → Reset database password.';
  }
  if (/ENOTFOUND|EAI_AGAIN|getaddrinfo/i.test(message)) {
    return 'Host não resolvido. Confira a região no host do pooler (aws-0/aws-1 e sa-east-1).';
  }
  if (/ENETUNREACH|EHOSTUNREACH/i.test(message)) {
    return 'Rede inalcançável — provavelmente o host direto (IPv6). Use o pooler nas duas variáveis.';
  }
  if (/ETIMEDOUT|timeout/i.test(message)) {
    return 'Tempo esgotado. Verifique firewall/porta (6543 para transaction, 5432 para session).';
  }
  if (/Tenant or user not found/i.test(message)) {
    return 'Usuário deve ser postgres.<project-ref> quando se usa o pooler.';
  }
  if (/does not exist/i.test(message) && /database/i.test(message)) {
    return 'Nome do banco incorreto — no Supabase é sempre /postgres.';
  }
  return null;
}

async function main() {
  console.log('\n🔌  Testando conexão com o banco\n');
  let failures = 0;

  for (const target of TARGETS) {
    const raw = process.env[target.env];

    if (!raw) {
      console.log(`⚠️   ${target.label}\n    não definida no .env\n`);
      failures++;
      continue;
    }

    console.log(`▸  ${target.label}`);
    console.log(`   ${describe(raw)}`);

    // Verificações locais primeiro: erro de rede não explica .env incompleto
    const problem = preflight(raw);
    if (problem) {
      failures++;
      console.log(`   ❌ ${problem}\n`);
      continue;
    }

    const client = new PrismaClient({
      datasources: { db: { url: raw } },
      log: [],
    });

    const started = Date.now();
    try {
      const rows = await client.$queryRaw<
        { version: string }[]
      >`SELECT version() as version`;
      const ms = Date.now() - started;
      const version = rows[0]?.version.split(' ').slice(0, 2).join(' ') ?? 'PostgreSQL';
      console.log(`   ✅ conectou em ${ms} ms — ${version}\n`);
    } catch (error) {
      failures++;
      const message = error instanceof Error ? error.message : String(error);
      console.log(`   ❌ falhou: ${meaningfulLine(message)}`);

      const tip = explain(message);
      if (tip) console.log(`   → ${tip}`);
      console.log(`   → ${target.hint}\n`);
    } finally {
      await client.$disconnect();
    }
  }

  if (failures === 0) {
    console.log('Tudo certo. Próximos passos:\n');
    console.log('   npm run db:push     # cria as tabelas');
    console.log('   npm run db:seed     # popula o conteúdo\n');
  } else {
    console.log(`${failures} conexão(ões) com problema. Corrija o .env e rode de novo.\n`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

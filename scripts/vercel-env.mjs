/**
 * Envia as variaveis de ambiente para a Vercel a partir do .env local.
 *
 * Por que existe: o .env esta no .gitignore e nunca chega ao repositorio —
 * essa e justamente a protecao que impede a senha do banco de ir junto com
 * o codigo. O efeito colateral e ter que redigitar tudo no painel, campo a
 * campo, onde um caractere trocado vira um build quebrado sem explicacao.
 *
 * Este script le o .env e empurra os valores pela CLI. Nenhum valor e
 * impresso: o relatorio mostra apenas o nome, a origem e o tamanho.
 *
 * Tres variaveis NAO sao copiadas do .env, de proposito:
 *
 *   NEXTAUTH_SECRET e REVALIDATE_SECRET sao gerados novos. Reaproveitar o
 *   segredo de desenvolvimento significa que quem tiver acesso a esta
 *   maquina pode forjar sessao de administrador em producao.
 *
 *   NEXTAUTH_URL e NEXT_PUBLIC_SITE_URL apontam para localhost no .env.
 *   Copiados como estao, o login em producao redirecionaria o visitante
 *   para a maquina dele.
 *
 * Uso:
 *   node scripts/vercel-env.mjs --dry     mostra o que seria enviado
 *   node scripts/vercel-env.mjs           envia de verdade
 *   node scripts/vercel-env.mjs --url=https://outro-dominio.com
 */

import fs from 'node:fs';
import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const simulacao = args.includes('--dry');
const urlProducao =
  args.find((a) => a.startsWith('--url='))?.slice(6) ?? 'https://guiainterativo.com';

// ---------------------------------------------------------------------------

/** Le o .env sem depender de dependencia externa. */
function lerEnv(arquivo = '.env') {
  if (!fs.existsSync(arquivo)) {
    console.error('\n  x Nao encontrei o arquivo .env nesta pasta.\n');
    process.exit(1);
  }

  const valores = {};
  for (const linha of fs.readFileSync(arquivo, 'utf8').split('\n')) {
    const par = /^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/i.exec(linha);
    if (!par) continue;

    const [, chave, bruto] = par;
    const comAspas = /^(['"])([\s\S]*)\1\s*$/.exec(bruto.trim());
    valores[chave] = comAspas ? comAspas[2] : bruto.split(' #')[0].trim();
  }
  return valores;
}

const env = lerEnv();
const segredo = () => randomBytes(32).toString('base64');

/**
 * origem: 'env' copia do arquivo, 'gerar' cria valor novo, 'url' usa o
 * dominio de producao. ambientes seguem a nomenclatura da CLI.
 */
const DESTINOS = [
  { nome: 'DATABASE_URL', origem: 'env', ambientes: ['production', 'preview'] },
  { nome: 'DIRECT_URL', origem: 'env', ambientes: ['production', 'preview'] },
  // Sem o prefixo NEXT_PUBLIC_ de proposito: a URL so e usada no servidor
  // (lib/storage.ts). Com o prefixo, o Next substitui o valor no build, e
  // uma variavel marcada como "Secret" na Vercel nao existe nessa etapa —
  // o upload quebra em producao mesmo com tudo cadastrado.
  { nome: 'SUPABASE_URL', origem: 'env', de: 'NEXT_PUBLIC_SUPABASE_URL', ambientes: ['production', 'preview'] },
  { nome: 'SUPABASE_SERVICE_ROLE_KEY', origem: 'env', ambientes: ['production', 'preview'] },
  { nome: 'NEXTAUTH_SECRET', origem: 'gerar', ambientes: ['production', 'preview'] },
  { nome: 'REVALIDATE_SECRET', origem: 'gerar', ambientes: ['production', 'preview'] },
  // Só em producao: nos previews a URL muda a cada deploy, e o NextAuth
  // descobre sozinho pelo VERCEL_URL quando a variavel esta ausente.
  { nome: 'NEXTAUTH_URL', origem: 'url', ambientes: ['production'] },
  { nome: 'NEXT_PUBLIC_SITE_URL', origem: 'url', ambientes: ['production'] },
  {
    nome: 'NEXT_PUBLIC_SITE_NAME',
    origem: 'env',
    ambientes: ['production', 'preview'],
    opcional: true,
  },
  {
    nome: 'NEXT_PUBLIC_WHATSAPP_NUMBER',
    origem: 'env',
    ambientes: ['production', 'preview'],
    opcional: true,
  },
  {
    nome: 'NEXT_PUBLIC_CONTACT_EMAIL',
    origem: 'env',
    ambientes: ['production', 'preview'],
    opcional: true,
  },
];

// ---------------------------------------------------------------------------
// Conferencias antes de mandar qualquer coisa
// ---------------------------------------------------------------------------

if (!fs.existsSync('.vercel/project.json')) {
  console.error('\n  x Esta pasta ainda nao esta ligada a um projeto da Vercel.');
  console.error('    Rode antes:  npx vercel link\n');
  process.exit(1);
}

const impedimentos = [];

for (const destino of DESTINOS) {
  if (destino.origem !== 'env' || destino.opcional) continue;

  // `de` permite renomear na Vercel uma variavel que tem outro nome no .env.
  const valor = env[destino.de ?? destino.nome];
  if (!valor) {
    impedimentos.push(`${destino.de ?? destino.nome} esta vazia no .env local.`);
    continue;
  }

  // Enviar um endereco de localhost para a Vercel produz um site que sobe
  // e nao conecta em nada — o erro so aparece em runtime.
  if (/localhost|127\.0\.0\.1/.test(valor)) {
    impedimentos.push(`${destino.nome} aponta para localhost — nao serve em producao.`);
  }
}

if (impedimentos.length > 0) {
  console.error('\n  Nada foi enviado:\n');
  for (const problema of impedimentos) console.error(`  x ${problema}`);
  console.error('');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Envio
// ---------------------------------------------------------------------------

console.log(`\n  Dominio de producao: ${urlProducao}`);
console.log(simulacao ? '  Modo simulacao — nada sera enviado.\n' : '  Enviando...\n');

let enviadas = 0;
let puladas = 0;

for (const destino of DESTINOS) {
  const valor =
    destino.origem === 'gerar'
      ? segredo()
      : destino.origem === 'url'
        ? urlProducao
        : env[destino.de ?? destino.nome];

  if (!valor) {
    console.log(`  - ${destino.nome.padEnd(28)} sem valor no .env, pulada`);
    puladas++;
    continue;
  }

  const rotulo =
    destino.origem === 'gerar'
      ? 'gerada agora'
      : destino.origem === 'url'
        ? 'dominio de producao'
        : 'copiada do .env';

  for (const ambiente of destino.ambientes) {
    if (simulacao) {
      console.log(
        `  · ${destino.nome.padEnd(28)} ${ambiente.padEnd(11)} ${rotulo} (${valor.length} car.)`,
      );
      continue;
    }

    const resultado = spawnSync(
      'npx',
      ['vercel', 'env', 'add', destino.nome, ambiente, '--force', '--yes'],
      { input: valor, encoding: 'utf8', shell: true },
    );

    if (resultado.status === 0) {
      console.log(`  ok ${destino.nome.padEnd(28)} ${ambiente.padEnd(11)} ${rotulo}`);
      enviadas++;
    } else {
      const erro = (resultado.stderr || resultado.stdout || '').trim().split('\n').pop();
      console.error(`  x  ${destino.nome.padEnd(28)} ${ambiente.padEnd(11)} ${erro}`);
    }
  }
}

if (simulacao) {
  console.log('\n  Simulacao concluida. Rode sem --dry para enviar.\n');
} else {
  console.log(`\n  ${enviadas} envio(s) concluido(s), ${puladas} variavel(is) pulada(s).`);
  console.log('  Agora publique:  npx vercel --prod\n');
}

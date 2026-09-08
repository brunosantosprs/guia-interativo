/**
 * Confere, no site publicado, as tres pecas que o Google procura.
 *
 * Por que existe: as paginas do site sao geradas e ficam em cache na
 * Vercel, e esse cache sobrevive ao deploy. Ja aconteceu de o /ads.txt
 * estar correto no ar enquanto o script e a meta tag continuavam ausentes
 * das paginas, porque o HTML delas tinha sido gerado antes de o ID existir
 * nas configuracoes. Olhar so uma pagina, ou so o ads.txt, engana.
 *
 * Este script busca as paginas de verdade, uma de cada tipo de rota, e diz
 * o que encontrou em cada uma.
 *
 * uso: npm run adsense:check
 *      npm run adsense:check -- https://outro-dominio.com
 */

const SITE = process.argv[2]?.replace(/\/$/, '') || 'https://guiainterativo.com';

/** Uma rota de cada tipo: se o cache estiver velho em alguma, aparece aqui. */
const ROTAS = [
  '/',
  '/blog',
  '/blog/persiana-rolante-externa-de-seguranca',
  '/tipos-de-cortinas',
  '/tipos-de-cortinas/cortina-de-linho',
  '/servicos',
  '/servicos/medicao-tecnica-profissional',
  '/sobre',
  '/contato',
  '/politica-de-privacidade',
];

const RE_PUB = /pub-\d{10,20}/;

async function pegar(url) {
  try {
    const r = await fetch(url, { headers: { 'user-agent': 'guia-interativo-check' } });
    return { ok: r.ok, status: r.status, texto: await r.text(), idade: r.headers.get('age') };
  } catch (erro) {
    return { ok: false, status: 0, texto: '', erro: String(erro) };
  }
}

console.log(`\n  Verificando ${SITE}\n`);

// ---------------------------------------------------------------------------
// 1. ads.txt
// ---------------------------------------------------------------------------

const ads = await pegar(`${SITE}/ads.txt`);
const linhas = ads.texto
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'));
const idsNoArquivo = [...new Set(linhas.map((l) => RE_PUB.exec(l)?.[0]).filter(Boolean))];

console.log('  ads.txt');
if (!ads.ok) {
  console.log(`    x  HTTP ${ads.status} — o arquivo nao esta sendo servido`);
} else if (idsNoArquivo.length === 0) {
  console.log('    x  responde, mas nao declara nenhum publisher');
} else {
  console.log(`    ok HTTP 200, ${linhas.length} linha(s)`);
  for (const id of idsNoArquivo) console.log(`       ${id}`);
}

// ---------------------------------------------------------------------------
// 2. Script e meta tag, pagina por pagina
// ---------------------------------------------------------------------------

console.log('\n  Paginas');

let comScript = 0;
let comMeta = 0;
const idsNasPaginas = new Set();

for (const rota of ROTAS) {
  const p = await pegar(`${SITE}${rota}`);

  if (!p.ok) {
    console.log(`    x  ${rota.padEnd(46)} HTTP ${p.status}`);
    continue;
  }

  const script = /adsbygoogle\.js\?client=(ca-pub-\d+)/.exec(p.texto);
  const meta = /<meta name="google-adsense-account" content="(ca-pub-\d+)"/.exec(p.texto);

  if (script) {
    comScript++;
    idsNasPaginas.add(script[1]);
  }
  if (meta) {
    comMeta++;
    idsNasPaginas.add(meta[1]);
  }

  const marca = script && meta ? 'ok' : ' x';
  const idade = p.idade ? `  cache ${Math.round(Number(p.idade) / 60)} min` : '';
  console.log(
    `    ${marca} ${rota.padEnd(46)} script:${script ? 'sim' : 'NAO'}  meta:${meta ? 'sim' : 'NAO'}${idade}`,
  );
}

// ---------------------------------------------------------------------------
// Veredito
// ---------------------------------------------------------------------------

const total = ROTAS.length;
const tudoNasPaginas = comScript === total && comMeta === total;
const idsBatem =
  idsNasPaginas.size === 1 &&
  idsNoArquivo.length === 1 &&
  [...idsNasPaginas][0] === `ca-${idsNoArquivo[0]}`;

console.log(`\n  ${'-'.repeat(62)}`);
console.log(`  script em ${comScript}/${total} paginas · meta tag em ${comMeta}/${total}`);

if (idsNasPaginas.size > 1) {
  console.log(`  x  ATENCAO: mais de um ID nas paginas: ${[...idsNasPaginas].join(', ')}`);
} else if (idsNoArquivo.length > 1) {
  console.log(`  !  o ads.txt declara ${idsNoArquivo.length} publishers — confira se todos sao seus`);
}

if (ads.ok && tudoNasPaginas && idsBatem) {
  console.log('  ok TUDO CERTO: mesmo ID no ads.txt, no script e na meta tag,');
  console.log('     presente em todas as rotas verificadas.');
  process.exit(0);
}

console.log('  x  ALGO FALTA. Paginas sem o codigo servem HTML de cache antigo;');
console.log('     republicar as rotas resolve.');
process.exit(1);

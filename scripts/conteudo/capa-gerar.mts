import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { prisma } from '../../lib/prisma';

/**
 * Gera a imagem de capa de um post usando a API de imagem do Gemini
 * (o modelo apelidado de "nano banana").
 *
 * uso: npm run capa:gerar -- <slug-do-post> [--aplicar]
 *      npm run capa:gerar -- --modelos          (lista os modelos disponiveis)
 *
 * Precisa de GEMINI_API_KEY no .env. A chave e criada de graca em
 * aistudio.google.com — a geracao de imagem em si e cobrada por imagem.
 *
 * Sem --aplicar so monta e mostra o prompt, sem chamar a API e sem gastar.
 */

const API = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Dois provedores possiveis, escolhidos pela chave que existir no .env.
 *
 *  - Gemini:            GEMINI_API_KEY
 *  - Compativel OpenAI: OPENAI_API_KEY + OPENAI_BASE_URL
 *
 * O segundo atende OpenAI direto e tambem gateways que falam o mesmo
 * protocolo (AgentRouter, OpenRouter e afins) — basta apontar a base.
 *
 * Atencao: gateway que proxia /chat/completions nem sempre proxia
 * /images/generations, que e um endpoint separado. Use --modelos para
 * descobrir o que a sua conta realmente oferece antes de gerar.
 */
type Provedor = 'gemini' | 'openai';

function escolherProvedor(): { tipo: Provedor; chave: string; base?: string } {
  if (process.env.OPENAI_API_KEY) {
    return {
      tipo: 'openai',
      chave: process.env.OPENAI_API_KEY,
      base: (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, ''),
    };
  }
  if (process.env.GEMINI_API_KEY) {
    return { tipo: 'gemini', chave: process.env.GEMINI_API_KEY };
  }
  throw new Error(
    'nenhuma chave de imagem configurada no .env\n\n' +
      '  Opcao A — Gemini ("nano banana"):\n' +
      '    GEMINI_API_KEY="..."            chave em https://aistudio.google.com/apikey\n\n' +
      '  Opcao B — compativel com OpenAI (OpenAI, AgentRouter, OpenRouter):\n' +
      '    OPENAI_API_KEY="..."\n' +
      '    OPENAI_BASE_URL="https://agentrouter.org/v1"\n\n' +
      '  Depois rode: npm run capa:gerar -- --modelos\n' +
      '  Nunca versione o .env — ele ja esta no .gitignore.',
  );
}

/**
 * Estilo travado, identico para todas as capas.
 *
 * O ponto de uma serie de 60 capas nao e cada imagem ser bonita — e as 60
 * parecerem do mesmo site. Por isso enquadramento, luz, paleta e proibicoes
 * ficam fixos aqui, e so o assunto muda por artigo.
 */
const ESTILO = [
  'Fotografia editorial de interiores, realista, sem pessoas.',
  'Luz natural suave de janela, no fim da tarde, sem sol estourado.',
  'Paleta neutra e quente: off-white, areia, madeira clara, um toque de bronze.',
  'Composicao horizontal limpa, com area de respiro, profundidade rasa.',
  'Aparencia de foto de revista de arquitetura brasileira contemporanea.',
  'Sem texto, sem letras, sem marca, sem logotipo, sem marca d agua.',
  'Sem colagem, sem moldura, sem borda, sem efeito de ilustracao.',
].join(' ');

/** Proporcao de previa social: 1200x630 e o que o Facebook e o WhatsApp esperam. */
const PROPORCAO = 'Enquadramento horizontal panoramico, proporcao 1.91:1.';

/** Palavras que costumam aparecer no nome de modelo que gera imagem. */
const PISTA_IMAGEM = /image|imagen|dall|flux|sd-|stable-?diffusion|nano-?banana/i;

async function listarModelos(p: { tipo: Provedor; chave: string; base?: string }) {
  if (p.tipo === 'gemini') {
    const r = await fetch(`${API}/models?key=${p.chave}`);
    const j = (await r.json()) as { models?: Array<{ name: string; supportedGenerationMethods?: string[] }> };
    if (!j.models) throw new Error(`resposta inesperada: ${JSON.stringify(j).slice(0, 300)}`);

    console.log('Gemini — modelos que geram conteudo:\n');
    for (const m of j.models) {
      if (!m.supportedGenerationMethods?.includes('generateContent')) continue;
      const nome = m.name.replace('models/', '');
      console.log(`  ${nome}${PISTA_IMAGEM.test(nome) ? '   <-- gera imagem' : ''}`);
    }
    console.log('\nUse o marcado em GEMINI_IMAGE_MODEL no .env.');
    return;
  }

  const r = await fetch(`${p.base}/models`, { headers: { Authorization: `Bearer ${p.chave}` } });
  if (!r.ok) {
    throw new Error(
      `o provedor recusou a listagem (HTTP ${r.status}):\n${(await r.text()).slice(0, 300)}\n\n` +
        'Confira OPENAI_BASE_URL e OPENAI_API_KEY no .env.',
    );
  }

  const j = (await r.json()) as { data?: Array<{ id: string }> };
  const ids = (j.data ?? []).map((m) => m.id).sort();
  const imagem = ids.filter((id) => PISTA_IMAGEM.test(id));

  console.log(`${p.base} — ${ids.length} modelos disponiveis\n`);
  if (imagem.length) {
    console.log('Candidatos a geracao de imagem:\n');
    for (const id of imagem) console.log(`  ${id}`);
    console.log('\nUse um deles em OPENAI_IMAGE_MODEL no .env.');
  } else {
    console.log('NENHUM modelo com cara de geracao de imagem nesta conta.');
    console.log('Os modelos listados parecem ser todos de texto — inclusive os GPT-5.6,');
    console.log('que sao de raciocinio e programacao, nao de imagem.\n');
    console.log('Primeiros 20 para conferencia:');
    for (const id of ids.slice(0, 20)) console.log(`  ${id}`);
  }
}

/** Chama o provedor configurado e devolve os bytes da imagem. */
async function gerar(p: { tipo: Provedor; chave: string; base?: string }, prompt: string): Promise<Buffer> {
  if (p.tipo === 'gemini') {
    const modelo = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';
    console.log(`  chamando ${modelo} (Gemini)...`);

    const r = await fetch(`${API}/models/${modelo}:generateContent?key=${p.chave}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    if (!r.ok) {
      throw new Error(
        `a API recusou (HTTP ${r.status}):\n${(await r.text()).slice(0, 400)}\n\n` +
          'Se a mensagem for sobre o modelo, rode "npm run capa:gerar -- --modelos".',
      );
    }

    const j = (await r.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ inlineData?: { data: string } }> } }>;
    };
    const parte = j.candidates?.[0]?.content?.parts?.find((x) => x.inlineData);
    if (!parte?.inlineData) throw new Error(`a resposta nao trouxe imagem:\n${JSON.stringify(j).slice(0, 400)}`);

    return Buffer.from(parte.inlineData.data, 'base64');
  }

  const modelo = process.env.OPENAI_IMAGE_MODEL;
  if (!modelo) {
    throw new Error(
      'falta OPENAI_IMAGE_MODEL no .env\n\n' +
        'Rode "npm run capa:gerar -- --modelos" para ver quais modelos de imagem\n' +
        'a sua conta oferece. Modelos de texto — inclusive os GPT-5.6 — nao servem:\n' +
        'eles sao de raciocinio e programacao, nao geram imagem.',
    );
  }

  console.log(`  chamando ${modelo} em ${p.base}...`);

  const r = await fetch(`${p.base}/images/generations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.chave}` },
    body: JSON.stringify({ model: modelo, prompt, n: 1, size: '1536x1024' }),
  });

  if (!r.ok) {
    throw new Error(
      `o provedor recusou (HTTP ${r.status}):\n${(await r.text()).slice(0, 400)}\n\n` +
        'HTTP 404 aqui costuma significar que o gateway nao proxia /images/generations —\n' +
        'ele repassa chat, mas nao geracao de imagem. Nesse caso, use o Gemini.',
    );
  }

  const j = (await r.json()) as { data?: Array<{ b64_json?: string; url?: string }> };
  const item = j.data?.[0];
  if (item?.b64_json) return Buffer.from(item.b64_json, 'base64');
  if (item?.url) return Buffer.from(await (await fetch(item.url)).arrayBuffer());

  throw new Error(`a resposta nao trouxe imagem:\n${JSON.stringify(j).slice(0, 400)}`);
}

async function main() {
  const args = process.argv.slice(2);
  const provedor = escolherProvedor();

  if (args.includes('--modelos')) return listarModelos(provedor);

  const slug = args.find((a) => !a.startsWith('--'));
  if (!slug) throw new Error('uso: npm run capa:gerar -- <slug-do-post> [--aplicar]');

  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!post) throw new Error(`post nao encontrado: ${slug}`);

  // O assunto sai do proprio artigo, para a capa combinar com o texto.
  const assunto = post.coverImageAlt?.trim() || post.excerpt.split('.')[0];
  const prompt = `${assunto}. ${ESTILO} ${PROPORCAO}`;

  console.log(`${post.title}`);
  console.log(`  categoria: ${post.category?.name}`);
  console.log(`  capa atual: ${post.coverImage ?? '(nenhuma)'}`);
  console.log(`\n  prompt:\n    ${prompt}\n`);

  if (!args.includes('--aplicar')) {
    console.log('SIMULACAO — a API nao foi chamada e nada foi gasto.');
    console.log('Rode de novo com --aplicar para gerar de verdade.');
    return;
  }

  const bruto = await gerar(provedor, prompt);

  // Recorta para 1200x630 exatos — o modelo nem sempre respeita a proporcao pedida.
  const sharp = (await import('sharp')).default;
  const final = await sharp(bruto).resize(1200, 630, { fit: 'cover', position: 'center' }).jpeg({ quality: 82 }).toBuffer();

  mkdirSync('public/images/blog', { recursive: true });
  const caminho = `public/images/blog/${slug}.jpg`;

  if (existsSync(caminho)) {
    mkdirSync('.backups-conteudo/capas', { recursive: true });
    const carimbo = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const { copyFileSync } = await import('node:fs');
    copyFileSync(caminho, `.backups-conteudo/capas/${slug}.${carimbo}.jpg`);
    console.log(`  capa anterior salva em .backups-conteudo/capas/`);
  }

  writeFileSync(caminho, final);

  await prisma.post.update({
    where: { slug },
    data: { coverImage: `/images/blog/${slug}.jpg` },
  });

  console.log(`\nOK: ${caminho}  (${Math.round(final.length / 1024)} KB, 1200x630)`);
  console.log(`     coverImage do post atualizado`);
}

main()
  .catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

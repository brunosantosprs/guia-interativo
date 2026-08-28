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

async function listarModelos(chave: string) {
  const r = await fetch(`${API}/models?key=${chave}`);
  const j = (await r.json()) as { models?: Array<{ name: string; supportedGenerationMethods?: string[] }> };
  if (!j.models) throw new Error(`resposta inesperada: ${JSON.stringify(j).slice(0, 300)}`);

  console.log('Modelos que geram conteudo:\n');
  for (const m of j.models) {
    if (!m.supportedGenerationMethods?.includes('generateContent')) continue;
    const nome = m.name.replace('models/', '');
    const marca = /image/i.test(nome) ? '  <-- gera imagem' : '';
    console.log(`  ${nome}${marca}`);
  }
  console.log('\nUse o que tiver "image" no nome em GEMINI_IMAGE_MODEL no .env.');
}

async function main() {
  const args = process.argv.slice(2);
  const chave = process.env.GEMINI_API_KEY;

  if (!chave) {
    throw new Error(
      'falta GEMINI_API_KEY no .env\n' +
        '  1. crie a chave em https://aistudio.google.com/apikey\n' +
        '  2. acrescente a linha GEMINI_API_KEY="sua-chave" no arquivo .env\n' +
        '  3. nunca versione o .env — ele ja esta no .gitignore',
    );
  }

  if (args.includes('--modelos')) return listarModelos(chave);

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

  const modelo = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';
  console.log(`  chamando ${modelo}...`);

  const resposta = await fetch(`${API}/models/${modelo}:generateContent?key=${chave}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  if (!resposta.ok) {
    const erro = await resposta.text();
    throw new Error(
      `a API recusou (HTTP ${resposta.status}):\n${erro.slice(0, 400)}\n\n` +
        'Se a mensagem for sobre o modelo, rode "npm run capa:gerar -- --modelos"\n' +
        'para ver os nomes disponiveis e ajuste GEMINI_IMAGE_MODEL no .env.',
    );
  }

  const dados = (await resposta.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ inlineData?: { data: string; mimeType: string } }> } }>;
  };

  const parte = dados.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!parte?.inlineData) {
    throw new Error(`a resposta nao trouxe imagem:\n${JSON.stringify(dados).slice(0, 400)}`);
  }

  const bruto = Buffer.from(parte.inlineData.data, 'base64');

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

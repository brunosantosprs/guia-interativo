---
name: capas-de-post
description: Gera a imagem de capa de um post do blog com a API de imagem do Gemini (nano banana), no formato de prévia social. Use quando faltar capa em um artigo novo, quando a capa atual for genérica ou repetida, ou quando o usuário pedir imagem para um post.
---

# Capas de post do Guia Interativo

Gera capas 1200×630 para os artigos do blog, mantendo as 70 imagens com
aparência de série — mesmo enquadramento, mesma luz, mesma paleta.

## Antes de rodar

A chave fica em `GEMINI_API_KEY` no `.env`, criada em
`https://aistudio.google.com/apikey`. **Nunca peça a chave ao usuário no chat
nem a escreva em nenhum arquivo** — ele mesmo coloca no `.env`, que já está no
`.gitignore`.

Se a chave não existir, o script explica o passo a passo e para. Não tente
contornar.

## Como usar

```bash
# vê o prompt que seria enviado, sem chamar a API e sem gastar
npm run capa:gerar -- <slug-do-post>

# gera de verdade, salva em public/images/blog/<slug>.jpg e atualiza o post
npm run capa:gerar -- <slug-do-post> --aplicar

# se a API reclamar do modelo, lista os disponíveis
npm run capa:gerar -- --modelos
```

**Sempre rode primeiro sem `--aplicar`.** Cada imagem gerada é cobrada, e a
simulação mostra o prompt exato — que é onde os erros aparecem.

## O que o script faz sozinho

- Monta o prompt a partir do `coverImageAlt` do post, ou da primeira frase do
  resumo se não houver alt
- Trava o estilo (luz, paleta, enquadramento, proibições) para as capas
  formarem um conjunto
- Recorta para 1200×630 exatos com `sharp` — o modelo nem sempre respeita a
  proporção pedida, e essa é a proporção que WhatsApp e Facebook esperam
- Salva a capa anterior em `.backups-conteudo/capas/` antes de sobrescrever
- Atualiza o `coverImage` do post no banco

## Regras de conteúdo

- **Nunca gere imagem com texto, logotipo ou marca.** O estilo já proíbe, mas
  confira o resultado — modelo de imagem às vezes inventa letras.
- **Nunca gere pessoas.** O site é editorial e técnico, não de lifestyle.
- **A imagem é ilustração, não registro.** Se um artigo mostrar um produto
  específico como se fosse foto real dele, ajuste o alt para descrever a cena,
  não o produto.
- Depois de gerar, **olhe a imagem** antes de considerar pronta. Recorte
  automático às vezes corta o assunto principal.

## Ajustar o estilo

O bloco `ESTILO` em `scripts/conteudo/capa-gerar.mts` é a identidade visual da
série. Mudá-lo muda todas as capas geradas dali em diante — o que cria duas
gerações de imagem no mesmo blog. Se precisar mudar, combine com o usuário se
vale regerar as anteriores.

/**
 * Artigos do blog do Guia Interativo.
 *
 * Todos os textos tem mais de 900 palavras, estrutura hierarquica de titulos
 * (H2/H3), listas, tabelas comparativas e linkagem interna — formato exigido
 * tanto pelo Google Search quanto pela analise editorial do AdSense.
 */
export interface PostSeed {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categorySlug: string;
  tags: string[];
  coverImage: string;
  coverImageAlt: string;
  featured?: boolean;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  /** Dias atras em que o artigo foi publicado (usado para gerar publishedAt). */
  daysAgo: number;
}

export const posts: PostSeed[] = [
  {
    title: 'Como escolher a cortina ideal para cada ambiente da casa',
    slug: 'como-escolher-a-cortina-ideal-para-cada-ambiente',
    categorySlug: 'guias-praticos',
    tags: ['cortinas', 'ambientes', 'decoração', 'guia'],
    featured: true,
    daysAgo: 3,
    coverImage: '/images/blog/como-escolher-a-cortina-ideal-para-cada-ambiente.jpg',
    coverImageAlt: 'Sala de estar com cortina clara filtrando a luz da tarde',
    excerpt:
      'Cada cômodo impõe exigências diferentes de luz, privacidade e manutenção. Este guia percorre ambiente por ambiente e mostra qual sistema de cortina resolve cada situação — com os critérios técnicos por trás de cada escolha.',
    metaTitle: 'Como escolher a cortina ideal para cada ambiente da casa',
    metaDescription:
      'Guia completo para escolher cortinas por ambiente: sala, quarto, cozinha, banheiro, home office e varanda. Critérios de luz, privacidade, umidade e manutenção.',
    keywords: [
      'como escolher cortina',
      'cortina para sala',
      'cortina para quarto',
      'cortina por ambiente',
      'tipos de cortina',
    ],
    content: `Escolher cortina parece uma decisão estética, mas na prática é uma decisão funcional com consequências diárias. A cortina errada faz o quarto clarear às cinco da manhã no verão, transforma a sala em estufa às três da tarde, ou obriga você a lavar um tecido delicado toda semana porque instalou algodão claro ao lado do fogão.

Este guia inverte a ordem habitual: em vez de começar pelo tecido que você gostou, começa pelo problema que cada ambiente apresenta. A escolha correta aparece quase sozinha quando o diagnóstico está bem-feito.

## Os cinco critérios que decidem tudo

Antes de entrar ambiente por ambiente, vale fixar os critérios que se repetem em qualquer projeto. Toda decisão de cortina responde, em alguma medida, a estas cinco perguntas:

1. **Quanta luz precisa ser bloqueada?** Vai de "apenas suavizar o ofuscamento" até "escuridão absoluta às dez da manhã".
2. **Que tipo de privacidade é necessária?** Privacidade diurna e noturna são problemas diferentes e exigem soluções diferentes.
3. **Qual a exposição solar e térmica?** Fachada oeste com sol da tarde é um cenário completamente distinto de uma janela sul que nunca recebe sol direto.
4. **Há umidade, gordura ou sujeira frequente?** Isso elimina categorias inteiras de material.
5. **Com que frequência a peça precisará ser limpa ou operada?** Uma cortina que você abre e fecha duas vezes por dia sofre um desgaste que uma peça decorativa nunca conhecerá.

Guarde essas cinco perguntas. Elas reaparecem em cada seção abaixo.

## Sala de estar: luz filtrada de dia, privacidade à noite

A sala é o ambiente com o requisito mais contraditório da casa. Durante o dia você quer claridade, vista e amplitude. À noite, com as luzes acesas, a janela vira um espelho para fora e a privacidade desaparece.

A resposta clássica é a **composição dupla**: um voil ou linho leve no trilho da frente, que filtra a luz e suaviza o ofuscamento sem escurecer, e um tecido mais encorpado atrás — blackout, linho pesado ou veludo — que se fecha à noite.

Quando o projeto é mais contemporâneo e existe sanca de gesso, a [cortina wave](/tipos-de-cortinas/cortina-wave-onda-perfeita) é a escolha natural: as ondas verticais uniformes funcionam especialmente bem em vãos largos e contínuos, comuns em salas integradas.

Se a sala tem fachada envidraçada e uma vista que vale a pena preservar, considere a [persiana screen solar](/tipos-de-cortinas/persiana-screen-solar). Ela bloqueia de 90% a 99% dos raios UV e reduz o calor mantendo a visão externa — algo que nenhum tecido convencional entrega.

### O erro mais comum na sala

Instalar a cortina rente ao vão. Fixar o trilho próximo ao teto, e não logo acima da janela, alonga visualmente o pé-direito e faz o ambiente parecer maior. É um ajuste que não custa nada e muda a percepção do espaço inteiro.

## Quarto: o único ambiente em que blackout não é exagero

No dormitório, a prioridade é a qualidade do sono. A produção de melatonina é diretamente suprimida pela luz que atinge a retina, inclusive através das pálpebras fechadas. Não é preferência estética: é fisiologia.

A [cortina blackout](/tipos-de-cortinas/cortina-blackout-de-tecido) é a base. Mas há um detalhe que quase todo mundo descobre tarde: **o tecido blackout não garante um quarto escuro**. A luz que incomoda entra pelas frestas — laterais, topo e barra inferior.

Para chegar perto da escuridão real:

- Instale **acima do vão**, nunca dentro dele
- Garanta **transbordo lateral de 15 a 20 cm** de cada lado
- Use **bandô ou sanca** para vedar a parte superior
- Deixe a barra praticamente **encostando no piso**

Quando isso não basta — quarto voltado para um poste de luz, por exemplo — o [sistema zip](/tipos-de-cortinas/cortina-rolo-com-sistema-zip), com trilhos laterais que travam as bordas do tecido, é o único que elimina as frestas de verdade.

Em quartos de casal, a composição de voil com blackout continua sendo a solução mais confortável: permite ter luz filtrada durante o dia sem abrir mão do escuro à noite.

## Cozinha: gordura, umidade e limpeza frequente

A cozinha elimina de saída quase todos os tecidos naturais e delicados. Gordura em suspensão adere às fibras, umidade favorece mofo e a limpeza precisa ser frequente.

As opções que realmente funcionam:

- **[Persiana horizontal de alumínio](/tipos-de-cortinas/persiana-horizontal-de-aluminio)**: imune à umidade, limpa com desengordurante, custo baixo
- **Persiana rolô em tecido sintético ou screen**: superfície lisa, sem lâminas para higienizar
- **[Cortina romana](/tipos-de-cortinas/cortina-romana) em painel único**: quando a bancada encosta na janela e uma cortina tradicional atrapalharia
- **[Cortina café](/tipos-de-cortinas/cortina-cafe-meia-cortina)**: para privacidade na altura dos olhos sem perder claridade

Evite algodão claro, linho e qualquer fibra natural não tratada perto do fogão.

## Banheiro: privacidade total e resistência à água

O banheiro combina a exigência máxima de privacidade com o pior cenário de umidade da casa. Madeira está fora. Fibras naturais estão fora. Tecidos que não secam rápido também.

O que resta funciona muito bem: persiana de alumínio, persiana de PVC, rolô em tecido sintético com tratamento antimofo e vidro jateado como solução complementar. Se o banheiro tiver janela voltada para área comum do prédio, prefira sistemas que bloqueiem totalmente a visão, e não apenas a difundam.

## Home office: a batalha contra o ofuscamento

Quem trabalha com tela enfrenta um problema específico: o reflexo. Luz direta batendo no monitor causa fadiga visual em poucas horas.

A screen solar com fator de abertura de 3% a 5% é a resposta mais eficiente — corta o ofuscamento, preserva a vista e não escurece o ambiente a ponto de exigir luz artificial ao meio-dia. Em salas de videochamada frequente, considere que tecidos muito claros atrás de você criam contraluz e prejudicam a imagem da câmera.

A [persiana double vision](/tipos-de-cortinas/persiana-double-vision) também funciona bem aqui, porque permite ajustar a luminosidade ao longo do dia sem precisar levantar o painel inteiro.

## Varanda e área gourmet: vento antes de tudo

Em varandas, o inimigo número um não é a luz: é o vento. Painéis soltos batem, enrolam, desgastam e fazem barulho.

A solução técnica é o sistema com **trilhos laterais (zip)**, que trava as bordas do tecido e impede o balanço. Combinado com tela screen, ele fecha o espaço contra vento, poeira e insetos mantendo ventilação filtrada e vista.

Em varandas cobertas e protegidas, [persianas de bambu e palha](/tipos-de-cortinas/persiana-de-bambu-e-palha) criam um efeito de luz filtrada difícil de reproduzir com qualquer outro material.

## Tabela rápida por ambiente

| Ambiente | Sistema recomendado | Bloqueio de luz |
|---|---|---|
| Sala de estar | Voil + blackout, wave ou screen | Baixo a alto |
| Quarto | Blackout com transbordo ou sistema zip | Blackout |
| Cozinha | Alumínio, rolô sintético ou romana | Médio a alto |
| Banheiro | Alumínio, PVC ou rolô sintético | Alto |
| Home office | Screen 3–5% ou double vision | Médio |
| Varanda | Screen com sistema zip | Médio |
| Quarto de bebê | Blackout sem cordões, motorizado | Blackout |

## Três decisões que valem mais que a escolha do tecido

Depois de acompanhar centenas de projetos, três fatores se repetem como determinantes do resultado final — e nenhum deles é o tecido:

**Altura de instalação.** Fixar próximo ao teto em vez de rente ao vão muda a proporção percebida do ambiente inteiro.

**Metragem de franzido.** Uma cortina com 1,5 vez a largura do vão parece pobre independentemente do tecido. Com 2,5 a 3 vezes, o mesmo tecido parece caro.

**Transbordo lateral.** É o que separa "cortina blackout" de "quarto escuro". Sem 15 cm de sobra de cada lado, a luz entra pelas bordas e todo o investimento se perde.

## Antes de fechar a compra

Meça o vão em três larguras e três alturas diferentes — paredes raramente são paralelas, e a diferença dentro do mesmo vão passa facilmente de dois centímetros. Peça amostra física do tecido e observe-a na luz do próprio ambiente, em horários diferentes do dia. E confirme o que existe atrás da parede antes de furar: um eletroduto perfurado transforma uma instalação simples em uma pequena reforma.

A cortina certa é a que você esquece que está lá — porque simplesmente resolve o problema.`,
  },
  {
    title: 'Como medir a janela para cortinas e persianas: guia passo a passo',
    slug: 'como-medir-janela-para-cortinas-e-persianas',
    categorySlug: 'guias-praticos',
    tags: ['medidas', 'instalação', 'cortinas', 'persianas'],
    featured: true,
    daysAgo: 9,
    coverImage: '/images/blog/como-medir-janela-para-cortinas-e-persianas.jpg',
    coverImageAlt: 'Trena metálica medindo a largura de uma janela',
    excerpt:
      'Peças sob medida não têm troca por erro de medida. Aprenda o método profissional: três pontos de largura, três de altura, verificação de esquadro e a decisão entre instalar dentro ou fora do vão.',
    metaTitle: 'Como medir janela para cortina e persiana — passo a passo profissional',
    metaDescription:
      'Método completo para medir janelas: três pontos de largura e altura, esquadro, transbordo lateral, folga de piso e a diferença entre instalação interna e externa.',
    keywords: [
      'como medir janela para cortina',
      'medida de persiana',
      'medir cortina sob medida',
      'transbordo lateral cortina',
    ],
    content: `Cortinas e persianas sob medida são fabricadas exclusivamente para o seu vão. Isso significa que não existe troca por erro de medida — se a peça vier dois centímetros mais estreita, você conviverá com uma fresta de luz permanente; se vier dois centímetros mais larga, ela simplesmente não entra.

A boa notícia é que medir corretamente não exige ferramenta cara nem experiência. Exige método. Este guia reproduz o mesmo procedimento usado em medição técnica profissional.

## O que você precisa antes de começar

- **Trena metálica** de pelo menos 5 metros (trena de tecido estica e falseia a medida)
- **Nível** — de bolha resolve, a laser é muito melhor
- **Lápis e papel** ou o bloco de notas do celular
- **Escada** estável, se a janela for alta
- **Uma segunda pessoa** para vãos acima de 2 metros

E, principalmente: **decida o sistema antes de medir**. Rolô, romana, wave e painel japonês usam referências de medida completamente diferentes. Medir sem saber o que será instalado é medir duas vezes.

## Passo 1: decida onde a peça será instalada

Esta é a decisão mais importante do processo, e ela precede qualquer medida.

### Instalação dentro do vão

A peça fica embutida no recuo da janela, encostada no caixilho.

**A favor:** visual limpo, a moldura da janela permanece visível, não avança sobre a parede, libera espaço para móveis.

**Contra:** sempre sobram frestas laterais de luz. Sempre. Mesmo com folga mínima de fabricação, entra claridade pelas bordas. Também exige profundidade suficiente de recuo — normalmente 6 a 10 cm para um rolô.

### Instalação fora do vão

A peça é fixada na parede ou no teto, cobrindo o vão e transbordando para os lados.

**A favor:** bloqueio de luz muito superior, disfarça vãos fora de esquadro, permite alongar visualmente a janela.

**Contra:** avança sobre a parede, pode conflitar com móveis, interruptores e quadros.

**A regra prática:** se o objetivo envolve escuridão, é fora do vão. Se o objetivo é acabamento discreto e o bloqueio total não importa, dentro do vão funciona bem.

## Passo 2: meça a largura em três pontos

Paredes não são paralelas. Em imóveis com mais de dez anos, variações de 1 a 3 cm dentro do mesmo vão são absolutamente comuns.

Meça a largura em três alturas:

- **No topo** do vão
- **No meio** do vão
- **Na base** do vão

Anote as três. Depois:

- **Instalação dentro do vão:** use a **menor** das três medidas e subtraia a folga de fabricação (normalmente 0,5 a 1 cm). Se você usar a maior, a peça trava.
- **Instalação fora do vão:** use a **maior** medida e acrescente o transbordo lateral.

### Quanto de transbordo lateral usar

| Objetivo | Transbordo por lado |
|---|---|
| Acabamento estético apenas | 5 a 8 cm |
| Reduzir frestas de forma perceptível | 10 a 15 cm |
| Blackout de quarto | 15 a 20 cm |

## Passo 3: meça a altura em três pontos

Repita a lógica, agora na vertical. Meça a altura:

- **Na lateral esquerda**
- **No centro**
- **Na lateral direita**

Pisos e vergas também não são perfeitamente nivelados.

### Onde começa e onde termina a altura

O ponto de partida depende do sistema:

- **Persiana rolô e romana:** do topo do vão (ou do ponto de fixação escolhido) até o peitoril ou até onde a peça deve terminar
- **Cortina de trilho ou varão:** do ponto de fixação do trilho até o piso
- **Cortina em sanca:** da face inferior da sanca até o piso

E o ponto final depende do efeito desejado:

- **Rente ao piso:** deixe **1 a 1,5 cm** de folga. Cortina que arrasta suja, desfia e atrapalha a limpeza.
- **Efeito puddle:** acrescente **5 a 15 cm** para que o tecido repouse propositalmente no chão. Elegante, mas só em ambientes de baixa circulação e sem animais.
- **Até o peitoril:** termine **1 a 2 cm abaixo** do peitoril, nunca exatamente nele.

### Altura de fixação acima do vão

Para instalação externa, o trilho não deve ficar rente ao topo da janela. Suba de **10 a 15 cm acima do vão**, ou vá direto ao teto. Isso melhora o bloqueio de luz superior e alonga visualmente o pé-direito — um dos truques mais eficazes e mais baratos da decoração de interiores.

## Passo 4: verifique o esquadro

Meça as duas diagonais do vão, de canto a canto. Se as medidas forem iguais, o vão está em esquadro. Diferenças de até 1 cm são toleráveis. Acima disso, o desvio ficará visível quando a peça for instalada.

Vãos fora de esquadro têm uma solução simples: **instale fora do vão**, com transbordo generoso. A peça cobre o desalinhamento e ninguém percebe.

## Passo 5: mapeie as interferências

Este é o passo que amadores pulam e profissionais nunca dispensam. Verifique e anote:

- **Puxadores e trincos** de janela que impeçam o painel de descer rente ao vidro
- **Aparelhos de ar-condicionado** na trajetória do trilho ou do painel
- **Tomadas e interruptores** onde os suportes seriam fixados
- **Vigas e sancas** que reduzem a altura útil
- **Luminárias e trilhos de spot** que colidem com a cortina aberta
- **Profundidade da sanca**, se houver: um trilho wave precisa de 12 a 15 cm livres

Fotografe cada interferência. Na hora da instalação, essas fotos valem mais que qualquer anotação.

## Quanto tecido comprar para cortinas franzidas

Para cortinas de tecido, a largura da peça não é a largura do vão. É a largura do vão multiplicada pelo fator de franzido:

| Cabeçote | Multiplicador |
|---|---|
| Prega francesa tripla | 2,5 a 3× |
| Prega dupla | 2 a 2,5× |
| Fita wave | 2,2 a 2,5× |
| Ilhós | 2 a 2,5× |
| Painel plano (japonês) | 1× + bainhas |

Some ainda as bainhas laterais (cerca de 5 cm por lado) e, em tecidos estampados, o rapport — a distância de repetição do desenho, necessária para casar a estampa entre painéis.

## Erros que aparecem em quase toda medição amadora

**Medir só um ponto.** É a origem da maioria das peças que não encaixam.

**Usar trena de tecido.** Estica, e o erro é sempre para mais.

**Medir o vidro em vez do vão.** O vão inclui o caixilho.

**Esquecer a espessura do trilho.** Em cortinas de teto, o trilho ocupa de 2 a 4 cm da altura.

**Não considerar o rodapé.** Em instalação externa até o chão, o rodapé impede que o tecido encoste na parede.

**Arredondar para cima "por segurança".** Em instalação interna, arredondar para cima trava a peça.

## Checklist final antes de enviar as medidas

- [ ] Sistema definido (rolô, romana, wave, painel, vertical)
- [ ] Instalação decidida: dentro ou fora do vão
- [ ] Três medidas de largura anotadas
- [ ] Três medidas de altura anotadas
- [ ] Diagonais conferidas (esquadro)
- [ ] Transbordo lateral definido
- [ ] Folga de piso definida
- [ ] Altura de fixação acima do vão definida
- [ ] Interferências fotografadas
- [ ] Lado do acionamento escolhido (esquerda ou direita)

Esse último item escapa com frequência: em persianas com corrente, é preciso informar de que lado ela ficará. Trocar depois exige desmontar a peça.

Medir bem leva vinte minutos. Corrigir uma peça mal medida leva semanas — quando é possível corrigir.`,
  },
  {
    title: 'Blackout, screen ou double vision: o comparativo definitivo de bloqueio de luz',
    slug: 'blackout-screen-ou-double-vision-comparativo',
    categorySlug: 'comparativos',
    tags: ['blackout', 'screen', 'double vision', 'comparativo'],
    featured: true,
    daysAgo: 15,
    coverImage: '/images/blog/blackout-screen-ou-double-vision-comparativo.jpg',
    coverImageAlt: 'Três amostras de tecido com níveis diferentes de passagem de luz',
    excerpt:
      'Os três tecidos técnicos mais vendidos resolvem problemas completamente diferentes. Entenda o que cada um bloqueia de fato, onde cada um falha e como combiná-los na mesma janela.',
    metaTitle: 'Blackout, Screen ou Double Vision — comparativo completo',
    metaDescription:
      'Comparativo técnico entre blackout, screen solar e double vision: quanto de luz e calor cada um bloqueia, privacidade diurna e noturna e em quais ambientes usar.',
    keywords: [
      'blackout ou screen',
      'double vision persiana',
      'tecido screen solar',
      'comparativo cortinas',
    ],
    content: `Blackout, screen e double vision são os três tecidos técnicos mais vendidos no Brasil. Eles aparecem lado a lado em qualquer loja, com preços parecidos, e por isso são frequentemente tratados como alternativas equivalentes.

Não são. Cada um foi projetado para resolver um problema distinto, e escolher pelo preço ou pela aparência é a receita mais confiável para se arrepender.

## O que cada um é, na prática

### Blackout

O blackout existe para uma única finalidade: impedir a passagem de luz. Isso é obtido de duas maneiras.

A primeira é o **tecido revestido**: uma camada de acrílico ou PVC aplicada no verso forma uma película opaca. É a versão mais barata, mas a película racha e descola com dobras repetidas ao longo dos anos.

A segunda é o **blackout de trama tripla** (three-pass): uma camada preta é entrelaçada entre duas camadas coloridas durante a própria tecelagem. Custa mais, tem caimento têxtil verdadeiro, não craquela e tolera lavagem delicada.

**Bloqueio de luz:** 95% a 100% no tecido.
**Visão externa:** nenhuma.
**Privacidade:** total, dia e noite.

### Screen solar

A screen é uma tela técnica de fibra de vidro ou poliéster revestida em PVC, tecida com microfuros regulares. O **fator de abertura** — de 1% a 10% — indica quanto da superfície é vazada.

Ela não foi feita para escurecer. Foi feita para rejeitar calor e radiação ultravioleta preservando a vista.

**Bloqueio de luz:** 50% a 90%, conforme o fator de abertura.
**Bloqueio de UV:** 90% a 99%.
**Visão externa:** preservada de dia.
**Privacidade:** boa de dia, **nula à noite** com luz interna acesa.

### Double vision

O double vision — também chamado de rolô duplo ou zebra — é um painel único dividido em faixas horizontais alternadas: uma translúcida, uma opaca. O sistema tem dupla camada, e ao acionar a corrente uma desliza sobre a outra.

Quando as faixas opacas se alinham, o ambiente fica protegido. Quando as translúcidas coincidem, abrem-se "janelas" horizontais de luz e vista.

**Bloqueio de luz:** 40% a 90%, ajustável de forma contínua.
**Visão externa:** alternável.
**Privacidade:** boa quando alinhado, parcial à noite.

## Tabela comparativa direta

| Critério | Blackout | Screen | Double Vision |
|---|---|---|---|
| Bloqueio de luz | 95–100% | 50–90% | 40–90% (ajustável) |
| Bloqueio de UV | ~100% | 90–99% | 70–90% |
| Vista externa | Não | Sim | Alternável |
| Privacidade diurna | Total | Boa | Boa |
| Privacidade noturna | Total | **Nula** | Parcial |
| Controle térmico | Bom | **Excelente** | Médio |
| Ajuste de luminosidade | Só por altura | Só por altura | **Contínuo** |
| Preço relativo | $$ | $$$ | $$$ |
| Melhor ambiente | Quarto | Varanda, escritório | Sala, home office |

## O erro que quase todo mundo comete com screen

A screen é vendida como solução de privacidade, e ela realmente funciona assim — **durante o dia**. A física é simples: você enxerga do lado mais escuro para o mais claro.

De dia, o exterior é mais claro que o interior: você vê para fora, ninguém vê para dentro.

À noite, com a luz da sala acesa, a relação inverte. O interior fica mais claro que a rua, e a screen passa a exibir o ambiente para quem está do lado de fora com nitidez desconfortável.

**Conclusão prática:** screen nunca deve ser a única solução em quartos, ou em qualquer janela de térreo voltada para a rua. Ela precisa de uma segunda camada.

## O erro que quase todo mundo comete com blackout

O blackout bloqueia a luz **que atravessa o tecido**. Ele não faz nada contra a luz que passa **ao redor** do tecido.

Em uma instalação dentro do vão, com folga de fabricação de 1 cm de cada lado, você tem duas faixas verticais de luz do chão ao teto. De dia, isso é o suficiente para clarear o quarto inteiro.

A solução não está no tecido, está na instalação:

- Instalar **fora do vão**, com 15 a 20 cm de transbordo lateral
- Fixar **acima do vão** ou no teto
- Fechar o topo com **bandô** ou embutir em **sanca**
- Deixar a barra **encostando no piso**
- Em casos críticos, usar **sistema zip** com trilhos laterais

## O erro que quase todo mundo comete com double vision

Esperar escuridão. O double vision **nunca** entrega blackout, mesmo com faixas opacas em tecido blackout. Sempre há passagem de luz nas junções entre as faixas e nas laterais.

Ele é excelente para o que faz — regular luminosidade de forma contínua — e inadequado para dormir.

Há também um ponto mecânico relevante: por ter duas camadas de tecido enroladas no mesmo tubo, o cilindro recolhido fica volumoso, e o alinhamento das faixas depende de um vão em esquadro e de um tubo corretamente dimensionado. Desalinhamento progressivo é o defeito mais relatado nesse tipo de persiana.

## Como escolher o fator de abertura da screen

| Abertura | Vista externa | Controle solar | Indicado para |
|---|---|---|---|
| 1% | Muito limitada | Máximo | Fachada oeste, sol intenso |
| 3% | Boa | Alto | Escritórios, home office |
| 5% | Muito boa | Médio-alto | Salas, varandas |
| 10% | Excelente | Médio | Ambientes com vista privilegiada |

A cor também importa, e de forma contraintuitiva:

- **Tons claros** refletem mais calor, mas causam mais ofuscamento
- **Tons escuros** absorvem mais calor, mas oferecem visão externa muito mais nítida e contrastada

Para home office, screen escura em abertura 3% costuma ser o melhor equilíbrio.

## A resposta que resolve a maioria dos casos: combinar

Na prática, os melhores projetos raramente escolhem um só. As combinações mais frequentes:

**Quarto:** voil ou screen na frente + blackout atrás. Luz filtrada de dia, escuridão à noite.

**Sala com vista:** screen no vidro + cortina de tecido decorativa. Controle solar durante o dia, privacidade e aconchego à noite.

**Home office:** double vision sozinho, ou screen 3% + cortina leve.

**Varanda:** screen com [sistema zip](/tipos-de-cortinas/cortina-rolo-com-sistema-zip), que ainda barra vento e insetos.

## Custo real ao longo do tempo

O preço por metro quadrado conta apenas parte da história.

O **blackout revestido** é o mais barato na compra, mas a película tende a craquelar em cinco a oito anos de uso diário. O blackout de trama tripla custa de 30% a 60% mais e dura muito mais.

A **screen** tem o maior custo inicial entre os três, mas é o material mais estável: não amassa, não desbota com facilidade, não absorve gordura e limpa com pano úmido. Em cozinhas e áreas externas cobertas, é frequentemente o mais econômico no horizonte de dez anos.

O **double vision** fica no meio, com um risco específico: se o alinhamento das faixas se perder, o reparo exige assistência técnica.

## Resumo em uma frase cada

**Blackout:** quando o objetivo é dormir. Instalação importa mais que o tecido.

**Screen:** quando o objetivo é calor e ofuscamento sem perder a vista. Nunca sozinha em quartos.

**Double vision:** quando o objetivo é regular a luz ao longo do dia. Não espere escuridão.

Se ainda houver dúvida, volte ao problema real do ambiente. Ele responde sozinho.`,
  },
  {
    title: 'Cortina ou persiana: qual escolher em cada situação',
    slug: 'cortina-ou-persiana-qual-escolher',
    categorySlug: 'comparativos',
    tags: ['cortinas', 'persianas', 'comparativo', 'decoração'],
    daysAgo: 22,
    coverImage: '/images/blog/cortina-ou-persiana-qual-escolher.jpg',
    coverImageAlt: 'Ambiente dividido mostrando cortina de tecido e persiana lado a lado',
    excerpt:
      'A escolha entre tecido e sistema mecânico envolve espaço disponível, controle de luz, manutenção, acústica e custo. Um comparativo honesto, com as situações em que cada solução realmente vence.',
    metaTitle: 'Cortina ou persiana: comparativo completo para decidir',
    metaDescription:
      'Diferença entre cortina e persiana: controle de luz, espaço ocupado, manutenção, acústica, durabilidade e custo. Descubra qual vence em cada ambiente da casa.',
    keywords: [
      'cortina ou persiana',
      'diferença cortina persiana',
      'qual é melhor cortina ou persiana',
    ],
    content: `"Cortina ou persiana?" é provavelmente a primeira pergunta de quem começa a vestir as janelas de casa. E é uma pergunta melhor do que parece, porque as duas famílias resolvem o mesmo problema por caminhos opostos.

Cortinas são **têxteis**: painéis de tecido que se movem lateralmente ou sobem em dobras. Persianas são **sistemas mecânicos**: lâminas ou painéis rígidos operados por corrente, vareta ou motor.

Vamos comparar critério por critério, e depois ver as situações em que cada uma vence com folga.

## Controle de luz: vantagem para as persianas

Uma cortina de tecido tem dois estados úteis: aberta ou fechada. É possível deixá-la parcialmente fechada, mas o controle é grosseiro.

Uma [persiana horizontal](/tipos-de-cortinas/persiana-horizontal-de-aluminio) ou de madeira permite **inclinar as lâminas** e direcionar a luz: totalmente abertas, iluminam; a 45°, criam privacidade mantendo ventilação; fechadas, bloqueiam a maior parte da claridade. Nenhum tecido faz isso.

A [double vision](/tipos-de-cortinas/persiana-double-vision) leva o ajuste ainda mais longe, com regulagem contínua.

**Exceção importante:** para bloqueio total de luz, a cortina blackout bem instalada supera qualquer persiana, porque cobre uma área maior da parede e elimina frestas com transbordo generoso.

## Espaço ocupado: vantagem para as persianas

Uma cortina franzida com 2,5 vezes a largura do vão acumula tecido nas laterais mesmo quando totalmente aberta. Em um vão de 2 metros, isso significa cerca de 30 a 40 cm de tecido de cada lado, encostando na parede.

Persianas rolô, romanas e plissadas se recolhem no topo e liberam o vão inteiro. Em ambientes compactos, com móveis encostados na parede da janela ou com bancada sob o vão, essa diferença é decisiva.

## Aconchego e acústica: vantagem para as cortinas

Tecido absorve som. Superfície rígida reflete som.

Uma cortina de [veludo](/tipos-de-cortinas/cortina-de-veludo) ou um painel [acústico multicamadas](/tipos-de-cortinas/cortina-acustica-e-termica) reduz a reverberação do ambiente e atenua ruído externo de média frequência de forma perceptível. Persianas de alumínio, ao contrário, tendem a aumentar levemente a reverberação.

Visualmente, a diferença é igualmente marcante. Tecido quebra a rigidez das superfícies duras — vidro, alvenaria, porcelanato — e é o elemento que transforma um ambiente "acabado" em um ambiente "habitado".

## Manutenção: depende do ambiente

Não há vencedor absoluto aqui, e sim uma divisão clara por contexto.

**Cortinas de tecido lavável** (algodão, poliéster, linho misto) saem do varão, vão para a máquina e voltam. Em quartos infantis e casas com alérgicos, isso é uma vantagem real.

**Persianas de alumínio, PVC e screen** limpam com pano úmido e não temem umidade nem gordura. Em cozinhas e banheiros, isso é decisivo.

**Persianas de lâminas** exigem limpeza individual de cada lâmina, o que é trabalhoso. **Persianas celulares e plissadas** não podem ser lavadas, apenas aspiradas.

## Durabilidade: leve vantagem para as persianas

Uma persiana de alumínio bem instalada facilmente ultrapassa quinze anos. Componentes mecânicos — cursores, correntes, roldanas — são substituíveis individualmente e custam pouco.

Cortinas de tecido têm vida útil ligada à exposição solar. Fibras naturais sem proteção UV desbotam e ressecam em poucos anos quando expostas ao sol direto. Por outro lado, trocar um painel de tecido é simples e não envolve remover ferragens.

## Custo: depende da escala

Para um vão pequeno, uma persiana rolô simples costuma sair mais barata que uma cortina sob medida, porque a cortina consome de 2,5 a 3 vezes a largura do vão em tecido, mais mão de obra de costura.

Em vãos muito largos, a conta inverte: persianas grandes exigem tubos reforçados e mecânica robusta, enquanto uma cortina de trilho escala com custo mais linear.

| Situação | Solução mais econômica |
|---|---|
| Janela pequena (até 1,2 m) | Persiana rolô |
| Vão médio (1,2 a 2,5 m) | Empate — depende do tecido |
| Vão largo (acima de 3 m) | Cortina de trilho ou persiana vertical |
| Porta de correr | [Persiana vertical](/tipos-de-cortinas/persiana-vertical) |
| Janela irregular ou claraboia | [Persiana plissada](/tipos-de-cortinas/persiana-plissada) |

## Onde a cortina vence com folga

**Quartos que precisam de escuridão real.** Blackout instalado fora do vão com transbordo é imbatível.

**Ambientes que precisam de aconchego.** Salas de estar, quartos e ambientes com muita superfície dura.

**Pé-direito alto.** Tecido do teto ao chão valoriza a verticalidade; uma persiana no topo da janela deixa a parede exposta.

**Controle acústico.** Nenhuma persiana compete com veludo ou com uma cortina multicamadas.

**Estilo clássico ou formal.** [Pregas francesas](/tipos-de-cortinas/cortina-de-pregas-francesas), bandôs e tecidos com caimento são o vocabulário desses projetos.

## Onde a persiana vence com folga

**Áreas úmidas.** Cozinha, banheiro, área de serviço. Tecido natural ali é um problema esperando para acontecer.

**Ambientes compactos.** Não sobra tecido nas laterais.

**Controle direcional de luz.** Home office, ateliês, ambientes com tela.

**Janelas com bancada ou móvel embaixo.** Cortina longa simplesmente não cabe.

**Formatos irregulares.** Trapezoidais, triangulares, claraboias.

**Portas de correr.** A persiana vertical libera a passagem sem levantar nada.

## A resposta que os projetos profissionais adotam: as duas

Em projetos bem resolvidos, cortina e persiana raramente competem — trabalham em camadas.

O arranjo mais comum e mais eficiente:

1. **Camada técnica**, colada ao vidro: screen ou blackout em sistema rolô, resolvendo calor, UV e bloqueio de luz.
2. **Camada decorativa**, em tecido: voil, linho ou veludo, resolvendo aconchego, acústica e estética.

Esse arranjo permite que cada elemento faça só o que faz bem. A screen bloqueia o sol da tarde sem escurecer; a cortina de linho fecha à noite e dá calor visual ao ambiente.

## Um roteiro rápido de decisão

Responda em ordem:

1. **O ambiente é úmido ou tem gordura?** → Persiana de alumínio, PVC ou screen.
2. **Precisa de escuridão para dormir?** → Cortina blackout fora do vão, ou rolô com sistema zip.
3. **A janela tem formato irregular?** → Persiana plissada.
4. **É porta de correr ou vão acima de 3 m?** → Persiana vertical ou cortina de trilho.
5. **Há móvel ou bancada sob a janela?** → Persiana ou romana.
6. **O objetivo principal é aconchego e acústica?** → Cortina de tecido encorpado.
7. **Precisa de controle fino de luz durante o dia?** → Persiana de lâminas ou double vision.

Se duas respostas apontarem para lados diferentes, é sinal de que o ambiente pede as duas camadas — e não uma escolha.

## O que não deve pesar na decisão

**Preço isolado.** Uma persiana barata que precisa ser trocada em três anos custa mais que uma cortina bem-feita que dura dez.

**Moda.** Persianas de alumínio já foram consideradas datadas e voltaram; o veludo saiu e voltou; o bambu nunca saiu de fato.

**O que o vizinho instalou.** Orientação solar, uso do ambiente e altura de pé-direito mudam completamente a recomendação de um apartamento para outro no mesmo prédio.

A pergunta certa nunca é "qual é melhor". É "qual problema desta janela eu preciso resolver primeiro".`,
  },
  {
    title: 'Como limpar cortinas e persianas sem estragar o tecido',
    slug: 'como-limpar-cortinas-e-persianas',
    categorySlug: 'manutencao',
    tags: ['limpeza', 'manutenção', 'cuidados', 'persianas'],
    daysAgo: 28,
    coverImage: '/images/blog/como-limpar-cortinas-e-persianas.jpg',
    coverImageAlt: 'Pano de microfibra higienizando as lâminas de uma persiana',
    excerpt:
      'Cada material exige um método diferente — e o procedimento errado destrói a peça de forma irreversível. Guia de higienização por tipo de tecido, com a frequência correta para cada ambiente.',
    metaTitle: 'Como limpar cortinas e persianas: guia por material',
    metaDescription:
      'Método correto de limpeza para cada tipo de cortina e persiana: blackout, screen, celular, plissada, madeira, bambu e tecidos naturais. Frequência e erros a evitar.',
    keywords: [
      'como limpar cortina',
      'limpar persiana',
      'higienização de cortinas',
      'lavar cortina blackout',
    ],
    content: `Cortinas e persianas funcionam como filtros passivos: retêm poeira, pólen, fuligem urbana, pelos de animais e, em cozinhas, gordura em suspensão. Essa carga acumulada afeta diretamente a qualidade do ar interno, e é especialmente relevante em quartos de pessoas com rinite, asma ou alergia a ácaros.

O problema é que a limpeza errada estraga a peça de forma irreversível. Mergulhar uma persiana celular em água desfaz o vinco permanente. Dobrar um blackout revestido racha a película. Molhar bambu favorece mofo. Antes de qualquer produto, é preciso identificar o material.

## Frequência recomendada por ambiente

| Ambiente | Aspiração | Higienização profunda |
|---|---|---|
| Quarto comum | Mensal | A cada 6–12 meses |
| Quarto de alérgico | Quinzenal | A cada 3 meses |
| Sala de estar | Mensal | A cada 6–12 meses |
| Cozinha | Quinzenal | A cada 3–4 meses |
| Banheiro | Mensal | A cada 6 meses |
| Escritório | Mensal | A cada 12 meses |

A aspiração regular é o que mais rende. Ela remove o particulado antes que ele se fixe nas fibras, e adia consideravelmente a necessidade de limpeza profunda.

## O passo que vem antes de tudo: identificar o material

Se a peça tiver etiqueta, leia. Se não tiver, use estes indicadores:

- **Superfície lisa e opaca, verso com película:** blackout revestido
- **Superfície têxtil dos dois lados, opaca:** blackout de trama tripla
- **Trama microperfurada, toque plástico:** screen
- **Dobras em favo vistas de perfil:** persiana celular
- **Pregas finas e paralelas:** persiana plissada
- **Fibras vegetais trançadas:** bambu, palha ou junco
- **Lâminas rígidas:** alumínio, PVC ou madeira

## Cortinas de tecido lavável

**Materiais:** algodão, poliéster, linho misto, voil.

Estes são os mais simples e podem ser lavados em casa.

1. Retire ganchos, argolas e a fita de chumbo, se removível
2. Sacuda ao ar livre ou aspire para remover poeira solta
3. Lave em máquina no **ciclo delicado, água fria**, com sabão neutro
4. **Não use alvejante** e evite amaciante em excesso, que atrai poeira
5. **Não centrifugue** em rotação alta
6. Pendure **ainda úmida** no próprio varão

Esse último passo elimina a necessidade de passar na maioria dos casos: o peso do tecido molhado desfaz os vincos sozinho.

**Atenção ao encolhimento.** Algodão e linho puros encolhem de 3% a 5% na primeira lavagem. Se a cortina foi confeccionada sob medida com folga mínima de piso, considere lavagem a seco.

## Cortinas de linho e tecidos naturais delicados

O linho puro merece cuidado extra. Lave a seco sempre que possível. Se optar por lavagem doméstica, use água fria, ciclo delicado e nunca torça. Passe **ainda úmido, pelo avesso**, em temperatura média.

O linho amassa por natureza — parte do seu apelo estético vem justamente disso. Tentar eliminar completamente o amassado é uma batalha perdida e costuma danificar a fibra.

## Cortinas de veludo

Nunca lave em máquina. O veludo tem pelo, e a agitação o achata de forma permanente.

- **Aspire** quinzenalmente com bocal de escova macia, sempre no sentido do pelo
- Para manchas, use pano levemente úmido com movimentos leves, **sem esfregar**
- **Nunca passe ferro** diretamente sobre o pelo — use vapor a distância
- Limpeza profunda: **exclusivamente a seco**, em lavanderia especializada

## Cortina blackout: depende da construção

Esta distinção é crítica.

### Blackout de trama tripla

Tem comportamento têxtil e tolera lavagem delicada em água fria. Não centrifugue e pendure ainda úmido.

### Blackout com revestimento acrílico ou PVC

**Não lave.** A película racha ao ser dobrada, torcida ou submetida a calor. O método correto:

1. Estenda o painel completamente
2. Limpe com pano macio levemente umedecido em água morna com sabão neutro
3. Trabalhe de cima para baixo, em movimentos retos
4. Seque com pano seco imediatamente
5. Deixe estendido até secar completamente

## Persiana rolô

Independentemente do tecido, a regra de ouro é: **nunca dobre o painel de um rolô**. O vinco é praticamente irreversível.

1. Abaixe o painel completamente
2. Aspire com bocal macio dos dois lados
3. Limpe com pano levemente úmido e sabão neutro, sempre no sentido vertical
4. Deixe totalmente estendido até secar antes de recolher

Recolher um rolô ainda úmido é a causa mais comum de manchas circulares e mofo no tecido.

## Persiana screen

É o material mais fácil de limpar de todos. A fibra revestida em PVC não absorve gordura, água nem odores.

- Pano úmido com sabão neutro resolve a limpeza rotineira
- Em cozinhas, use desengordurante neutro diluído
- Manchas persistentes saem com escova de cerdas macias e água morna
- Seque naturalmente com o painel estendido

## Persiana celular e plissada

**Não podem ser lavadas.** A água desfaz o vinco permanente do tecido, e a peça nunca recupera o formato original.

- Aspire com bocal macio **no sentido das pregas**
- Para poeira dentro das células, use ar comprimido em jato leve, ou o sopro de um secador de cabelos em temperatura fria
- Manchas pontuais: pano quase seco, apenas encostando
- Se houver sujeira generalizada, procure limpeza profissional a seco

## Persiana de alumínio e PVC

São as mais resistentes, e também as mais trabalhosas, porque cada lâmina precisa ser higienizada individualmente.

**Método rápido (manutenção):** feche as lâminas, passe pano de microfibra na horizontal, inverta a inclinação e repita do outro lado.

**Método profundo (cozinhas):** existem luvas específicas com dedos separados que limpam três lâminas por passada. Use com desengordurante neutro diluído.

**Nunca amasse as lâminas.** Alumínio dobrado não volta à forma, e a lâmina torta fica visível para sempre.

## Persiana de madeira

Madeira e água não combinam.

- Limpe com **pano seco** ou levemente umedecido, torcido ao máximo
- Use produto específico para madeira, aplicado no pano e não na lâmina
- **Nunca use água corrente, vapor ou produtos abrasivos**
- Reaplique verniz ou óleo de manutenção a cada 3 a 5 anos

## Persiana de bambu, palha e fibras naturais

**Limpeza exclusivamente a seco.**

- Aspire com bocal macio ou use espanador
- Para sujeira entre as fibras, escova de cerdas macias no sentido da trama
- Nunca use água — mancha, deforma a trama e favorece mofo
- Se houver mofo instalado, a peça geralmente não é recuperável

## Erros que destroem a peça

**Máquina de lavar em blackout revestido.** A película racha e descola.

**Água em persiana celular ou plissada.** O vinco se perde permanentemente.

**Recolher um rolô úmido.** Mancha circular e mofo.

**Alvejante em tecido colorido.** Descoloração irreversível e enfraquecimento da fibra.

**Esfregar screen com força.** A trama desfia.

**Vapor direto em veludo.** Achata o pelo.

**Secadora em algodão ou linho.** Acelera o encolhimento.

**Água em madeira.** Empena, mancha e descola o verniz.

## Manutenção preventiva que faz diferença real

Além da limpeza, alguns hábitos prolongam bastante a vida útil:

- **Lubrifique os cursores** de trilhos com silicone em spray uma vez por ano
- **Aspire a canaleta** de trilhos aparentes a cada seis meses
- **Verifique os suportes** de fixação anualmente, reapertando o que estiver folgado
- **Alterne a posição** de cortinas em janelas com sol intenso para uniformizar o desbotamento
- **Recarregue baterias** de motores antes que descarreguem completamente
- **Confira os fins de curso** de peças motorizadas uma vez por ano

## Quando chamar um profissional

Vale contratar higienização especializada quando:

- A peça é grande, pesada ou de difícil remoção
- O material não pode ser molhado (celular, plissada, bambu)
- Há gordura acumulada de anos em cozinha
- Existe mofo visível
- O mecanismo apresenta travamento ou desalinhamento junto com a sujeira

Na maioria dos casos, higienização profissional custa uma fração do valor de uma peça nova e devolve anos de uso. Trocar deveria ser a última opção, não a primeira.`,
  },
  {
    title: 'Tecidos para cortinas: guia completo de fibras, gramaturas e comportamento',
    slug: 'tecidos-para-cortinas-guia-completo',
    categorySlug: 'tecidos-e-materiais',
    tags: ['tecidos', 'linho', 'veludo', 'poliéster', 'materiais'],
    featured: true,
    daysAgo: 35,
    coverImage: '/images/blog/tecidos-para-cortinas-guia-completo.jpg',
    coverImageAlt: 'Amostras de tecidos para cortina em tons neutros sobre mesa de madeira',
    excerpt:
      'Fibra, gramatura e trama determinam caimento, bloqueio de luz, durabilidade e manutenção. Entenda o que cada tecido faz de verdade antes de escolher pela cor.',
    metaTitle: 'Tecidos para cortinas — guia de fibras, gramatura e caimento',
    metaDescription:
      'Guia técnico de tecidos para cortinas: linho, algodão, poliéster, veludo, seda e blends. Como a gramatura afeta o caimento e o bloqueio de luz, e qual escolher.',
    keywords: [
      'tecidos para cortina',
      'gramatura cortina',
      'melhor tecido para cortina',
      'linho ou poliéster cortina',
    ],
    content: `A maior parte das decisões sobre cortina começa pela cor. Deveria começar pela fibra.

Cor é reversível — um painel pode ser trocado. Fibra e gramatura determinam caimento, durabilidade, resistência ao sol, comportamento na lavagem e quanto de luz a peça bloqueia. Esses fatores acompanham a cortina por toda a vida útil.

Este guia percorre as fibras principais, explica o que a gramatura significa na prática e mostra como ler uma ficha técnica de tecido.

## Os três fatores que definem um tecido

### 1. Fibra

Determina o comportamento fundamental: como reage à água, ao sol, ao calor e ao tempo. Divide-se em naturais (algodão, linho, seda, lã), artificiais (viscose, modal, lyocell) e sintéticas (poliéster, náilon, acrílico).

### 2. Gramatura

Medida em **g/m²** (gramas por metro quadrado). É o principal indicador de peso e, por consequência, de caimento e bloqueio de luz.

| Gramatura | Comportamento | Uso típico |
|---|---|---|
| Até 100 g/m² | Translúcido, muito leve | Voil, sheer |
| 100–180 g/m² | Semitranslúcido | Linho leve, algodão fino |
| 180–280 g/m² | Semiopaco, bom caimento | Linho médio, panamá |
| 280–400 g/m² | Opaco, pregas definidas | Blackout, jacquard |
| Acima de 400 g/m² | Muito pesado, escultórico | Veludo, acústicos |

### 3. Trama

A forma como os fios se cruzam. Uma trama aberta deixa passar luz mesmo com gramatura alta; uma trama fechada bloqueia mais luz com menos peso.

## Poliéster: o dominante, e por bons motivos

O poliéster responde por mais de 70% das cortinas vendidas no Brasil, e essa liderança é técnica, não apenas econômica.

**A favor:**
- Não encolhe nem deforma
- Resiste bem à radiação UV
- Seca rápido, não mofa
- Praticamente não amassa
- Aceita qualquer acabamento: blackout, antichama, antimanchas
- Custo acessível

**Contra:**
- Menos respirável
- Pode gerar eletricidade estática e atrair poeira
- Acumula odores em cozinhas
- Aspecto menos nobre nas versões baratas

Poliésteres de alta qualidade — especialmente os de fio texturizado que imitam linho — chegam muito perto da aparência de fibras naturais com desempenho muito superior. Para janelas com sol intenso, são frequentemente a escolha mais racional.

## Linho: textura que nenhum sintético reproduz

O [linho](/tipos-de-cortinas/cortina-de-linho) tem fio irregular, brilho fosco e um caimento denso inconfundível.

**A favor:**
- Textura natural única
- Caimento pesado com pregas bem definidas
- Fibra respirável, ideal para clima quente
- Envelhece bem, ganhando aspecto artesanal

**Contra:**
- Amassa por natureza
- Encolhe de 3% a 5% na primeira lavagem
- Desbota sob sol direto prolongado
- Preço elevado no linho puro

**Sobre os blends:** a maioria das cortinas vendidas como "linho" é mistura de linho com poliéster ou viscose. Um blend 55% linho / 45% poliéster mantém boa parte da textura e reduz drasticamente o amassado e o encolhimento. Para uso residencial com sol, costuma ser a escolha mais equilibrada.

## Algodão: versátil e lavável

O [algodão](/tipos-de-cortinas/cortina-de-algodao) é a fibra mais democrática. Fio uniforme, superfície lisa e caimento macio.

**A favor:**
- Lavável em máquina doméstica
- Maior variedade de estampas
- Hipoalergênico e respirável
- Custo moderado

**Contra:**
- Encolhe se não for pré-tratado
- Desbota sob sol direto
- Amassa mais que sintéticos
- Absorve odores

É a escolha natural para quartos infantis e casas com alérgicos, justamente pela facilidade de lavagem frequente.

## Veludo: presença e desempenho

O [veludo](/tipos-de-cortinas/cortina-de-veludo) é o tecido com melhor desempenho acústico do universo residencial.

Gramaturas típicas ficam entre 350 e 600 g/m². Esse peso exige trilho reforçado e buchas dimensionadas para carga real.

Hoje predominam veludos sintéticos em poliéster, mais estáveis e resistentes ao desbotamento que os de algodão ou seda. Variações úteis: **cotelê** (canaletas verticais) e **amassado**, que disfarça marcas de uso.

## Seda e tafetá: brilho e estrutura

[Seda e tafetá](/tipos-de-cortinas/cortina-de-tafeta-e-seda) formam a família dos brilhantes e estruturados. Produzem pregas escultóricas e reflexos que dão profundidade à parede.

A seda natural é notoriamente sensível: desbota rápido, mancha com água e exige lavagem profissional. O tafetá de poliéster mantém o efeito visual com desempenho muito superior — para a maioria das residências brasileiras, é a escolha racional.

Ambos praticamente sempre exigem forro, tanto por privacidade quanto para proteger a fibra do sol.

## Viscose, modal e lyocell: brilho fluido

Fibras artificiais derivadas de celulose. Têm brilho suave e caimento extremamente fluido — mais macio que o algodão, mais brilhante que o linho.

**Atenção:** viscose perde muita resistência quando molhada e pode encolher de forma acentuada. Quase sempre pede lavagem a seco. O lyocell (Tencel) é significativamente mais estável e resistente.

## Tecidos técnicos

### Screen

Fibra de vidro ou poliéster revestido em PVC, com microfuros. Definido pelo **fator de abertura** (1% a 10%). Bloqueia de 90% a 99% dos UV mantendo a vista.

### Blackout

Duas construções: **revestido** (película acrílica ou PVC no verso, mais barato, racha com o tempo) e **trama tripla** (camada preta entrelaçada na tecelagem, caimento têxtil real, não craquela).

### Antichama

Tratamento exigido por norma em ambientes comerciais e de uso coletivo. Pode ser permanente (incorporado à fibra) ou aplicado (perde eficácia com lavagens).

## Como ler uma ficha técnica

Uma ficha completa traz:

- **Composição:** percentual de cada fibra
- **Gramatura:** em g/m²
- **Largura útil:** normalmente 1,40 m, 2,80 m ou 3,00 m
- **Rapport:** distância de repetição da estampa
- **Solidez da cor à luz:** escala de 1 a 8 — abaixo de 5, evite sol direto
- **Retração:** percentual esperado de encolhimento
- **Instruções de lavagem:** símbolos internacionais

### Largura útil e tecido "com emenda"

Tecidos de 1,40 m exigem emendas em cortinas altas, porque são usados no sentido do comprimento. Tecidos de 2,80 m ou 3,00 m permitem uso **no sentido da largura** (chamado de "tecido sem emenda"), eliminando costuras horizontais em cortinas de até 2,80 m de altura.

Para pé-direito padrão, um tecido de 2,80 m resolve sem nenhuma emenda visível — uma diferença estética significativa.

## Quanto tecido comprar

Multiplique a largura do vão pelo fator de franzido do cabeçote escolhido:

| Cabeçote | Multiplicador |
|---|---|
| Prega francesa tripla | 2,5 a 3× |
| Prega dupla | 2 a 2,5× |
| Fita wave | 2,2 a 2,5× |
| Ilhós | 2 a 2,5× |
| Painel plano | 1× + bainhas |

Acrescente 5 cm por bainha lateral e, em estampados, o rapport necessário para casar o desenho entre painéis.

## Escolhendo pela exposição solar

**Fachada norte e sul (sol indireto):** qualquer fibra funciona. Linho e algodão brilham aqui.

**Fachada leste (sol da manhã):** exposição moderada. Blends de linho e poliéster de qualidade.

**Fachada oeste (sol da tarde):** o cenário mais agressivo. Priorize poliéster com proteção UV, screen ou tecidos com solidez à luz acima de 6. Fibras naturais puras desbotam rápido.

## Uma sugestão final

Peça sempre amostra física e observe-a **na luz do próprio ambiente**, em pelo menos dois horários diferentes do dia. Iluminação de showroom é projetada para valorizar produtos, e cor e caimento mudam radicalmente entre a loja e a sua sala.

Prenda a amostra na janela e conviva com ela por dois ou três dias antes de decidir. É o teste mais barato e mais confiável que existe.`,
  },
  {
    title: 'Cortinas para quarto de bebê: segurança, escuridão e qualidade do sono',
    slug: 'cortinas-para-quarto-de-bebe',
    categorySlug: 'ambientes',
    tags: ['quarto de bebê', 'blackout', 'segurança', 'sono'],
    daysAgo: 42,
    coverImage: '/images/blog/cortinas-para-quarto-de-bebe.jpg',
    coverImageAlt: 'Quarto de bebê em tons suaves com cortina blackout fechada',
    excerpt:
      'Cordões soltos são risco real de estrangulamento e escuridão insuficiente atrapalha o sono. Guia completo de segurança, bloqueio de luz e materiais adequados para o quarto infantil.',
    metaTitle: 'Cortinas para quarto de bebê: segurança e blackout',
    metaDescription:
      'Como escolher cortina para quarto de bebê: normas de segurança sobre cordões, blackout sem frestas, materiais hipoalergênicos e o impacto da luz no sono infantil.',
    keywords: [
      'cortina quarto de bebê',
      'blackout quarto infantil',
      'segurança cortina criança',
      'cortina sem cordão',
    ],
    content: `O quarto de bebê é o ambiente em que a escolha da cortina deixa de ser decorativa e passa a ser uma decisão de segurança e de saúde. Há dois temas que dominam qualquer outro critério: **cordões acessíveis** e **controle de luz**.

Vamos tratar os dois com a seriedade que merecem, e depois passar aos materiais e ao projeto do ambiente.

## Segurança: cordões são o risco número um

Cordões e correntes de persianas figuram entre os riscos domésticos mais documentados para crianças pequenas. Alças formadas por cordões de acionamento, correntes contínuas e cordas internas de persianas horizontais representam risco de estrangulamento, especialmente para crianças de até três anos.

O padrão internacional de segurança infantil em coberturas de janela é claro em três pontos:

1. **Não deve haver cordões acessíveis** em quartos e áreas de brincar
2. Se houver, eles devem ser **mantidos fora do alcance** por dispositivos de tensionamento fixados na parede
3. Berços, camas e móveis escaláveis **nunca devem ser posicionados perto da janela**

### Soluções seguras, em ordem de preferência

**1. Cortina motorizada.** Elimina completamente o cordão. É a solução mais segura disponível e, em quartos infantis, o custo adicional se justifica com folga. Motores a bateria dispensam obra elétrica.

**2. Sistema com mola (spring roller).** A persiana rolô com mola sobe e desce por toque, sem corrente alguma.

**3. Cortina de tecido em varão ou trilho.** Painéis de tecido movidos à mão não têm cordões. É a solução tradicional e continua sendo excelente.

**4. Cordão com tensionador fixado na parede.** Se o sistema com corrente for inevitável, o tensionador mantém a corrente esticada e presa, sem formar alça.

### O que evitar sem exceção

- Persianas horizontais com **cordões internos** de escada (as lâminas de alumínio tradicionais)
- **Correntes contínuas** soltas ao alcance
- Cortinas com **faixas, laços ou franjas** longas e soltas
- Qualquer sistema com cordão **próximo ao berço**

### Posicionamento do berço

Independentemente do sistema escolhido, mantenha o berço a pelo menos **um metro** da janela. Isso resolve simultaneamente o risco de cordões, a corrente de ar direta e a exposição à variação térmica do vidro.

## Luz: por que a escuridão importa tanto

A melatonina, hormônio que regula o ciclo de sono, tem sua produção suprimida pela luz que atinge a retina. Em bebês, cujo ritmo circadiano ainda está em formação nos primeiros meses, a exposição à luz durante o sono pode fragmentar cochilos e antecipar o despertar matinal.

Na prática, isso significa duas coisas:

- **Cochilos diurnos** ficam mais consistentes em ambiente escurecido
- **Despertar de madrugada no verão** — quando amanhece antes das cinco — é frequentemente resolvido com blackout adequado

## Como conseguir escuridão real

Aqui está o ponto que a maioria dos pais descobre depois de já ter comprado: **tecido blackout não garante quarto escuro**.

O blackout bloqueia a luz que atravessa o tecido. Ele não faz nada contra a luz que passa ao redor dele. E é justamente essa luz de contorno que clareia o quarto.

### As frestas que arruinam o resultado

| Fresta | Solução |
|---|---|
| Laterais | Transbordo de 15 a 20 cm de cada lado |
| Superior | Bandô fechado ou sanca com trilho embutido |
| Inferior | Barra praticamente encostando no piso |
| Ao redor do painel | [Sistema zip](/tipos-de-cortinas/cortina-rolo-com-sistema-zip) com trilhos laterais |

### O padrão-ouro para quarto de bebê

A combinação que resolve de forma definitiva:

1. **Persiana rolô blackout com sistema zip**, colada ao vidro, com trilhos laterais que eliminam as frestas
2. **Cortina de tecido** por cima, fixada acima do vão com transbordo generoso

Se o orçamento não comportar as duas camadas, priorize a instalação correta sobre o tecido mais caro. Um blackout intermediário bem instalado escurece muito mais que um blackout premium com frestas.

## Materiais adequados para quarto infantil

### O que priorizar

**Tecidos laváveis em máquina.** Quarto de criança suja. Poliéster e algodão resolvem.

**Trama fechada.** Acumula menos ácaros que tramas abertas.

**Certificação de baixa emissão.** Selos como OEKO-TEX Standard 100 atestam ausência de substâncias nocivas — relevante em um ambiente onde a criança passa 12 a 16 horas por dia.

**Cores claras e neutras** na base, com estímulo visual vindo de elementos trocáveis. Bebês não precisam de estímulo visual permanente no ambiente de dormir; ao contrário, um quarto visualmente calmo favorece o sono.

### O que evitar

- **Fibras naturais não laváveis** em máquina
- **Bambu e palha**, que acumulam poeira nas frestas da trama e não podem ser lavados
- **Veludo**, que retém pó e alérgenos no pelo
- **Tecidos com tratamento químico** sem certificação
- **Peças muito longas** que a criança possa puxar ou escalar quando começar a andar

## Alergias e qualidade do ar

Se houver histórico familiar de rinite, asma ou dermatite atópica, alguns cuidados adicionais valem a pena:

- Prefira **poliéster de trama fechada**, que acumula menos ácaros
- Estabeleça **aspiração quinzenal** e higienização a cada três meses
- Considere [persiana integrada em vidro duplo](/tipos-de-cortinas/persiana-integrada-em-vidro-duplo), que nunca acumula poeira porque as lâminas ficam seladas entre os vidros
- Evite cortinas muito volumosas e com muitas pregas, que ampliam a superfície de acúmulo

## Conforto térmico

Bebês regulam temperatura corporal com menos eficiência que adultos. A janela é o ponto de maior troca térmica de qualquer ambiente.

Duas soluções se destacam:

**[Persiana celular](/tipos-de-cortinas/persiana-celular-colmeia):** as células de ar reduzem em até 40% a troca térmica. Disponível em versão blackout e com sistema top-down/bottom-up.

**Cortina blackout de trama tripla:** o próprio peso do tecido já oferece bom isolamento, e cobre uma área maior da parede.

Em quartos com fachada oeste, onde o sol da tarde superaquece o ambiente justamente no horário do cochilo, o ganho é imediato e mensurável.

## Ruído

Se o quarto der para rua movimentada, uma cortina de tecido denso ajuda — mas com expectativa calibrada. Cortinas atenuam de 5 a 12 decibéis em frequências médias e altas: vozes, latidos, tráfego leve. Não resolvem ruído de baixa frequência, como caminhões e obras.

Ainda assim, a diferença entre uma janela nua e uma cortina pesada é perceptível na hora de fazer o bebê dormir.

## Projetando para o crescimento

Uma consideração prática: o quarto de bebê vira quarto de criança em dois anos, e quarto de adolescente em dez.

Vale investir em uma **base neutra e duradoura** — o sistema blackout, o trilho, a instalação — e deixar a personalidade para elementos facilmente substituíveis, como o painel decorativo de tecido, almofadas e roupa de cama.

O sistema blackout com boa instalação permanecerá útil por toda a infância e adolescência. O tecido estampado de bichinhos, não.

## Checklist final

- [ ] Nenhum cordão acessível ao alcance da criança
- [ ] Berço a pelo menos 1 metro da janela
- [ ] Blackout instalado fora do vão, com 15 cm de transbordo
- [ ] Topo vedado com bandô ou sanca
- [ ] Barra praticamente encostando no piso
- [ ] Tecido lavável em máquina
- [ ] Certificação de baixa emissão de substâncias
- [ ] Sem faixas, laços ou franjas soltas
- [ ] Fixação testada e reforçada
- [ ] Plano de higienização definido

Segurança primeiro, escuridão em segundo, estética em terceiro. Nessa ordem, sem exceção.`,
  },
  {
    title: 'Como as cortinas reduzem o calor e a conta de energia',
    slug: 'cortinas-reduzem-calor-e-conta-de-energia',
    categorySlug: 'conforto-e-eficiencia',
    tags: ['conforto térmico', 'economia de energia', 'screen', 'persiana celular'],
    daysAgo: 50,
    coverImage: '/images/blog/cortinas-reduzem-calor-e-conta-de-energia.jpg',
    coverImageAlt: 'Sol da tarde incidindo em janela protegida por persiana screen',
    excerpt:
      'A janela é o ponto de maior troca térmica de qualquer ambiente. Entenda como diferentes sistemas reduzem o ganho de calor, quanto isso representa na conta de luz e onde investir primeiro.',
    metaTitle: 'Cortinas e conforto térmico: como reduzir calor e energia',
    metaDescription:
      'Como cortinas e persianas reduzem o ganho de calor pela janela, qual sistema tem melhor desempenho térmico e quanto isso impacta o consumo do ar-condicionado.',
    keywords: [
      'cortina para reduzir calor',
      'conforto térmico janela',
      'persiana celular economia',
      'cortina térmica',
    ],
    content: `Em uma residência típica, a janela é o componente da envoltória com pior desempenho térmico. Uma parede de alvenaria com reboco tem resistência térmica razoável; um vidro simples de 4 mm praticamente não tem nenhuma. É por ali que o calor entra no verão e escapa no inverno.

Cortinas e persianas são, para a maioria das casas brasileiras, a intervenção mais barata e mais rápida para corrigir isso. Este artigo explica os mecanismos envolvidos, compara o desempenho real de cada sistema e mostra onde o investimento rende mais.

## Como o calor entra pela janela

Três mecanismos atuam simultaneamente:

### 1. Radiação solar direta

A parcela mais significativa em climas quentes. A radiação atravessa o vidro, atinge piso, móveis e paredes, e é convertida em calor. Uma janela oeste sem proteção pode receber mais de 500 W/m² no fim da tarde.

### 2. Condução pelo vidro

O vidro conduz calor da face externa quente para a interna. Vidro simples tem transmitância térmica alta — em torno de 5,7 W/m²·K —, o que significa troca intensa.

### 3. Convecção

O ar aquecido junto ao vidro circula pelo ambiente, distribuindo o calor.

Cada sistema de cortina atua de forma diferente sobre esses três mecanismos, e é isso que explica as diferenças de desempenho.

## O fator decisivo: onde a radiação é bloqueada

Aqui está o princípio mais importante e o menos conhecido: **é muito mais eficiente bloquear a radiação antes que ela atravesse o vidro do que depois**.

Uma cortina interna intercepta a radiação **já dentro** do ambiente. Ela absorve o calor e o irradia de volta para o cômodo. O ganho existe, mas é parcial.

Uma proteção externa — brise, toldo, persiana externa, ou simplesmente uma árvore — bloqueia a radiação **antes** do vidro, e o calor absorvido se dissipa no ar exterior. A eficiência é substancialmente maior.

Como proteção externa raramente é viável em apartamentos, trabalhamos com o que é possível internamente — e aí as diferenças entre sistemas se tornam relevantes.

## Comparativo de desempenho térmico

| Sistema | Bloqueio de radiação | Isolamento condutivo | Desempenho geral |
|---|---|---|---|
| [Persiana celular](/tipos-de-cortinas/persiana-celular-colmeia) | Alto | **Muito alto** | ★★★★★ |
| [Screen solar](/tipos-de-cortinas/persiana-screen-solar) | **Muito alto** | Baixo | ★★★★☆ |
| [Cortina acústica/térmica](/tipos-de-cortinas/cortina-acustica-e-termica) | Muito alto | Alto | ★★★★☆ |
| [Blackout de trama tripla](/tipos-de-cortinas/cortina-blackout-de-tecido) | Muito alto | Médio | ★★★★☆ |
| [Veludo](/tipos-de-cortinas/cortina-de-veludo) | Alto | Alto | ★★★★☆ |
| [Persiana de madeira](/tipos-de-cortinas/persiana-de-madeira) | Alto | Médio | ★★★☆☆ |
| Persiana de alumínio | Médio | Baixo | ★★☆☆☆ |
| [Voil](/tipos-de-cortinas/cortina-de-voil) | Baixo | Nenhum | ★☆☆☆☆ |

## Por que a persiana celular lidera

A [persiana celular](/tipos-de-cortinas/persiana-celular-colmeia) tem uma construção que nenhum outro sistema replica: o tecido é dobrado formando células hexagonais, e dentro de cada célula fica **ar parado**.

Ar parado é um dos melhores isolantes disponíveis — é exatamente o princípio do vidro duplo, da lã de vidro e do casaco de inverno. A célula impede que o ar circule, e sem circulação não há transporte de calor por convecção.

Medições de fabricantes e estudos independentes indicam redução de até **40% na perda de calor** no inverno e ganhos comparáveis no verão, com desempenho ainda melhor nas versões de célula dupla.

Para maximizar o efeito, a instalação deve ser **dentro do vão**, o mais próxima possível do vidro. Isso confina o ar entre a persiana e a janela, criando uma segunda barreira.

## Por que a screen é tão eficiente contra radiação

A [screen solar](/tipos-de-cortinas/persiana-screen-solar) trabalha em um mecanismo diferente: ela **rejeita a radiação** antes que ela seja convertida em calor no interior.

Modelos de qualidade bloqueiam de 90% a 99% dos raios UV e uma fração significativa da radiação infravermelha, que é a portadora do calor. E fazem isso preservando a vista — algo que nenhum tecido opaco consegue.

O desempenho depende de dois fatores:

**Fator de abertura:** quanto menor, maior o bloqueio. Uma screen 1% bloqueia mais calor que uma 10%.

**Cor:** aqui há uma inversão contraintuitiva. Screens **claras refletem** mais radiação para fora, tendo melhor desempenho térmico, mas causam mais ofuscamento. Screens **escuras absorvem** mais calor (que depois irradia para dentro), porém oferecem visão externa muito superior.

Para fachada oeste com sol intenso, screen clara em abertura 1% ou 3% é a combinação de melhor desempenho.

## O efeito da cor e da face refletiva

Uma cortina de cor clara reflete mais radiação que uma escura. A diferença é mensurável: em testes de campo, painéis brancos podem reduzir o ganho de calor de 30% a 40% em comparação com painéis pretos do mesmo material.

Muitos blackouts de qualidade aproveitam isso com o **verso branco ou aluminizado**, voltado para o vidro. É por isso que a face externa de cortinas técnicas costuma ser clara mesmo quando a face interna é escura — e por isso instalar a peça invertida prejudica o desempenho.

## Quanto isso representa na conta de luz

A estimativa depende de muitas variáveis — clima, orientação, área envidraçada, eficiência do aparelho, hábitos de uso — mas alguns números ajudam a dimensionar.

Em um ambiente de 20 m² com 4 m² de janela em fachada oeste, sem proteção solar, o ganho térmico no pico da tarde pode ultrapassar **1,5 kW** — equivalente à carga térmica de um ar-condicionado de 12.000 BTUs funcionando só para compensar a janela.

Reduzir esse ganho em 50% a 70% com uma screen ou uma celular significa:

- O aparelho atinge a temperatura desejada mais rápido
- O compressor cicla menos vezes
- O consumo cai proporcionalmente ao tempo de compressor ligado

Estimativas conservadoras apontam **10% a 25% de redução no consumo de climatização** com proteção solar interna adequada em fachadas expostas. Em uma conta de energia com peso significativo de ar-condicionado, o retorno do investimento costuma ocorrer entre dois e cinco anos.

## Onde investir primeiro

Se o orçamento é limitado, a ordem de prioridade é clara:

**1. Fachada oeste.** O sol da tarde é o mais intenso e o mais prolongado. Uma única janela oeste protegida rende mais que três janelas sul.

**2. Ambientes climatizados.** Proteger a janela de um quarto com ar-condicionado ligado oito horas por dia tem retorno direto.

**3. Maior área envidraçada.** Salas com fachada de vidro concentram o problema.

**4. Fachada leste.** Sol da manhã, menos intenso mas relevante em quartos.

**5. Fachadas norte e sul.** Menor prioridade no Brasil, com exceção de regiões extremas.

## Instalação: os detalhes que definem o resultado

O sistema certo mal instalado perde grande parte do desempenho. Três pontos importam:

**Proximidade do vidro.** Quanto mais perto, melhor. Uma persiana rente ao vidro cria uma câmara de ar confinada. Uma cortina a 20 cm da janela permite convecção livre.

**Vedação das bordas.** O ar quente que sobe pela lateral da cortina contorna a barreira. Sistemas com trilhos laterais ([zip](/tipos-de-cortinas/cortina-rolo-com-sistema-zip)) são muito superiores nesse aspecto.

**Cobertura do topo.** Bandô fechado ou sanca impedem que o ar aquecido escape por cima e circule pelo ambiente.

## O sistema em duas camadas

O melhor desempenho térmico residencial vem da combinação:

1. **Screen solar** rente ao vidro, rejeitando a radiação
2. **Cortina de tecido denso** por cima, adicionando isolamento condutivo

Nos horários de sol intenso, a screen trabalha sozinha e preserva a vista. À noite ou em dias de frio, a cortina fecha e acrescenta a barreira térmica.

## Automação: o ganho que ninguém contabiliza

Uma proteção solar só funciona se estiver fechada nos horários certos. E, na prática, quase ninguém fecha a cortina antes de sair de casa.

[Cortinas motorizadas](/tipos-de-cortinas/cortina-motorizada) com programação por horário ou por sensor de luminosidade resolvem exatamente isso: fecham automaticamente às 14h, quando o sol começa a bater na fachada oeste, e reabrem às 18h.

Esse detalhe operacional costuma representar mais ganho real do que a diferença entre dois tecidos de desempenho parecido.

## O que cortinas não resolvem

É importante ser honesto sobre os limites:

- **Não substituem vidro duplo** em climas de frio rigoroso
- **Não corrigem infiltração de ar** por esquadrias mal vedadas
- **Não compensam ausência de isolamento** na cobertura, que costuma ser a maior fonte de ganho térmico em casas térreas
- **Não resolvem ponte térmica** em estruturas metálicas

Cortinas são uma camada de um sistema. São, no entanto, a camada de melhor relação custo-benefício e a única que pode ser instalada em uma tarde, sem obra e sem autorização de condomínio.`,
  },
  {
    title: 'Cortina motorizada vale a pena? Custos, tipos de motor e automação',
    slug: 'cortina-motorizada-vale-a-pena',
    categorySlug: 'tecnologia',
    tags: ['automação', 'motorização', 'smart home', 'tecnologia'],
    daysAgo: 58,
    coverImage: '/images/blog/cortina-motorizada-vale-a-pena.jpg',
    coverImageAlt: 'Aplicativo de celular controlando cortina motorizada em sala moderna',
    excerpt:
      'Motorizar deixou de ser luxo em três situações específicas. Entenda os tipos de motor, a diferença entre bateria e alimentação fixa, protocolos de integração e quanto custa de verdade.',
    metaTitle: 'Cortina motorizada vale a pena? Custos, motores e integração',
    metaDescription:
      'Guia completo de motorização de cortinas: motor a bateria ou 110/220V, protocolos Wi-Fi, Zigbee e Matter, integração com Alexa e Google Home, custos e quando compensa.',
    keywords: [
      'cortina motorizada',
      'persiana automatizada',
      'motorizar cortina preço',
      'cortina alexa',
    ],
    content: `Motorizar cortinas era, até pouco tempo, um item de projetos de alto padrão. A queda no preço dos motores tubulares e a popularização de motores a bateria mudaram esse cenário: hoje, motorizar um vão custa uma fração do que custava há dez anos.

Mas nem toda janela precisa de motor. Este guia separa as situações em que a motorização resolve um problema real das situações em que ela é apenas conveniência — e explica as escolhas técnicas envolvidas.

## As três situações em que motorizar deixa de ser luxo

### 1. Vãos altos ou de difícil acesso

Janelas em pé-direito duplo, vidros acima de escadas, cortinas atrás de sofás, banheiras ou bancadas. Se abrir a cortina exige escada ou contorcionismo, ela simplesmente não será aberta.

### 2. Vãos muito largos ou peças pesadas

Um blackout de trama tripla em um vão de quatro metros pesa vários quilos. O esforço manual repetido desgasta o mecanismo, e o movimento irregular tende a entortar o painel. O motor aplica torque uniforme e prolonga a vida útil do conjunto.

### 3. Casas com crianças pequenas

A motorização **elimina completamente os cordões**, que são o principal risco doméstico associado a coberturas de janela. Em quartos infantis, esse argumento sozinho costuma justificar o investimento.

Fora dessas três situações, motorizar é conforto — legítimo, mas opcional.

## Tipos de motor

### Motor tubular

Instalado **dentro do tubo** da persiana rolô. É o formato mais comum, invisível quando instalado e disponível em diversos torques.

### Motor de trilho

Acoplado ao trilho de cortinas de tecido, move os cursores por correia ou cabo. Usado em cortinas wave e de pregas.

### Motor externo acoplado

Fixado ao lado do mecanismo existente, aciona a corrente de uma persiana já instalada. É a solução de retrofit mais barata, embora visualmente menos discreta.

## Bateria ou alimentação fixa?

Esta é a primeira decisão estrutural, e ela define se haverá obra.

### Motor a bateria recarregável

**A favor:**
- Dispensa ponto elétrico e quebra de parede
- Instalação em qualquer momento, inclusive em imóvel alugado
- Ideal para reformas e retrofits

**Contra:**
- Exige recarga periódica
- Torque geralmente menor
- Vida útil da bateria de 3 a 6 anos

**Autonomia real:** de 6 meses a 2 anos, dependendo do peso da peça, do número de acionamentos diários e da temperatura ambiente. Um vão acionado duas vezes por dia costuma render de 8 a 12 meses por carga.

**Painel solar acoplado:** disponível na maioria das marcas, fixa-se no vidro e mantém a bateria carregada indefinidamente em janelas que recebem luz. Resolve o principal incômodo do sistema.

### Motor 110/220 V

**A favor:**
- Sem limite de acionamentos
- Torque superior para peças pesadas
- Sem manutenção de bateria

**Contra:**
- Exige ponto elétrico previsto
- Obra em caso de reforma
- Instalação mais cara

**Regra prática:** em obra nova, sempre preveja o ponto elétrico — mesmo que a motorização venha depois. Um ponto de tomada acima do vão custa quase nada durante a obra e é caríssimo depois.

## Protocolos de comunicação

O protocolo determina o que o sistema consegue fazer.

| Protocolo | Alcance | Integração | Observação |
|---|---|---|---|
| Radiofrequência (RF) | Bom | Só controle próprio | Simples, confiável, sem internet |
| Wi-Fi | Depende do roteador | Alexa, Google | Consome mais bateria |
| Zigbee | Excelente (rede mesh) | Requer hub | Muito eficiente em energia |
| Z-Wave | Excelente (mesh) | Requer hub | Menos comum no Brasil |
| Matter | Excelente | Padrão universal | Tendência de consolidação |

**Recomendação prática:** se a casa já tem automação, use o protocolo do ecossistema existente. Se está começando, **Matter** é a aposta mais segura para os próximos anos, por ser padrão aberto e compatível com Apple, Google, Amazon e Samsung.

Se o objetivo é apenas acionar por controle remoto, sem integração, a **radiofrequência simples** é mais barata, mais confiável e não depende de rede.

## Quanto custa

Valores de referência do mercado brasileiro, por vão:

| Item | Faixa de preço |
|---|---|
| Motor tubular a bateria | R$ 600 – R$ 1.400 |
| Motor tubular 110/220V | R$ 500 – R$ 1.200 |
| Motor de trilho para cortina | R$ 1.200 – R$ 3.000 |
| Motor externo acoplado (retrofit) | R$ 400 – R$ 900 |
| Controle remoto | R$ 120 – R$ 400 |
| Hub Zigbee/Matter | R$ 300 – R$ 900 |
| Painel solar para bateria | R$ 250 – R$ 600 |
| Instalação e configuração | R$ 150 – R$ 400 |

Um vão motorizado completo, com peça, motor, controle e instalação, costuma ficar entre **R$ 1.500 e R$ 3.500**.

## O que a automação permite de fato

Além de abrir e fechar sem levantar do sofá:

**Programação por horário.** Fechar às 14h na fachada oeste e reabrir às 18h. Esse único automatismo reduz de forma mensurável a carga térmica e o consumo do ar-condicionado.

**Nascer e pôr do sol.** As cortinas seguem o horário solar real, que muda ao longo do ano.

**Sensor de luminosidade.** Fecha automaticamente quando a incidência ultrapassa um limite definido.

**Cenas integradas.** "Modo cinema" fecha as cortinas, apaga as luzes e liga o projetor. "Bom dia" abre as cortinas gradualmente.

**Simulação de presença.** Durante viagens, o padrão de abertura e fechamento sugere casa ocupada.

**Abertura gradual.** Alguns motores permitem abrir 20% ao amanhecer, criando um despertar natural por luz.

## Instalação e configuração

Os pontos que definem se o sistema vai funcionar bem:

**Dimensionamento do torque.** Um motor subdimensionado trava sob carga, faz ruído e queima prematuramente. O cálculo parte do peso real da peça e do diâmetro do tubo.

**Ajuste dos fins de curso.** Define exatamente onde a peça para ao subir e descer. Mal ajustado, o painel bate no peitoril ou para antes do fim.

**Pareamento e nomeação.** Dispositivos com nomes claros ("Cortina Quarto Casal") facilitam o comando por voz. Nomes genéricos geram confusão.

**Documentação.** Senhas de rede, nomes de dispositivos e cenas criadas devem ficar registrados. Trocar de roteador sem essa informação costuma exigir reconfiguração completa.

## Problemas comuns e como evitá-los

**Bateria descarregando rápido demais.** Geralmente indica motor subdimensionado ou peça mais pesada que o previsto. Painel solar mitiga, mas não corrige o dimensionamento.

**Motor ruidoso.** Motores atuais operam entre 35 e 45 dB. Acima disso, suspeite de subdimensionamento ou de atrito no tubo. Para dormitórios, especifique modelos silenciosos abaixo de 35 dB.

**Perda de conexão Wi-Fi.** Motores Wi-Fi em 2,4 GHz sofrem com roteadores distantes. Zigbee com hub resolve, por formar rede mesh.

**Fim de curso perdido.** Acontece após queda de energia em alguns modelos. Reconfigurar é simples, mas exige conhecer o procedimento — daí a importância da documentação.

## Vale a pena?

**Vale claramente** quando: o vão é alto ou inacessível, a peça é pesada, há crianças pequenas, existe projeto de automação em andamento, ou a fachada exige fechamento programado por questão térmica.

**É opcional** quando: o vão é de fácil acesso, a peça é leve e a rotina de abrir e fechar não incomoda.

**Não vale** quando: a motorização seria feita em uma peça de baixa qualidade. Motorizar uma persiana ruim apenas automatiza um problema — o dinheiro rende mais melhorando a peça primeiro.

## Uma sugestão de estratégia

Em vez de motorizar a casa inteira de uma vez, comece por **um ou dois vãos críticos**: aquele que ninguém abre porque é alto demais, e a fachada que superaquece à tarde.

Se a experiência agradar, a expansão é simples — os controles e hubs já estarão instalados, e o custo marginal de cada novo vão cai bastante.`,
  },
  {
    title: 'Os 12 erros mais comuns ao comprar cortinas (e como evitá-los)',
    slug: 'erros-mais-comuns-ao-comprar-cortinas',
    categorySlug: 'guias-praticos',
    tags: ['erros comuns', 'compra', 'medidas', 'guia'],
    daysAgo: 66,
    coverImage: '/images/blog/erros-mais-comuns-ao-comprar-cortinas.jpg',
    coverImageAlt: 'Cortina mal instalada com frestas de luz nas laterais',
    excerpt:
      'Quase todo arrependimento com cortinas vem de um punhado de erros repetidos. Do trilho instalado baixo demais à metragem insuficiente de tecido, o que dá errado e como corrigir antes de comprar.',
    metaTitle: '12 erros comuns ao comprar cortinas e como evitá-los',
    metaDescription:
      'Os erros mais frequentes na compra de cortinas: medida errada, trilho baixo, pouco tecido, tecido inadequado ao ambiente, blackout com frestas e instalação em drywall.',
    keywords: [
      'erros ao comprar cortina',
      'como não errar na cortina',
      'dicas cortina',
      'arrependimento cortina',
    ],
    content: `Depois de acompanhar centenas de projetos, fica evidente que os arrependimentos com cortinas não são variados. São os mesmos doze erros, repetidos com uma consistência quase impressionante.

A boa notícia: todos são evitáveis, e a maioria custa nada para corrigir — desde que a correção aconteça **antes** da compra.

## 1. Instalar o trilho rente ao vão

É o erro mais comum e o de correção mais barata.

A cortina instalada logo acima da janela achata o ambiente e evidencia o pé-direito baixo. Instalada próxima ao teto — ou no teto — ela alonga verticalmente o espaço e faz a janela parecer maior.

**Regra:** suba de 10 a 15 cm acima do vão, ou vá direto ao teto. Se houver sanca, embuta.

**Bônus:** a instalação mais alta melhora o bloqueio de luz superior, especialmente relevante em blackout.

## 2. Comprar tecido de menos

Uma cortina com 1,5 vez a largura do vão parece pobre independentemente do preço do tecido. Com 2,5 a 3 vezes, o mesmo tecido parece caro.

| Cabeçote | Mínimo aceitável | Ideal |
|---|---|---|
| Prega francesa | 2,5× | 3× |
| Wave | 2,2× | 2,5× |
| Ilhós | 2× | 2,5× |
| Voil (qualquer) | 2,5× | 3× |

Voil especialmente: por ser leve e translúcido, só ganha presença com muita metragem.

## 3. Medir apenas um ponto

Paredes não são paralelas. Em imóveis com mais de dez anos, variações de 1 a 3 cm dentro do mesmo vão são comuns.

**Sempre meça três larguras** (topo, meio, base) e **três alturas** (esquerda, centro, direita). Em instalação interna, use a menor medida. Em externa, a maior mais o transbordo.

E use trena metálica — trena de tecido estica e o erro é sempre para mais.

## 4. Achar que blackout garante quarto escuro

O blackout bloqueia a luz que atravessa o tecido. Não faz nada contra a luz que passa ao redor.

Instalada dentro do vão, uma persiana blackout deixa duas faixas verticais de luz que clareiam o quarto inteiro.

**Correção:** instale fora do vão, com 15 a 20 cm de transbordo lateral, feche o topo com bandô ou sanca e deixe a barra encostando no piso. Em casos críticos, use [sistema zip](/tipos-de-cortinas/cortina-rolo-com-sistema-zip).

## 5. Usar screen como única proteção em quarto

A [screen](/tipos-de-cortinas/persiana-screen-solar) oferece privacidade **de dia**, porque você enxerga do lado escuro para o claro.

À noite, com a luz interna acesa, a relação inverte e o ambiente fica visível de fora com nitidez desconfortável.

**Correção:** screen sempre com uma segunda camada em dormitórios e janelas de térreo.

## 6. Escolher fibra natural para janela oeste

Linho puro, algodão e seda desbotam e ressecam sob sol direto e prolongado. Em fachada oeste, o dano aparece em um ou dois anos.

**Correção:** para fachada oeste, use poliéster com proteção UV, screen, ou tecidos com **solidez à luz acima de 6** na escala de 1 a 8. Se o linho for inegociável, proteja-o com uma screen instalada por trás.

## 7. Ignorar o tipo de parede na fixação

Bucha plástica comum em drywall é a causa número um de trilho caindo.

| Substrato | Fixação correta |
|---|---|
| Alvenaria de tijolo | Bucha plástica convencional |
| Concreto | Furadeira de impacto + bucha específica |
| Drywall | Montante metálico ou bucha basculante |
| Gesso sem reforço | Mão-francesa apoiada na laje |

E antes de furar: **detecte tubulações**. Um eletroduto perfurado transforma uma instalação de duas horas em uma pequena reforma.

## 8. Não considerar o peso do tecido

Veludo, blackout de trama tripla e tecidos acústicos ultrapassam facilmente 400 g/m². Em um vão de 3 metros com 2,80 m de altura e franzido de 2,5×, isso significa vários quilos concentrados em poucos suportes.

**Correção:** distribua suportes a cada 60 a 80 cm e use trilho compatível com a carga. Trilho de alumínio fino não sustenta veludo.

## 9. Esquecer o lado do acionamento

Em persianas com corrente, é preciso informar de que lado ela ficará. Parece detalhe, mas trocar depois exige desmontar a peça.

Escolha o lado considerando: circulação do ambiente, posição de móveis, alcance confortável e — se houver criança — o lado mais afastado do berço ou da cama.

## 10. Comprar cortina pronta para vão sob medida

Cortinas prontas vêm em alturas padronizadas: 2,00 m, 2,30 m, 2,50 m. Pé-direito residencial brasileiro varia de 2,50 m a 2,80 m, e com instalação alta a altura necessária passa facilmente de 2,70 m.

O resultado é uma cortina curta, que "flutua" acima do piso e denuncia a improvisação.

**Correção:** se o orçamento for apertado, prefira uma peça sob medida em tecido mais simples a uma peça pronta em tecido caro. A altura correta importa mais que a fibra.

## 11. Escolher o tecido no showroom

Iluminação de loja é projetada para valorizar produtos. Cor, brilho e caimento mudam radicalmente entre o showroom e a sua sala.

**Correção:** peça amostra física, prenda na janela do ambiente e observe em pelo menos dois horários do dia — manhã e fim de tarde. Conviva com ela por dois ou três dias. É o teste mais barato e mais confiável que existe.

## 12. Não planejar a manutenção

Cortina de linho puro em quarto de criança. Persiana de madeira em banheiro. Bambu em cozinha. Veludo em casa com dois gatos.

São escolhas que funcionam bem no primeiro mês e viram problema no primeiro ano.

**Antes de fechar, responda:**
- Este material tolera a umidade e a sujeira deste ambiente?
- Com que frequência precisará ser limpo?
- Eu consigo limpar em casa ou dependerei de serviço profissional?
- O custo dessa manutenção cabe no orçamento anual?

## Erros menos frequentes, mas caros

**Não prever ponto elétrico para motorização.** Durante a obra, custa quase nada. Depois, exige quebrar acabamento.

**Sanca rasa demais.** Um trilho wave precisa de 12 a 15 cm livres de profundidade. Sancas de 8 cm não comportam.

**Cortina que bate no rodapé.** Em instalação externa até o chão, o rodapé impede o tecido de encostar na parede, criando uma barriga na barra.

**Esquecer o rapport da estampa.** Tecidos estampados precisam de metragem adicional para casar o desenho entre painéis. Descobrir isso depois do corte é caro.

**Trilho no lugar do ar-condicionado.** Split instalado acima da janela é conflito clássico. Meça antes.

## Checklist de compra

Antes de fechar qualquer pedido:

- [ ] Sistema definido conforme o problema do ambiente
- [ ] Três medidas de largura e três de altura anotadas
- [ ] Instalação decidida: dentro ou fora do vão
- [ ] Altura de fixação definida (10–15 cm acima ou no teto)
- [ ] Transbordo lateral definido
- [ ] Metragem de tecido calculada com o multiplicador correto
- [ ] Tecido testado com amostra na luz do ambiente
- [ ] Solidez à luz compatível com a orientação solar
- [ ] Tipo de parede identificado e fixação especificada
- [ ] Lado do acionamento definido
- [ ] Interferências mapeadas (ar-condicionado, tomadas, rodapé)
- [ ] Plano de manutenção compatível com a rotina da casa

Doze itens. Vinte minutos de conferência. É o que separa uma cortina que você esquece que está lá de uma que incomoda todos os dias.`,
  },
];

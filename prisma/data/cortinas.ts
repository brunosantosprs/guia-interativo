import type { Prisma } from '@prisma/client';

/**
 * Catalogo editorial de tipos de cortinas e persianas.
 *
 * Cada registro nasce completo: descricao rica (180-250 palavras), vantagens,
 * desvantagens, ambientes recomendados, nivel de bloqueio de luz e o criterio
 * de "quando escolher". E o conteudo mais consultado do site e a principal
 * prova de profundidade editorial para a analise do Google AdSense.
 */
export type CurtainSeed = Omit<
  Prisma.CurtainTypeCreateInput,
  'createdAt' | 'updatedAt'
>;

export const curtainTypes: CurtainSeed[] = [
  // =========================================================================
  // CORTINAS DE TECIDO
  // =========================================================================
  {
    name: 'Cortina de Voil',
    slug: 'cortina-de-voil',
    category: 'Cortinas',
    lightBlocking: 'BAIXO',
    order: 1,
    featured: true,
    image: '/images/cortinas/cortina-de-voil.jpg',
    imageAlt: 'Cortina de voil branca com caimento leve em janela ampla',
    summary:
      'Tecido leve e translúcido que filtra a luz sem escurecer o ambiente. É a base da maioria das composições em camadas.',
    description:
      'O voil é um tecido de trama aberta e fios finos, geralmente em poliéster ou em misturas com algodão e linho, que deixa a luz atravessar de forma difusa.\n\nEle não escurece o cômodo. Transforma a claridade direta do sol em uma luminosidade suave e homogênea, ao mesmo tempo em que cria uma barreira visual parcial contra quem olha de fora durante o dia.\n\nPor ser extremamente leve, forma ondas contínuas e um caimento fluido mesmo em painéis muito largos, o que explica sua popularidade em salas com pé-direito alto e janelas panorâmicas.\n\nNa prática, o voil raramente trabalha sozinho.\n\nEle costuma ocupar o trilho da frente em uma composição dupla, com um blackout ou um tecido mais encorpado atrás, permitindo alternar entre privacidade total à noite e luz filtrada durante o dia.\n\nA largura recomendada de tecido é de 2,5 a 3 vezes a largura do vão, porque o voil só ganha volume e sofisticação quando franzido com generosidade.\n\nExistem versões lisas, com listras tecidas, com fio brilhante e com barra em chumbo costurada, que ajuda o painel a "cair" reto.\n\nÉ um tecido barato de repor, o que o torna uma boa porta de entrada para quem quer testar um estilo antes de investir em peças definitivas.',
    whenToChoose:
      'Escolha voil quando o objetivo for suavizar a luz natural e ganhar privacidade diurna sem abrir mão da claridade — especialmente em salas, varandas gourmet e ambientes integrados.\n\nÉ a peça certa para quem quer um visual leve e clássico, e a camada obrigatória de qualquer composição dupla com blackout em quartos.',
    priceRange: 'R$ 60 a R$ 180 por metro linear de tecido',
    maintenance:
      'Lavagem à mão ou em máquina no ciclo delicado, com água fria e sem centrifugação forte. Pendure ainda úmido no próprio varão para desamassar sem passar.',
    installation:
      'Instalada em trilho ou varão duplo. Considere 2,5x a largura do vão em tecido e deixe 1 a 2 cm de folga do chão para evitar arraste.',
    materials: ['Poliéster', 'Poliéster com linho', 'Algodão misto', 'Fio brilhante'],
    advantages: [
      'Difunde a luz do sol e elimina o ofuscamento sem escurecer',
      'Caimento leve e elegante mesmo em vãos muito largos',
      'Preço acessível e reposição fácil',
      'Lavável em casa, seca rápido e praticamente não amassa',
      'Combina com qualquer estilo de decoração',
    ],
    disadvantages: [
      'Não oferece privacidade à noite, quando a luz interna está acesa',
      'Bloqueio térmico praticamente nulo',
      'Trama aberta acumula poeira com facilidade',
      'Precisa de muita metragem para ficar bonito, o que encarece o conjunto',
    ],
    bestRooms: ['Sala de estar', 'Sala de jantar', 'Varanda', 'Quarto (em composição dupla)', 'Home office'],
    metaTitle: 'Cortina de Voil: quando usar, vantagens e como escolher',
    metaDescription:
      'Guia completo da cortina de voil: como o tecido filtra a luz, metragem ideal, composição com blackout, manutenção e em quais ambientes ela funciona melhor.',
  },
  {
    name: 'Cortina de Linho',
    slug: 'cortina-de-linho',
    category: 'Cortinas',
    lightBlocking: 'MEDIO',
    order: 2,
    featured: true,
    image: '/images/cortinas/cortina-de-linho.jpg',
    imageAlt: 'Cortina de linho natural com textura visível e caimento pesado',
    summary:
      'Fibra natural de textura marcante e caimento pesado. Traz sofisticação discreta e envelhece bem, mas exige cuidado na lavagem.',
    description:
      'O linho é uma fibra natural extraída do caule da linhaça e reconhecida pela textura irregular, pelo brilho fosco e por um caimento denso que nenhum sintético reproduz com fidelidade.\n\nEm cortinas, ele ocupa um lugar particular: filtra a luz com um tom levemente amarelado e quente, cria sombras suaves e dá ao ambiente uma sensação de matéria e permanência.\n\nA gramatura muda completamente o resultado. Linhos leves, entre 120 e 180 g/m², comportam-se quase como um voil encorpado e ainda deixam passar bastante claridade.\n\nAcima de 250 g/m², o tecido bloqueia boa parte da luz direta e ganha peso suficiente para formar pregas largas e escultóricas.\n\nA grande maioria das cortinas vendidas hoje como "linho" é, na verdade, uma mistura de linho com poliéster ou viscose.\n\nA combinação reduz o amassado, aumenta a estabilidade dimensional e derruba o preço. Em troca, sacrifica parte da textura original.\n\nO linho puro encolhe na primeira lavagem, desbota sob sol direto e amassa por natureza; para muita gente, esse aspecto vivido é justamente o atrativo.\n\nEm ambientes com luz agressiva do fim da tarde, vale escolher linhos com tratamento antiUV ou proteger a peça com uma persiana screen instalada por trás.',
    whenToChoose:
      'Escolha linho quando quiser textura natural e um ar de sofisticação discreta, em projetos de estilo escandinavo, rústico contemporâneo ou minimalista quente.\n\nÉ ideal para salas e quartos que recebem luz indireta. Evite em janelas com sol direto o dia inteiro sem proteção adicional.',
    priceRange: 'R$ 180 a R$ 600 por metro linear, conforme a pureza da fibra',
    maintenance:
      'Prefira lavagem a seco no linho puro. Nas misturas, use ciclo delicado com água fria, nunca use alvejante e passe ainda úmido pelo avesso.',
    installation:
      'Pede trilho reforçado por causa do peso. Pregas francesas ou wave valorizam o caimento; ilhós tendem a achatar a textura.',
    materials: ['Linho puro', 'Linho com viscose', 'Linho com poliéster', 'Linho com algodão'],
    advantages: [
      'Textura natural inconfundível que valoriza qualquer ambiente',
      'Caimento pesado e pregas bem definidas',
      'Fibra respirável, indicada para climas quentes',
      'Envelhece bem e ganha aspecto artesanal com o uso',
      'Disponível em gramaturas que vão do translúcido ao semiopaco',
    ],
    disadvantages: [
      'Amassa com facilidade — característica intrínseca da fibra',
      'Encolhe na primeira lavagem se não for pré-encolhido',
      'Desbota sob incidência direta e prolongada de sol',
      'Preço elevado no linho puro',
      'Manutenção mais delicada que a dos sintéticos',
    ],
    bestRooms: ['Sala de estar', 'Quarto de casal', 'Sala de jantar', 'Escritório', 'Suíte máster'],
    metaTitle: 'Cortina de Linho: gramatura, vantagens e cuidados essenciais',
    metaDescription:
      'Tudo sobre cortina de linho: diferença entre linho puro e misto, gramatura ideal, comportamento sob luz solar, manutenção correta e ambientes recomendados.',
  },
  {
    name: 'Cortina Blackout de Tecido',
    slug: 'cortina-blackout-de-tecido',
    category: 'Cortinas',
    lightBlocking: 'BLACKOUT',
    order: 3,
    featured: true,
    image: '/images/cortinas/cortina-blackout-de-tecido.jpg',
    imageAlt: 'Cortina blackout escura fechada bloqueando totalmente a luz externa',
    summary:
      'Bloqueio de luz próximo de 100%, isolamento térmico e acústico parcial. Referência absoluta para quartos e salas de home theater.',
    description:
      'A cortina blackout de tecido é construída para impedir a passagem de luz. Existem duas tecnologias principais no mercado brasileiro.\n\nA primeira é o tecido com revestimento acrílico ou de PVC aplicado no verso, que forma uma película opaca.\n\nÉ a solução mais barata, mas sujeita a rachaduras e descolamento após alguns anos de dobras repetidas.\n\nA segunda é o tecido de trama tripla, também chamado de three-pass. Nele, uma camada preta é entrelaçada entre duas camadas coloridas durante a própria tecelagem.\n\nCusta mais, mas tem caimento têxtil verdadeiro, não craquela e aceita lavagem com muito mais segurança.\n\nAlém da luz, o blackout entrega dois benefícios frequentemente subestimados.\n\nReduz a troca térmica pela janela, cortando o calor que entra no verão e a perda de calor no inverno, e absorve parte da reverberação sonora do ambiente, o que suaviza ecos em salas amplas.\n\nÉ importante ajustar as expectativas: nenhuma cortina blackout produz escuridão total se houver frestas.\n\nA luz que incomoda quase sempre entra pelas laterais, pelo vão superior e pela barra inferior.\n\nPara chegar perto do escuro absoluto, a instalação precisa transbordar o vão em pelo menos 15 cm de cada lado, usar bandô ou trilho embutido em sanca e manter a barra rente ao piso.',
    whenToChoose:
      'Escolha blackout sempre que a qualidade do sono ou o controle total da luz for prioridade: quartos de bebê, quartos de quem trabalha em turnos, home theaters e salas de projeção.\n\nTambém é a resposta certa para janelas com sol da tarde que superaquecem o cômodo.',
    priceRange: 'R$ 120 a R$ 450 por metro linear de tecido',
    maintenance:
      'Blackout de trama tripla aceita lavagem delicada em água fria. Versões com revestimento acrílico devem ser apenas limpas com pano úmido, nunca torcidas ou dobradas com vinco.',
    installation:
      'Instale acima do vão, com transbordo lateral de 15 a 20 cm de cada lado. Sanca com trilho embutido é o que mais aproxima do escuro absoluto.',
    materials: ['Poliéster com revestimento acrílico', 'Trama tripla (three-pass)', 'Poliéster com PVC'],
    advantages: [
      'Bloqueia de 95% a 100% da luz externa',
      'Reduz o ganho de calor pela janela e ajuda na conta de energia',
      'Absorve parte da reverberação sonora do ambiente',
      'Protege móveis e pisos do desbotamento causado pelo sol',
      'Disponível em ampla variedade de cores e acabamentos',
    ],
    disadvantages: [
      'Deixa o cômodo escuro mesmo quando fechada de dia',
      'Versões com revestimento podem rachar com o tempo',
      'Tecido pesado exige trilho reforçado',
      'Frestas laterais comprometem o resultado se a instalação for mal dimensionada',
      'Cores escuras tendem a reter calor na própria superfície',
    ],
    bestRooms: ['Quarto de casal', 'Quarto de bebê', 'Home theater', 'Quarto infantil', 'Sala de projeção'],
    metaTitle: 'Cortina Blackout: como funciona, tipos de tecido e instalação correta',
    metaDescription:
      'Entenda a diferença entre blackout revestido e trama tripla, quanto de luz cada um bloqueia, como instalar sem frestas e em quais ambientes vale o investimento.',
  },
  {
    name: 'Cortina de Veludo',
    slug: 'cortina-de-veludo',
    category: 'Cortinas',
    lightBlocking: 'ALTO',
    order: 4,
    image: '/images/cortinas/cortina-de-veludo.jpg',
    imageAlt: 'Cortina de veludo com pregas profundas e brilho aveludado',
    summary:
      'Tecido denso e luxuoso, com excelente desempenho térmico e acústico. Pede ambientes amplos e pé-direito generoso.',
    description:
      'O veludo é um tecido de pelo curto e denso, obtido pela tecelagem de fios em duas camadas que depois são cortadas, criando aquela superfície macia que muda de tom conforme o ângulo da luz.\n\nEm cortinas, essa densidade se traduz em desempenho. O veludo bloqueia grande parte da luz mesmo sem forro blackout e funciona como isolante térmico eficiente.\n\nÉ também o tecido residencial com melhor absorção acústica, razão de teatros e salas de concerto o adotarem há mais de um século.\n\nVisualmente, ele é uma peça de assinatura. As pregas ficam profundas e escultóricas, e o jogo de brilho e sombra na superfície dá volume à parede inteira.\n\nO contraponto é o peso. Um painel de veludo pode facilmente ultrapassar 400 g/m², o que exige trilho e buchas dimensionados para carga real, além de um pé-direito que suporte visualmente tanta presença.\n\nEm ambientes pequenos e de teto baixo, o veludo tende a fechar o espaço.\n\nHoje predominam os veludos sintéticos em poliéster, muito mais estáveis, laváveis e resistentes ao desbotamento do que os veludos de algodão ou seda tradicionais.\n\nExistem ainda acabamentos como o veludo cotelê, com canaletas verticais, e o veludo amassado, que disfarça marcas de uso e é uma escolha prática para quem tem crianças ou animais.',
    whenToChoose:
      'Escolha veludo quando quiser um ambiente acolhedor e com forte presença decorativa.\n\nEle também se justifica quando isolamento acústico e térmico pesam tanto quanto a estética.\n\nFunciona bem em salas de TV, home theaters, quartos amplos e projetos clássicos ou art déco.',
    priceRange: 'R$ 200 a R$ 700 por metro linear',
    maintenance:
      'Aspire com bocal de escova a cada duas semanas para levantar o pelo. Lavagem a seco é o método mais seguro; nunca passe ferro direto sobre o pelo.',
    installation:
      'Exige trilho reforçado e fixação em alvenaria com buchas adequadas. Pregas francesas triplas valorizam a profundidade do tecido.',
    materials: ['Veludo de poliéster', 'Veludo de algodão', 'Veludo cotelê', 'Veludo amassado'],
    advantages: [
      'Melhor absorção acústica entre os tecidos residenciais',
      'Excelente isolamento térmico no inverno',
      'Bloqueio de luz alto mesmo sem forro adicional',
      'Presença visual marcante e sensação de aconchego',
      'Pregas profundas e bem definidas',
    ],
    disadvantages: [
      'Muito pesado — exige estrutura de fixação reforçada',
      'Retém poeira e pelos de animais no pelo do tecido',
      'Pode encolher visualmente ambientes pequenos',
      'Lavagem quase sempre profissional',
      'Marca com facilidade se pressionado por móveis',
    ],
    bestRooms: ['Home theater', 'Sala de estar ampla', 'Quarto de casal', 'Sala de jantar clássica'],
    metaTitle: 'Cortina de Veludo: isolamento acústico, térmico e cuidados',
    metaDescription:
      'Por que o veludo é o tecido com melhor desempenho acústico em cortinas, quais tipos existem, quanto pesa, como limpar e em quais ambientes ele funciona.',
  },
  {
    name: 'Cortina de Algodão',
    slug: 'cortina-de-algodao',
    category: 'Cortinas',
    lightBlocking: 'MEDIO',
    order: 5,
    image: '/images/cortinas/cortina-de-algodao.jpg',
    imageAlt: 'Cortina de algodão clara com caimento macio em quarto iluminado',
    summary:
      'Fibra natural versátil, lavável em casa e de custo moderado. O equilíbrio mais prático entre conforto, preço e variedade de estampas.',
    description:
      'O algodão é a fibra mais democrática do universo das cortinas. É respirável, macio ao toque e está disponível em uma variedade enorme de tramas, gramaturas e estampas.\n\nAtende desde o quarto infantil com padronagem lúdica até a sala de estar com um panamá cru de aspecto artesanal.\n\nDiferentemente do linho, o algodão tem fio mais uniforme e superfície mais lisa, o que resulta em um caimento macio e discreto, sem a textura rústica marcante da linhaça.\n\nO bloqueio de luz depende diretamente da gramatura e da trama.\n\nUm voil de algodão deixa passar quase toda a claridade; uma lona ou um panamá de 250 g/m² já reduz consideravelmente a luz direta e serve como camada única em quartos que não exigem escuridão total.\n\nA grande vantagem prática é a manutenção. Quase todas as cortinas de algodão podem ser lavadas em máquina doméstica, o que faz diferença real em casas com crianças, alergias respiratórias ou animais de estimação.\n\nOs pontos de atenção são o encolhimento — reserve de 3% a 5% de folga na barra, ou compre tecido pré-encolhido — e o desbotamento sob sol direto e constante, especialmente em cores intensas.\n\nMisturas com poliéster reduzem os dois problemas e mantêm boa parte do conforto tátil da fibra natural.',
    whenToChoose:
      'Escolha algodão quando praticidade e custo forem determinantes, e quando a cortina precisar ser lavada com frequência.\n\nÉ a fibra certa para quartos infantis, casas de alérgicos, cozinhas e imóveis de praia ou campo.',
    priceRange: 'R$ 80 a R$ 250 por metro linear',
    maintenance:
      'Lave em máquina a até 30 °C com sabão neutro. Retire ainda úmida e pendure no varão para reduzir o amassado. Evite secadora, que acentua o encolhimento.',
    installation:
      'Compatível com varão, trilho, ilhós e presilhas. Deixe folga de 3% a 5% na barra para absorver o encolhimento da primeira lavagem.',
    materials: ['Algodão puro', 'Algodão com poliéster', 'Panamá de algodão', 'Percal'],
    advantages: [
      'Lavável em máquina doméstica sem perda de qualidade',
      'Maior variedade de cores e estampas do mercado',
      'Fibra natural, respirável e hipoalergênica',
      'Custo moderado e boa disponibilidade',
      'Aceita todos os sistemas de fixação',
    ],
    disadvantages: [
      'Encolhe na primeira lavagem se não for pré-tratado',
      'Desbota sob sol direto e prolongado',
      'Amassa mais que os tecidos sintéticos',
      'Absorve odores em cozinhas',
      'Isolamento térmico limitado',
    ],
    bestRooms: ['Quarto infantil', 'Quarto de solteiro', 'Cozinha', 'Lavanderia', 'Casa de campo'],
    metaTitle: 'Cortina de Algodão: gramatura, lavagem e quando escolher',
    metaDescription:
      'Guia da cortina de algodão: como a gramatura afeta o bloqueio de luz, cuidados para evitar encolhimento e desbotamento e os ambientes em que ela rende mais.',
  },
  {
    name: 'Cortina de Tafetá e Seda',
    slug: 'cortina-de-tafeta-e-seda',
    category: 'Cortinas',
    lightBlocking: 'MEDIO',
    order: 6,
    image: '/images/cortinas/cortina-de-tafeta-e-seda.jpg',
    imageAlt: 'Cortina de tafetá com brilho acetinado e pregas estruturadas',
    summary:
      'Brilho acetinado e estrutura firme que forma pregas escultóricas. A escolha de projetos clássicos e formais.',
    description:
      'Tafetá e seda formam a família dos tecidos brilhantes e estruturados.\n\nA seda natural, produzida pelo bicho-da-seda, tem um brilho vivo que muda de intensidade conforme a incidência da luz e um toque frio e escorregadio inconfundível.\n\nO tafetá é um tipo de tecelagem, hoje quase sempre feita em poliéster ou em misturas com seda.\n\nProduz uma superfície firme, levemente crocante ao manuseio e capaz de sustentar pregas rígidas sem murchar.\n\nEm cortinas, ambos entregam o mesmo efeito visual: painéis que parecem esculpidos, com dobras nítidas e reflexos que dão profundidade à parede.\n\nPor isso são o material preferido em projetos clássicos, neoclássicos e formais, muitas vezes combinados com bandôs estruturados, franjas e passamanarias.\n\nDo ponto de vista funcional, o desempenho é moderado.\n\nFiltram a luz, mas não bloqueiam bem, e quase sempre pedem um forro — de blackout ou de tecido neutro — que também tem a função de proteger a fibra da radiação solar.\n\nA seda natural é notoriamente sensível: desbota rápido, mancha com água e exige lavagem profissional.\n\nO tafetá sintético resolve grande parte dessas limitações mantendo o efeito visual, e é a escolha racional para a maioria das residências brasileiras, onde a incidência solar é intensa.',
    whenToChoose:
      'Escolha tafetá ou seda em projetos clássicos e formais, como salas de jantar e living de recepção.\n\nSão os tecidos certos quando o objetivo é uma peça de destaque, com brilho e pregas escultóricas. Use sempre com forro, que protege a fibra e garante privacidade.',
    priceRange: 'R$ 250 a R$ 900 por metro linear',
    maintenance:
      'Lavagem exclusivamente a seco. Aspire com bocal macio e proteja da luz solar direta para retardar o desbotamento.',
    installation:
      'Sempre com forro. Pregas francesas triplas ou bandô estruturado são os acabamentos que fazem justiça ao tecido.',
    materials: ['Seda natural', 'Tafetá de poliéster', 'Seda com poliéster', 'Shantung'],
    advantages: [
      'Brilho acetinado com variação de tom conforme a luz',
      'Estrutura firme que sustenta pregas escultóricas',
      'Sensação imediata de sofisticação e formalidade',
      'Excelente para composições com bandô e passamanaria',
    ],
    disadvantages: [
      'Seda natural desbota e mancha com facilidade',
      'Exige forro obrigatório em quase todas as aplicações',
      'Lavagem profissional em praticamente todos os casos',
      'Custo elevado, sobretudo na seda pura',
      'Pouco adequado a ambientes úmidos ou de uso intenso',
    ],
    bestRooms: ['Sala de jantar', 'Living de recepção', 'Suíte máster', 'Hall de entrada'],
    metaTitle: 'Cortina de Tafetá e Seda: brilho, forro e cuidados',
    metaDescription:
      'Diferença entre seda natural e tafetá sintético em cortinas, por que o forro é obrigatório, como conservar o brilho e em quais projetos esses tecidos brilham.',
  },
  {
    name: 'Cortina Romana',
    slug: 'cortina-romana',
    category: 'Cortinas',
    lightBlocking: 'ALTO',
    order: 7,
    featured: true,
    image: '/images/cortinas/cortina-romana.jpg',
    imageAlt: 'Cortina romana recolhida em dobras horizontais sobre janela',
    summary:
      'Recolhe-se em dobras horizontais sobrepostas. Une o caimento têxtil das cortinas à mecânica precisa das persianas.',
    description:
      'A cortina romana funciona como um híbrido: tem a aparência e o toque de um tecido, mas se comporta como uma persiana.\n\nAo acionar o cordão, a corrente lateral ou o motor, o painel sobe formando dobras horizontais que se empilham no topo do vão, liberando a janela sem que sobre tecido nas laterais.\n\nExistem duas construções principais.\n\nA romana estruturada, com varetas horizontais costuradas em bolsos internos, forma dobras perfeitamente paralelas e mantém a geometria mesmo em tecidos leves — é o padrão em projetos de arquitetura.\n\nA romana lisa, sem varetas, produz um recolhimento mais orgânico, com pequenas ondas, e combina melhor com tecidos naturais e ambientes descontraídos.\n\nO grande atrativo é a economia de espaço.\n\nComo não há tecido acumulado nas laterais, ela cabe em vãos estreitos, sobre bancadas, em janelas de cozinha e em qualquer situação em que uma cortina tradicional atrapalharia a circulação.\n\nO bloqueio de luz depende inteiramente do tecido escolhido; com forro blackout, chega perto do escuro total. Os pontos de atenção são dois.\n\nO primeiro é a largura máxima por painel: acima de 1,80 m o mecanismo sofre e o tecido entorta, sendo melhor dividir em dois.\n\nO segundo é a limpeza, já que o painel é fixo e precisa sair do mecanismo para ser lavado.',
    whenToChoose:
      'Escolha romana quando quiser o aspecto de tecido sem ocupar as laterais do vão: janelas estreitas, cozinhas, banheiros, home offices e ambientes em que móveis encostam na parede da janela. É também a solução mais elegante para vãos altos e estreitos.',
    priceRange: 'R$ 350 a R$ 1.200 por metro quadrado',
    maintenance:
      'Aspire mensalmente com bocal macio. Para lavar, remova as varetas e o mecanismo; muitos modelos aceitam apenas limpeza a seco localizada.',
    installation:
      'Pode ser instalada dentro do vão (visual limpo) ou sobre o vão (mais bloqueio de luz). Limite prático de 1,80 m de largura por painel.',
    materials: ['Linho', 'Algodão', 'Poliéster', 'Tecido com forro blackout', 'Screen'],
    advantages: [
      'Não ocupa as laterais da janela quando aberta',
      'Aspecto têxtil com controle preciso de altura',
      'Ideal para vãos estreitos e ambientes compactos',
      'Aceita qualquer tecido, inclusive com forro blackout',
      'Disponível em versão motorizada',
    ],
    disadvantages: [
      'Largura máxima limitada por painel',
      'Limpeza mais trabalhosa que a de uma cortina tradicional',
      'Mecanismo de cordão exige atenção com crianças pequenas',
      'Custo por metro quadrado superior ao de uma cortina simples',
    ],
    bestRooms: ['Cozinha', 'Home office', 'Banheiro', 'Quarto', 'Sala de jantar'],
    metaTitle: 'Cortina Romana: tipos, medidas e quando ela é a melhor escolha',
    metaDescription:
      'Como funciona a cortina romana, diferença entre estruturada e lisa, largura máxima recomendada, opções de tecido e ambientes em que ela supera a cortina tradicional.',
  },
  {
    name: 'Cortina Wave (Onda Perfeita)',
    slug: 'cortina-wave-onda-perfeita',
    category: 'Cortinas',
    lightBlocking: 'MEDIO',
    order: 8,
    featured: true,
    image: '/images/cortinas/cortina-wave-onda-perfeita.jpg',
    imageAlt: 'Cortina wave com ondas verticais uniformes em trilho embutido',
    summary:
      'Sistema de trilho com cursores espaçados que produz ondas verticais idênticas do início ao fim do painel.',
    description:
      'A wave, também chamada de onda perfeita ou S-fold, não é um tecido: é um sistema de fixação.\n\nEm vez de pregas costuradas, o painel recebe uma fita técnica com passantes regulares que se conectam a cursores espaçados por uma corrente interna do trilho.\n\nO resultado é uma sucessão de ondas verticais de amplitude idêntica, uniformes tanto com a cortina aberta quanto fechada.\n\nÉ algo que pregas tradicionais nunca entregam com a mesma regularidade.\n\nÉ o padrão contemporâneo em arquitetura de interiores, especialmente em projetos com trilho embutido em sanca de gesso, onde a cortina parece brotar do teto.\n\nA amplitude da onda é definida pelo espaçamento dos cursores, normalmente entre 60 e 100 mm, e determina a metragem de tecido necessária: quanto maior a onda, mais volume e mais material.\n\nFunciona com praticamente qualquer tecido de caimento fluido: voil, linho, poliéster leve ou blackout de trama tripla.\n\nÉ também a base preferida para automação, já que a distribuição uniforme do peso favorece o motor.\n\nAs limitações são estruturais: exige trilho específico do sistema, tem custo superior ao trilho comum e não admite improviso na instalação.\n\nUm trilho fora de nível ou mal dimensionado destrói exatamente aquilo que justifica a escolha — a regularidade das ondas.',
    whenToChoose:
      'Escolha wave em projetos contemporâneos, quando houver sanca ou possibilidade de embutir o trilho, e sempre que a cortina for motorizada.\n\nÉ a melhor opção para vãos largos e contínuos em que a uniformidade visual é o principal objetivo.',
    priceRange: 'R$ 250 a R$ 800 por metro linear, incluindo o trilho do sistema',
    maintenance:
      'A manutenção segue a do tecido escolhido. Lubrifique os cursores anualmente com silicone em spray para preservar o deslizamento.',
    installation:
      'Exige trilho wave específico, perfeitamente nivelado. Ideal em sanca com 12 a 15 cm de profundidade livre.',
    materials: ['Voil', 'Linho', 'Poliéster', 'Blackout de trama tripla'],
    advantages: [
      'Ondas perfeitamente uniformes, abertas ou fechadas',
      'Visual contemporâneo e limpo, sem pregas costuradas',
      'Base ideal para cortinas motorizadas',
      'Excelente em vãos largos e contínuos',
      'Ocupa pouco espaço quando totalmente recolhida',
    ],
    disadvantages: [
      'Depende de trilho específico e mais caro',
      'Instalação precisa ser rigorosamente nivelada',
      'Consome mais tecido que uma cortina franzida simples',
      'Não combina com estilos clássicos e formais',
    ],
    bestRooms: ['Sala de estar', 'Quarto de casal', 'Ambientes integrados', 'Varanda gourmet', 'Escritório'],
    metaTitle: 'Cortina Wave: como funciona a onda perfeita e quando usar',
    metaDescription:
      'Entenda o sistema wave de trilho e cursores, quanto tecido ele consome, por que é o padrão em projetos contemporâneos e o que exige da instalação.',
  },
  {
    name: 'Cortina com Ilhós',
    slug: 'cortina-com-ilhos',
    category: 'Cortinas',
    lightBlocking: 'MEDIO',
    order: 9,
    image: '/images/cortinas/cortina-com-ilhos.jpg',
    imageAlt: 'Cortina com ilhós metálicos deslizando sobre varão de madeira',
    summary:
      'Argolas metálicas embutidas no tecido deslizam direto no varão. Simples de instalar, fácil de lavar e de custo baixo.',
    description:
      'O ilhós é o acabamento mais popular do varejo brasileiro, e por bons motivos.\n\nArgolas metálicas ou plásticas são fixadas diretamente no cabeçote do painel, e a cortina desliza pelo varão sem necessidade de ganchos, cursores ou fita franzidora.\n\nIsso simplifica tudo. A instalação é feita por qualquer pessoa em minutos, a peça sai e volta do varão para lavagem com facilidade e o custo total do conjunto cai bastante em relação a sistemas com trilho.\n\nEsteticamente, o ilhós produz ondas largas e regulares, com um ar informal e contemporâneo.\n\nO diâmetro interno da argola precisa ser cerca de 1 cm maior que o do varão para deslizar sem travar, e o espaçamento entre ilhós — em geral de 16 a 18 cm — define a profundidade das ondas.\n\nHá duas limitações relevantes. A primeira é que o ilhós funciona apenas com varão aparente: não existe versão para trilho embutido em sanca, o que o exclui de projetos que buscam a cortina "saindo do teto".\n\nA segunda é a fresta superior. Como o tecido nasce abaixo do varão e as ondas se abrem no topo, sempre passa luz pela parte de cima.\n\nPor isso o ilhós, mesmo em tecido blackout, nunca entrega escuridão total sem um bandô complementar.',
    whenToChoose:
      'Escolha ilhós quando quiser praticidade, custo baixo e facilidade de lavagem — quartos de solteiro, quartos infantis, apartamentos alugados e ambientes em que a cortina será trocada com frequência. Evite se o objetivo for escuridão total.',
    priceRange: 'R$ 90 a R$ 300 por metro linear',
    maintenance:
      'Retire do varão, lave conforme o tecido e recoloque ainda úmida para desamassar. Seque bem a região dos ilhós metálicos para evitar oxidação.',
    installation:
      'Varão com diâmetro pelo menos 1 cm menor que o furo do ilhós. Considere 2 a 2,5 vezes a largura do vão em tecido.',
    materials: ['Poliéster', 'Algodão', 'Blackout', 'Voil'],
    advantages: [
      'Instalação e remoção extremamente simples',
      'Lavagem facilitada — sai e volta do varão em segundos',
      'Custo total do conjunto mais baixo',
      'Ondas largas e regulares sem fita franjadora',
      'Ampla disponibilidade em lojas de varejo',
    ],
    disadvantages: [
      'Sempre deixa passar luz pela parte superior',
      'Incompatível com trilho embutido em sanca',
      'Argolas podem riscar varões pintados ou de madeira',
      'Visual informal, pouco adequado a projetos clássicos',
      'Ilhós metálicos de baixa qualidade podem oxidar',
    ],
    bestRooms: ['Quarto de solteiro', 'Quarto infantil', 'Sala de TV', 'Apartamento alugado'],
    metaTitle: 'Cortina com Ilhós: vantagens, limitações e como medir',
    metaDescription:
      'Como funciona a cortina com ilhós, qual diâmetro de varão usar, quanto tecido comprar, por que ela deixa passar luz no topo e quando ela é a melhor escolha.',
  },
  {
    name: 'Cortina de Pregas Francesas',
    slug: 'cortina-de-pregas-francesas',
    category: 'Cortinas',
    lightBlocking: 'MEDIO',
    order: 10,
    image: '/images/cortinas/cortina-de-pregas-francesas.jpg',
    imageAlt: 'Cortina com pregas francesas triplas costuradas no cabeçote',
    summary:
      'Pregas triplas costuradas à mão no cabeçote. O acabamento clássico por excelência, com caimento formal e duradouro.',
    description:
      'A prega francesa, também chamada de prega tripla ou pinch pleat, é o acabamento tradicional das cortinas sob medida.\n\nNo cabeçote do painel, o tecido é dobrado em três dobras que se unem por uma costura na base, formando um leque que se abre para cima.\n\nO resultado é um caimento estruturado, com pregas verticais fundas e regulares que descem até a barra e mantêm a forma independentemente de a cortina estar aberta ou fechada.\n\nÉ o acabamento que define o vocabulário clássico da decoração de janelas, presente em projetos formais, hotelaria de luxo e ambientes de estilo tradicional.\n\nA costura é feita individualmente, o que exige mão de obra qualificada e explica o custo mais alto: cada prega é montada, medida e fixada manualmente.\n\nA metragem recomendada gira em torno de 2,5 a 3 vezes a largura do vão. O tecido também precisa ter corpo para sustentar a estrutura.\n\nVoil muito leve tende a murchar; linho encorpado, veludo, tafetá e algodão pesado se comportam muito bem.\n\nVariações do mesmo princípio incluem a prega dupla, mais discreta e econômica, e a prega invertida, ou box pleat.\n\nNesta última, a dobra fica voltada para trás e o painel ganha uma superfície frontal lisa, de ar contemporâneo.',
    whenToChoose:
      'Escolha pregas francesas em projetos clássicos ou formais, quando o objetivo for um caimento estruturado e duradouro.\n\nÉ o acabamento que valoriza linho pesado, veludo e tafetá, em salas de estar formais, salas de jantar e suítes máster.',
    priceRange: 'R$ 200 a R$ 600 por metro linear, com mão de obra de costura',
    maintenance:
      'Aspire as pregas com bocal macio. Na lavagem, remova os ganchos e siga a orientação do tecido; passe pelo avesso preservando o vinco das dobras.',
    installation:
      'Ganchos encaixados em trilho ou argolas de varão. Exige de 2,5 a 3 vezes a largura do vão em tecido.',
    materials: ['Linho', 'Veludo', 'Tafetá', 'Algodão pesado', 'Blackout de trama tripla'],
    advantages: [
      'Caimento estruturado e pregas que não se desfazem',
      'Acabamento clássico compatível com decoração formal',
      'Valoriza tecidos encorpados e de alta gramatura',
      'Compatível com trilho comum e com varão',
      'Durabilidade alta quando bem costurada',
    ],
    disadvantages: [
      'Mão de obra especializada eleva o custo',
      'Consome bastante tecido',
      'Ocupa espaço lateral considerável quando aberta',
      'Não funciona bem com tecidos muito leves',
      'Estética formal demais para ambientes minimalistas',
    ],
    bestRooms: ['Sala de estar formal', 'Sala de jantar', 'Suíte máster', 'Biblioteca'],
    metaTitle: 'Cortina de Pregas Francesas: como é feita e quando escolher',
    metaDescription:
      'Tudo sobre a prega francesa tripla: como é costurada, quanto tecido consome, quais tecidos combinam e por que ela continua sendo o acabamento clássico definitivo.',
  },
  {
    name: 'Cortina Café (Meia-Cortina)',
    slug: 'cortina-cafe-meia-cortina',
    category: 'Cortinas',
    lightBlocking: 'BAIXO',
    order: 11,
    image: '/images/cortinas/cortina-cafe-meia-cortina.jpg',
    imageAlt: 'Meia-cortina café cobrindo apenas a parte inferior da janela',
    summary:
      'Cobre apenas a metade inferior da janela, garantindo privacidade sem sacrificar a entrada de luz pela parte de cima.',
    description:
      'A cortina café resolve um problema muito específico e comum: garantir privacidade na altura dos olhos de quem passa pela rua sem escurecer o ambiente.\n\nEla cobre apenas a porção inferior do vão — normalmente da metade para baixo — e deixa a parte superior completamente livre, o que preserva a entrada de luz natural e a ventilação.\n\nO nome vem dos cafés e bistrôs europeus, onde esse arranjo permitia que os clientes comessem sem serem observados da calçada enquanto o salão continuava iluminado.\n\nEm residências, funciona muito bem em cozinhas voltadas para corredores, banheiros de fachada, lavabos, janelas de térreo e áreas de serviço.\n\nA instalação é feita com um varão fino fixado no meio do vão ou diretamente no caixilho, e o painel pode ser franzido, plano ou com babado.\n\nTecidos leves e laváveis — voil, algodão fino, renda, linho leve — são os mais indicados, tanto pela estética informal quanto pela facilidade de higienização em ambientes sujeitos a gordura e umidade.\n\nÉ frequentemente combinada com um bandô ou uma guarnição superior estreita, criando uma moldura completa sem fechar a janela.\n\nO custo é baixo, já que consome pouco tecido, e a instalação dispensa profissional na maioria dos casos.',
    whenToChoose:
      'Escolha a cortina café quando precisar bloquear a visão na altura dos olhos mantendo a claridade.\n\nResolve bem cozinhas voltadas para corredores, banheiros e lavabos de fachada, janelas de térreo e áreas de serviço. É também um recurso estético charmoso em casas de campo e cozinhas rústicas.',
    priceRange: 'R$ 40 a R$ 150 por metro linear',
    maintenance:
      'Lave em máquina no ciclo delicado sempre que necessário — em cozinhas, recomenda-se limpeza mensal por causa da gordura em suspensão.',
    installation:
      'Varão fino fixado no meio do vão ou diretamente no caixilho, com suportes de pressão que dispensam furos.',
    materials: ['Voil', 'Algodão fino', 'Renda', 'Linho leve'],
    advantages: [
      'Privacidade na altura dos olhos sem escurecer o ambiente',
      'Consome pouco tecido — custo muito baixo',
      'Instalação simples, muitas vezes sem furar a parede',
      'Fácil de lavar com frequência',
      'Charme informal em cozinhas e áreas rústicas',
    ],
    disadvantages: [
      'Não oferece qualquer bloqueio de luz relevante',
      'Deixa a parte superior da janela exposta',
      'Estética informal, inadequada a ambientes sociais formais',
      'Não serve para quartos',
    ],
    bestRooms: ['Cozinha', 'Lavabo', 'Área de serviço', 'Banheiro social', 'Copa'],
    metaTitle: 'Cortina Café: privacidade sem perder a luz natural',
    metaDescription:
      'O que é a meia-cortina café, como instalar sem furar a parede, quais tecidos usar e em quais ambientes ela resolve privacidade mantendo a claridade.',
  },
  // =========================================================================
  // PERSIANAS
  // =========================================================================
  {
    name: 'Persiana Rolô',
    slug: 'persiana-rolo',
    category: 'Persianas',
    lightBlocking: 'ALTO',
    order: 12,
    featured: true,
    image: '/images/cortinas/persiana-rolo.jpg',
    imageAlt: 'Persiana rolô lisa enrolada parcialmente sobre janela moderna',
    summary:
      'Painel único que se enrola em um tubo superior. É a persiana mais vendida do Brasil pelo equilíbrio entre preço, praticidade e variedade.',
    description:
      'A persiana rolô é o modelo mais vendido no Brasil, e sua mecânica explica boa parte disso.\n\nUm painel único de tecido se enrola em um tubo de alumínio instalado no topo do vão, acionado por corrente lateral, mola ou motor.\n\nNão há lâminas, cordões cruzados nem dobras — apenas uma superfície lisa e contínua que sobe e desce.\n\nEssa simplicidade se traduz em três vantagens práticas.\n\nOcupa muito pouco espaço quando recolhida, tem o menor custo de manutenção entre todos os sistemas mecanizados e aceita uma variedade enorme de tecidos, do translúcido ao blackout absoluto.\n\nO acabamento superior pode ser aparente, com o tubo à mostra, ou fechado por um bandô de alumínio que esconde o mecanismo e melhora o bloqueio de luz.\n\nO sistema de acionamento merece atenção: a corrente metálica é mais durável que a plástica, e modelos com trava de segurança infantil são obrigatórios em ambientes com crianças.\n\nO ponto fraco estrutural é a fresta lateral. Como o painel é sempre um pouco mais estreito que o vão em instalações internas, entra luz pelas bordas.\n\nO problema se resolve instalando por fora do vão, com transbordo, ou com um sistema de trilhos laterais (zip).\n\nLarguras acima de 2,50 m exigem tubo reforçado para evitar que o painel entorte.',
    whenToChoose:
      'Escolha a persiana rolô quando precisar de uma solução prática, econômica e de baixa manutenção que funcione em praticamente qualquer ambiente.\n\nÉ a escolha padrão para escritórios, quartos, salas e cozinhas — e a mais versátil quando se leva em conta a variedade de tecidos disponíveis.',
    priceRange: 'R$ 180 a R$ 700 por metro quadrado',
    maintenance:
      'Limpe com pano levemente úmido e sabão neutro, sempre com o painel totalmente aberto. Nunca dobre o tecido: rolô marca com facilidade.',
    installation:
      'Pode ser instalada dentro do vão, na parede ou no teto. Instalação externa com transbordo de 10 cm reduz a fresta lateral de luz.',
    materials: ['Poliéster', 'Tecido blackout', 'Screen', 'Poliéster com PVC'],
    advantages: [
      'Ocupa pouquíssimo espaço quando recolhida',
      'Melhor relação custo-benefício entre as persianas',
      'Aceita tecidos de todos os níveis de bloqueio',
      'Limpeza simples, sem lâminas para higienizar',
      'Disponível em versão motorizada com boa autonomia',
    ],
    disadvantages: [
      'Frestas laterais em instalações dentro do vão',
      'Controle de luz apenas por altura, sem regulagem de inclinação',
      'Painel pode entortar em larguras acima de 2,50 m',
      'Vinco no tecido é praticamente irreversível',
    ],
    bestRooms: ['Escritório', 'Quarto', 'Sala de estar', 'Cozinha', 'Consultório'],
    metaTitle: 'Persiana Rolô: tipos de tecido, medidas e instalação',
    metaDescription:
      'Guia completo da persiana rolô: como funciona o mecanismo, quais tecidos escolher, como evitar frestas de luz e por que é o modelo mais vendido do Brasil.',
  },
  {
    name: 'Persiana Screen Solar',
    slug: 'persiana-screen-solar',
    category: 'Persianas',
    lightBlocking: 'MEDIO',
    order: 13,
    featured: true,
    image: '/images/cortinas/persiana-screen-solar.jpg',
    imageAlt: 'Persiana screen solar com trama técnica preservando a vista externa',
    summary:
      'Tela técnica de trama microperfurada que bloqueia calor e raios UV mantendo a visão para fora. Padrão em escritórios e varandas.',
    description:
      'A screen solar é uma tela técnica, normalmente de fibra de vidro revestida em PVC ou de poliéster revestido, tecida com microfuros regulares.\n\nEsses furos são medidos pelo chamado fator de abertura, que vai de 1% a 10% e define quanto da superfície é vazada.\n\nUma screen 5% deixa passar 5% da luz direta e permite enxergar o exterior com nitidez razoável; uma screen 1% é quase opaca e prioriza o controle solar.\n\nO diferencial dessa família é rejeitar calor e radiação ultravioleta sem eliminar a vista. Modelos de qualidade bloqueiam de 90% a 99% dos raios UV.\n\nIsso a torna a escolha natural para varandas com paisagem e escritórios com fachada envidraçada.\n\nÉ o material certo onde perder a visão externa seria um desperdício. O comportamento inverte à noite.\n\nCom a luz interna acesa, a screen deixa o ambiente visível de fora, portanto ela nunca deve ser a única solução em quartos ou em janelas de térreo voltadas para a rua.\n\nA cor influencia diretamente o desempenho: tons claros refletem mais calor mas geram ofuscamento; tons escuros absorvem mais calor porém oferecem visão externa muito mais nítida e contrastada.\n\nO material é dimensionalmente estável, não amassa, não desbota com facilidade e limpa com pano úmido.',
    whenToChoose:
      'Escolha screen quando a vista externa for um patrimônio do imóvel e o problema for calor e ofuscamento — varandas, salas com fachada envidraçada, escritórios e consultórios.\n\nCombine com blackout em quartos, onde ela sozinha não resolve a privacidade noturna.',
    priceRange: 'R$ 280 a R$ 900 por metro quadrado',
    maintenance:
      'Limpe com pano úmido e sabão neutro. Material não absorve gordura nem umidade, o que a torna adequada a cozinhas e áreas externas cobertas.',
    installation:
      'Ideal em sistema rolô ou com trilhos laterais. Em fachadas de vidro, prefira fator de abertura de 3% a 5% para equilibrar vista e conforto térmico.',
    materials: ['Fibra de vidro com PVC', 'Poliéster com PVC', 'Screen acústica'],
    advantages: [
      'Bloqueia de 90% a 99% dos raios UV',
      'Reduz significativamente o calor sem eliminar a vista',
      'Não amassa, não desbota e não retém umidade',
      'Elimina o ofuscamento em telas de computador',
      'Limpeza simples com pano úmido',
    ],
    disadvantages: [
      'Não oferece privacidade à noite com luz interna acesa',
      'Bloqueio de luz insuficiente para quartos',
      'Cores claras podem gerar ofuscamento residual',
      'Custo superior ao de um rolô de tecido comum',
    ],
    bestRooms: ['Varanda gourmet', 'Escritório', 'Sala com fachada envidraçada', 'Consultório', 'Sala de reunião'],
    metaTitle: 'Persiana Screen Solar: fator de abertura, calor e vista externa',
    metaDescription:
      'Como escolher o fator de abertura da persiana screen, quanto de UV e calor ela bloqueia, por que não serve sozinha em quartos e onde ela realmente rende.',
  },
  {
    name: 'Persiana Double Vision',
    slug: 'persiana-double-vision',
    category: 'Persianas',
    lightBlocking: 'ALTO',
    order: 14,
    featured: true,
    image: '/images/cortinas/persiana-double-vision.jpg',
    imageAlt: 'Persiana double vision com faixas alternadas translúcidas e opacas',
    summary:
      'Faixas horizontais alternadas, translúcidas e opacas, que se sobrepõem para regular a luz de forma contínua.',
    description:
      'A double vision, também conhecida como rolô duplo, zebra ou twin, é composta por um único painel de tecido.\n\nEle é dividido em faixas horizontais que alternam trama aberta e trama fechada, montadas em sistema de dupla camada.\n\nAo acionar a corrente, uma camada desliza sobre a outra. Quando as faixas opacas se alinham, o ambiente fica protegido e a visão externa é bloqueada.\n\nQuando as translúcidas coincidem, abrem-se "janelas" horizontais que deixam entrar luz e permitem enxergar para fora.\n\nEsse ajuste contínuo entrega algo que um rolô comum não consegue: variação fina de luminosidade sem precisar levantar o painel inteiro.\n\nVisualmente, é um dos modelos mais contemporâneos disponíveis, com um grafismo listrado que funciona bem em ambientes de estilo moderno.\n\nExistem versões com faixas em blackout, que aumentam bastante o bloqueio quando alinhadas, embora nenhuma double vision alcance escuridão total — sempre há passagem de luz nas junções e nas laterais.\n\nOs pontos de atenção são mecânicos: por ter duas camadas de tecido enroladas no mesmo tubo, o cilindro recolhido fica mais volumoso, e o alinhamento das faixas precisa ser preciso.\n\nInstalações fora de esquadro ou tubos subdimensionados provocam desalinhamento progressivo, o defeito mais comum nesse tipo de persiana.',
    whenToChoose:
      'Escolha double vision quando quiser regular a luminosidade ao longo do dia sem abrir mão do visual contemporâneo.\n\nFunciona bem em salas de estar, home offices, quartos de adolescente e ambientes com sol em horários variados. Não é a escolha certa para quem precisa de escuridão total.',
    priceRange: 'R$ 320 a R$ 950 por metro quadrado',
    maintenance:
      'Aspire com bocal macio e limpe manchas pontuais com pano úmido. Evite esfregar as faixas translúcidas, que podem desfiar.',
    installation:
      'Exige vão em esquadro e tubo dimensionado para a dupla camada. Instalação externa com transbordo melhora bastante o bloqueio.',
    materials: ['Poliéster', 'Poliéster com faixa blackout', 'Screen com faixa opaca'],
    advantages: [
      'Regulagem contínua e precisa da luminosidade',
      'Permite alternar entre vista externa e privacidade sem levantar o painel',
      'Visual contemporâneo com grafismo horizontal',
      'Disponível com faixas blackout para maior bloqueio',
      'Mecanismo simples e de manutenção acessível',
    ],
    disadvantages: [
      'Nunca alcança escuridão total',
      'Cilindro recolhido mais volumoso que o de um rolô simples',
      'Desalinhamento das faixas é o defeito mais frequente',
      'Custo superior ao do rolô convencional',
    ],
    bestRooms: ['Sala de estar', 'Home office', 'Quarto de adolescente', 'Sala de jantar', 'Escritório'],
    metaTitle: 'Persiana Double Vision: como funciona a regulagem de faixas',
    metaDescription:
      'Entenda o mecanismo da persiana double vision (rolô duplo/zebra), quanto de luz ela bloqueia, por que as faixas desalinham e em quais ambientes ela é ideal.',
  },
  {
    name: 'Persiana Horizontal de Alumínio',
    slug: 'persiana-horizontal-de-aluminio',
    category: 'Persianas',
    lightBlocking: 'ALTO',
    order: 15,
    image: '/images/cortinas/persiana-horizontal-de-aluminio.jpg',
    imageAlt: 'Persiana horizontal de alumínio com lâminas inclinadas',
    summary:
      'Lâminas metálicas com inclinação regulável. Extremamente durável, resistente à umidade e com o melhor custo por metro quadrado.',
    description:
      'A persiana horizontal de alumínio é a solução funcional clássica de escritórios, cozinhas e áreas úmidas.\n\nLâminas metálicas — normalmente de 16, 25 ou 50 mm — são sustentadas por escadas de cordão e giram simultaneamente pelo acionamento de uma vareta, permitindo direcionar a luz com precisão.\n\nTotalmente abertas deixam o ambiente claro, inclinadas a 45° criam privacidade mantendo ventilação, e completamente fechadas bloqueiam a maior parte da claridade.\n\nNenhum outro sistema oferece esse grau de controle direcional.\n\nO alumínio é imune à umidade, não empena, não mofa e resiste a variações bruscas de temperatura, o que a torna praticamente insubstituível em cozinhas, banheiros, áreas de serviço e lavanderias.\n\nA durabilidade é alta e o custo por metro quadrado, um dos mais baixos do mercado. As desvantagens são reais e devem ser consideradas.\n\nAs lâminas amassam com impacto e, uma vez tortas, não voltam à forma original. A limpeza é trabalhosa: cada lâmina precisa ser higienizada individualmente, e em cozinhas o acúmulo de gordura exige atenção frequente.\n\nHá ainda o ruído característico quando há vento ou quando a janela é aberta com a persiana fechada.\n\nLâminas de 25 mm são o melhor equilíbrio entre controle de luz, resistência e facilidade de limpeza.',
    whenToChoose:
      'Escolha alumínio quando durabilidade, resistência à umidade e controle direcional da luz pesarem mais que a estética.\n\nÉ o padrão em cozinhas, banheiros, áreas de serviço, escritórios comerciais e imóveis alugados. É também a opção mais econômica por metro quadrado.',
    priceRange: 'R$ 120 a R$ 400 por metro quadrado',
    maintenance:
      'Limpe lâmina por lâmina com pano de microfibra ou luva específica. Em cozinhas, use desengordurante neutro a cada dois meses.',
    installation:
      'Instalação dentro do vão, na parede ou direto no caixilho de alumínio com suportes de pressão, sem furos.',
    materials: ['Alumínio 16 mm', 'Alumínio 25 mm', 'Alumínio 50 mm'],
    advantages: [
      'Controle direcional preciso da luz pela inclinação das lâminas',
      'Totalmente resistente a umidade e variações de temperatura',
      'Custo por metro quadrado entre os mais baixos do mercado',
      'Vida útil longa, com peças de reposição fáceis de encontrar',
      'Permite ventilação com privacidade simultaneamente',
    ],
    disadvantages: [
      'Lâminas amassam com impacto e não voltam à forma',
      'Limpeza trabalhosa, lâmina por lâmina',
      'Faz ruído com vento',
      'Estética funcional, pouco acolhedora em ambientes sociais',
      'Cordões exigem cuidado com crianças pequenas',
    ],
    bestRooms: ['Cozinha', 'Banheiro', 'Área de serviço', 'Escritório comercial', 'Garagem'],
    metaTitle: 'Persiana Horizontal de Alumínio: lâminas, limpeza e durabilidade',
    metaDescription:
      'Qual largura de lâmina escolher, como limpar sem amassar, por que o alumínio domina áreas úmidas e quais são as reais limitações desse tipo de persiana.',
  },
  {
    name: 'Persiana Vertical',
    slug: 'persiana-vertical',
    category: 'Persianas',
    lightBlocking: 'ALTO',
    order: 16,
    image: '/images/cortinas/persiana-vertical.jpg',
    imageAlt: 'Persiana vertical com lâminas de tecido giratórias em porta de vidro',
    summary:
      'Lâminas verticais que giram e deslizam lateralmente. A melhor resposta para portas de correr e vãos muito largos.',
    description:
      'Na persiana vertical, as lâminas ficam suspensas por cursores em um trilho superior.\n\nElas podem girar em torno do próprio eixo e deslizar lateralmente, agrupando-se em uma das extremidades ou nas duas.\n\nEssa dupla mobilidade a torna a solução mais eficiente para vãos muito largos e, sobretudo, para portas de correr e portas-balcão.\n\nComo as lâminas se recolhem lateralmente, a passagem fica livre sem que seja preciso levantar nada.\n\nEm vãos de 3, 4 ou 5 metros — comuns em varandas integradas — ela mantém custo e mecânica sob controle, enquanto sistemas horizontais ficariam pesados e sujeitos a deformação.\n\nAs lâminas medem em geral 89 ou 127 mm de largura e podem ser de tecido, de PVC ou de screen.\n\nAs de tecido oferecem melhor acabamento e absorvem um pouco de som. As de PVC resistem melhor à umidade e à limpeza pesada.\n\nAs de screen combinam a mecânica vertical com controle solar e vista externa. Um detalhe importante.\n\nA corrente inferior que une as lâminas evita balanço com vento, mas em ambientes com muita ventilação vale considerar lâminas com peso individual e sem corrente, que balançam menos e não emaranham.\n\nA estética é o principal ponto de crítica — associada a ambientes corporativos, ela exige escolha cuidadosa de cor e material para funcionar bem em residências.',
    whenToChoose:
      'Escolha vertical em portas de correr, portas-balcão e vãos acima de 3 metros, onde nenhum outro sistema é tão prático.\n\nTambém é a melhor escolha quando o vão precisa ser liberado com frequência para circulação.',
    priceRange: 'R$ 150 a R$ 500 por metro quadrado',
    maintenance:
      'Lâminas de tecido podem ser removidas e lavadas individualmente à mão. As de PVC limpam com pano úmido e sabão neutro.',
    installation:
      'Trilho fixado no teto ou na parede acima do vão, com transbordo de 10 a 15 cm de cada lado para liberar totalmente a passagem.',
    materials: ['Tecido', 'PVC', 'Screen'],
    advantages: [
      'Solução mais eficiente para vãos largos e portas de correr',
      'Lâminas giram e deslizam, liberando totalmente a passagem',
      'Custo por metro quadrado competitivo em grandes áreas',
      'Lâminas individuais podem ser substituídas isoladamente',
      'Disponível em tecido, PVC e screen',
    ],
    disadvantages: [
      'Estética associada a ambientes corporativos',
      'Lâminas balançam e fazem ruído com vento',
      'A corrente inferior pode emaranhar com o uso',
      'Cursores plásticos de baixa qualidade quebram com o tempo',
    ],
    bestRooms: ['Porta-balcão', 'Varanda', 'Sala com porta de correr', 'Escritório', 'Loja'],
    metaTitle: 'Persiana Vertical: quando ela é a melhor opção para portas',
    metaDescription:
      'Como funcionam as lâminas verticais, qual largura escolher, diferença entre tecido, PVC e screen e por que ela domina portas de correr e vãos largos.',
  },
  {
    name: 'Persiana de Madeira',
    slug: 'persiana-de-madeira',
    category: 'Persianas',
    lightBlocking: 'ALTO',
    order: 17,
    featured: true,
    image: '/images/cortinas/persiana-de-madeira.jpg',
    imageAlt: 'Persiana de madeira com lâminas largas em ambiente aconchegante',
    summary:
      'Lâminas de madeira maciça com aparência quente e nobre. Alto controle de luz e presença decorativa, mas sensível à umidade.',
    description:
      'A persiana de madeira aplica a mesma mecânica da horizontal de alumínio a lâminas de madeira maciça — normalmente basswood, cedro ou bambu laminado — com larguras de 25, 50 ou 63 mm.\n\nA diferença é sensorial e decorativa: a madeira traz cor quente, veio natural e uma densidade visual que transforma a janela em elemento arquitetônico.\n\nLâminas largas, de 50 mm ou mais, criam um efeito próximo ao das shutters americanas, com sombras marcadas e ar de permanência.\n\nO controle de luz é excelente: fechadas, as lâminas se sobrepõem e bloqueiam boa parte da claridade; inclinadas, direcionam a luz para o teto e iluminam o ambiente de forma indireta.\n\nA madeira também isola termicamente melhor que o alumínio. A grande limitação é a umidade.\n\nA madeira maciça empena, mancha e descola o verniz em contato prolongado com vapor e água, o que a desaconselha em banheiros, cozinhas com fogão próximo à janela e áreas de serviço.\n\nPara esses ambientes existem as versões em PVC com textura amadeirada, chamadas de faux wood ou madeira sintética.\n\nElas reproduzem a aparência com resistência total à água, mas são mais pesadas e têm veio menos convincente.\n\nO peso é outro fator: em vãos largos, o conjunto exige suportes reforçados e pode ficar difícil de operar manualmente.',
    whenToChoose:
      'Escolha madeira quando quiser aquecer visualmente o ambiente e ter controle direcional preciso da luz — salas de estar, quartos, escritórios e bibliotecas.\n\nEm áreas úmidas, opte pela versão em PVC amadeirado, que mantém a estética sem risco de empeno.',
    priceRange: 'R$ 450 a R$ 1.400 por metro quadrado',
    maintenance:
      'Limpe com pano seco ou levemente úmido e produto específico para madeira. Nunca use água em excesso e reaplique o verniz a cada 3 a 5 anos.',
    installation:
      'Exige suportes reforçados por causa do peso. Prefira instalação dentro do vão para valorizar a moldura da janela.',
    materials: ['Basswood', 'Cedro', 'Bambu laminado', 'PVC amadeirado (faux wood)'],
    advantages: [
      'Aparência quente e nobre que valoriza o ambiente',
      'Controle direcional preciso da luz',
      'Isolamento térmico superior ao do alumínio',
      'Lâminas largas criam efeito arquitetônico marcante',
      'Alta durabilidade quando protegida da umidade',
    ],
    disadvantages: [
      'Empena e mancha em ambientes úmidos',
      'Peso elevado exige suportes reforçados',
      'Custo entre os mais altos do mercado',
      'Verniz precisa de manutenção periódica',
      'Limpeza lâmina por lâmina',
    ],
    bestRooms: ['Sala de estar', 'Quarto de casal', 'Escritório', 'Biblioteca', 'Sala de jantar'],
    metaTitle: 'Persiana de Madeira: tipos de lâmina, umidade e manutenção',
    metaDescription:
      'Basswood, bambu ou PVC amadeirado? Descubra qual persiana de madeira escolher, como evitar empeno em áreas úmidas e quanto de luz cada largura de lâmina bloqueia.',
  },
  {
    name: 'Persiana Celular (Colmeia)',
    slug: 'persiana-celular-colmeia',
    category: 'Persianas',
    lightBlocking: 'ALTO',
    order: 18,
    image: '/images/cortinas/persiana-celular-colmeia.jpg',
    imageAlt: 'Persiana celular com estrutura de favos hexagonais em corte',
    summary:
      'Estrutura em favos que aprisiona ar entre camadas. É a persiana com melhor desempenho térmico do mercado.',
    description:
      'A persiana celular, também chamada de colmeia ou duette, tem uma construção única: o tecido é dobrado formando células hexagonais que, vistas de perfil, lembram um favo de mel.\n\nDentro de cada célula fica uma camada de ar parado, e é justamente esse ar que faz o trabalho.\n\nComo no vidro duplo de uma janela, a barreira de ar reduz drasticamente a troca térmica entre interior e exterior.\n\nEm números, uma celular de célula dupla reduz a perda de calor pela janela em até 40% no inverno, e o ganho em proporção semelhante no verão.\n\nÉ um desempenho que nenhum outro tipo de cortina alcança. O mesmo princípio ajuda na acústica, atenuando ruídos de média frequência.\n\nEsteticamente, é discreta e leve: recolhida ocupa muito pouco espaço, e a superfície plissada tem um aspecto contemporâneo e limpo.\n\nExistem versões translúcidas, semiopacas e blackout, além do sistema top-down/bottom-up.\n\nEle permite abrir a persiana pela parte de cima e manter a inferior fechada. É um recurso valioso em janelas de térreo, onde se quer luz sem expor o interior.\n\nAs limitações são o custo, que fica acima da média, e a limpeza: as células acumulam poeira internamente e não podem ser lavadas, apenas aspiradas com bocal macio ou sopradas com ar comprimido.',
    whenToChoose:
      'Escolha celular quando conforto térmico for prioridade. É a resposta certa em quartos com sol da tarde e em ambientes com ar-condicionado ligado por muitas horas.\n\nTambém compensa em regiões de inverno rigoroso e onde reduzir a conta de energia é objetivo concreto.',
    priceRange: 'R$ 550 a R$ 1.600 por metro quadrado',
    maintenance:
      'Aspire com bocal macio ou use ar comprimido nas células. Não lave nem mergulhe em água: o tecido plissado perde a estrutura.',
    installation:
      'Instalação dentro do vão maximiza o desempenho térmico ao reduzir a circulação de ar nas bordas. Sistema top-down/bottom-up requer trilho duplo.',
    materials: ['Poliéster plissado', 'Célula simples', 'Célula dupla', 'Tecido blackout celular'],
    advantages: [
      'Melhor isolamento térmico entre todos os tipos de cortina',
      'Reduz o consumo de ar-condicionado e aquecimento',
      'Atenua ruídos de média frequência',
      'Ocupa espaço mínimo quando recolhida',
      'Sistema top-down/bottom-up para luz com privacidade',
    ],
    disadvantages: [
      'Custo acima da média do mercado',
      'Não pode ser lavada — apenas aspirada',
      'Poeira acumula dentro das células',
      'Tecido plissado pode perder a forma com manuseio incorreto',
    ],
    bestRooms: ['Quarto', 'Sala com ar-condicionado', 'Home office', 'Quarto de bebê', 'Sala de estar'],
    metaTitle: 'Persiana Celular (Colmeia): isolamento térmico e economia de energia',
    metaDescription:
      'Como as células de ar da persiana colmeia reduzem até 40% da troca térmica, diferença entre célula simples e dupla e por que ela não pode ser lavada.',
  },
  {
    name: 'Persiana de Bambu e Palha',
    slug: 'persiana-de-bambu-e-palha',
    category: 'Persianas',
    lightBlocking: 'MEDIO',
    order: 19,
    image: '/images/cortinas/persiana-de-bambu-e-palha.jpg',
    imageAlt: 'Persiana de bambu natural com trama rústica e luz filtrada',
    summary:
      'Fibras naturais trançadas que filtram a luz criando sombras texturizadas. Ideal para ambientes de estilo natural e tropical.',
    description:
      'As persianas de bambu, palha, junco e ratã são feitas de fibras naturais trançadas com fio de algodão ou náilon, formando um painel que sobe em rolo ou em dobras romanas.\n\nO que as distingue não é o desempenho técnico, mas o efeito da luz. Os vãos irregulares entre as fibras produzem uma claridade filtrada, quebrada, que projeta sombras texturizadas nas paredes e no piso.\n\nÉ um efeito impossível de reproduzir com tecidos industriais, e a razão pela qual esse tipo de persiana atravessa décadas de tendência sem sair de moda.\n\nA estética conversa diretamente com projetos de estilo tropical, boho, rústico e japandi, e a matéria-prima renovável agrada quem busca soluções de baixo impacto ambiental.\n\nO bloqueio de luz é moderado por natureza: sempre passa claridade pelas frestas da trama.\n\nPara quartos, a solução é encomendar o painel com forro de blackout costurado na face interna, disponível na maioria dos fabricantes.\n\nOs cuidados são específicos das fibras vegetais. Umidade prolongada favorece mofo, e por isso banheiros e áreas de serviço estão fora de cogitação sem tratamento específico.\n\nSol direto e constante resseca as fibras e desbota a cor ao longo dos anos. A limpeza deve ser sempre seca, com aspirador ou espanador — água em excesso mancha e deforma a trama.',
    whenToChoose:
      'Escolha bambu ou palha quando a textura natural e a luz filtrada forem o objetivo estético — varandas cobertas, salas de estilo tropical ou boho, quartos com projeto natural e casas de praia. Peça forro blackout se for usar em dormitórios.',
    priceRange: 'R$ 250 a R$ 800 por metro quadrado',
    maintenance:
      'Limpeza exclusivamente a seco, com aspirador de bocal macio ou espanador. Evite exposição a umidade constante para prevenir mofo.',
    installation:
      'Sistema rolô ou romano. Para dormitórios, encomende com forro blackout costurado na face interna do painel.',
    materials: ['Bambu', 'Palha natural', 'Junco', 'Ratã', 'Fibra de madeira trançada'],
    advantages: [
      'Luz filtrada com sombras texturizadas exclusivas',
      'Matéria-prima natural e renovável',
      'Estética atemporal em projetos tropicais e boho',
      'Leve e fácil de operar',
      'Disponível com forro blackout opcional',
    ],
    disadvantages: [
      'Sensível a umidade — risco de mofo',
      'Fibras ressecam e desbotam sob sol direto',
      'Bloqueio de luz limitado sem forro',
      'Não pode ser lavada com água',
      'Trama pode soltar fibras com o tempo',
    ],
    bestRooms: ['Varanda coberta', 'Sala de estar', 'Quarto (com forro)', 'Casa de praia', 'Ateliê'],
    metaTitle: 'Persiana de Bambu e Palha: luz filtrada e cuidados com umidade',
    metaDescription:
      'Como as fibras naturais criam sombras texturizadas, quando pedir forro blackout, por que evitar áreas úmidas e como limpar sem danificar a trama.',
  },
  {
    name: 'Persiana Plissada',
    slug: 'persiana-plissada',
    category: 'Persianas',
    lightBlocking: 'MEDIO',
    order: 20,
    image: '/images/cortinas/persiana-plissada.jpg',
    imageAlt: 'Persiana plissada em dobras finas ajustada a janela inclinada',
    summary:
      'Tecido dobrado em pregas finas que se compacta ao subir. Solução versátil para janelas de formato irregular e claraboias.',
    description:
      'A persiana plissada é feita de um tecido permanentemente vincado em pregas finas e paralelas, geralmente de 20 a 25 mm, que se comprimem quase completamente quando o painel é recolhido.\n\nSua característica mais útil é a flexibilidade geométrica. Como o sistema se apoia em perfis finos guiados por cabos tensionados, ela atende formatos que outros modelos não conseguem.\n\nÉ o caso de janelas trapezoidais, triangulares, arredondadas, claraboias e vidros inclinados de sótão.\n\nEm vidros de teto, os cabos mantêm o painel firme mesmo na horizontal, algo impossível para um rolô comum.\n\nO sistema top-down/bottom-up, disponível na maioria das linhas, permite fixar o painel em qualquer posição do vão, abrindo apenas a faixa desejada de luz.\n\nVisualmente, o plissado é discreto e leve, com textura sutil que não compete com o restante da decoração.\n\nOs tecidos vão do translúcido ao blackout, incluindo versões metalizadas no verso, que refletem calor e são muito eficazes em claraboias.\n\nAs desvantagens acompanham a construção. As pregas podem perder definição com o tempo, sobretudo em tecidos leves e com manuseio frequente.\n\nA limpeza é restrita a aspiração. E o custo é superior ao de um rolô equivalente, principalmente nos formatos especiais, sempre fabricados sob medida individual.',
    whenToChoose:
      'Escolha plissada quando a janela tiver formato irregular, for uma claraboia ou um vidro inclinado — situações em que nenhum outro sistema se adapta.\n\nTambém é excelente quando se deseja o recurso top-down/bottom-up em vãos pequenos.',
    priceRange: 'R$ 400 a R$ 1.300 por metro quadrado',
    maintenance:
      'Aspire com bocal macio no sentido das pregas. Não lave: a água desfaz o vinco permanente do tecido.',
    installation:
      'Fabricada sob medida para cada geometria. Em vidros inclinados e claraboias, o sistema com cabos tensionados é obrigatório.',
    materials: ['Poliéster plissado', 'Tecido metalizado', 'Tecido blackout plissado', 'Screen plissado'],
    advantages: [
      'Adapta-se a janelas trapezoidais, triangulares e claraboias',
      'Compacta-se quase totalmente quando recolhida',
      'Sistema top-down/bottom-up disponível',
      'Versões metalizadas refletem calor em vidros de teto',
      'Aparência leve e discreta',
    ],
    disadvantages: [
      'Pregas podem perder definição com o tempo',
      'Não pode ser lavada',
      'Custo elevado em formatos especiais',
      'Cabos tensionados exigem ajuste periódico',
    ],
    bestRooms: ['Claraboia', 'Sótão', 'Janela trapezoidal', 'Escada com vidro', 'Quarto compacto'],
    metaTitle: 'Persiana Plissada: solução para janelas irregulares e claraboias',
    metaDescription:
      'Por que a persiana plissada é a única opção viável em janelas triangulares, trapezoidais e claraboias, como funciona o top-down/bottom-up e como conservar as pregas.',
  },
  // =========================================================================
  // PAINEIS E SISTEMAS
  // =========================================================================
  {
    name: 'Painel Japonês',
    slug: 'painel-japones',
    category: 'Painéis e Sistemas',
    lightBlocking: 'MEDIO',
    order: 21,
    image: '/images/cortinas/painel-japones.jpg',
    imageAlt: 'Painel japonês com folhas planas deslizando em trilho múltiplo',
    summary:
      'Folhas planas e rígidas que deslizam em trilhos paralelos, sobrepondo-se como portas de armário.',
    description:
      'O painel japonês é composto por folhas de tecido planas, esticadas por uma barra superior e uma barra inferior com peso, que deslizam em um trilho de duas a cinco vias.\n\nAo serem movidas, as folhas se sobrepõem umas às outras como portas de armário, liberando o vão progressivamente.\n\nCada folha costuma medir entre 40 e 60 cm de largura, e o número de vias determina o quanto o vão pode ser liberado.\n\nDiferentemente de uma cortina franzida, aqui não há ondas nem pregas.\n\nO tecido permanece completamente esticado, o que cria uma superfície gráfica e limpa, muito alinhada ao vocabulário minimalista e à arquitetura de inspiração oriental que deu nome ao sistema.\n\nAlém de vestir janelas, o painel japonês é muito usado como divisória leve, separando um home office da sala, por exemplo.\n\nTambém serve para fechar nichos e closets, função em que uma cortina convencional não teria o mesmo acabamento.\n\nAceita praticamente qualquer material: tecidos lisos, screen para controle solar, blackout, fibras naturais e até composições que combinam materiais diferentes em folhas alternadas.\n\nA limitação principal é o bloqueio de luz nas junções: por mais que as folhas se sobreponham, sempre há passagem de claridade nas emendas, o que o desaconselha como solução única em dormitórios.',
    whenToChoose:
      'Escolha painel japonês em ambientes minimalistas, para vestir vãos largos com estética gráfica ou para dividir espaços sem obra. É excelente em portas de correr, closets e como fechamento de nichos.',
    priceRange: 'R$ 300 a R$ 900 por metro quadrado',
    maintenance:
      'As folhas podem ser removidas do trilho e limpas individualmente. Aspire regularmente e limpe o trilho com pano seco.',
    installation:
      'Trilho de 2 a 5 vias fixado no teto ou na parede. Cada folha tem de 40 a 60 cm; calcule o número de folhas pela largura do vão mais a sobreposição.',
    materials: ['Poliéster liso', 'Screen', 'Blackout', 'Fibras naturais', 'Linho'],
    advantages: [
      'Superfície plana e gráfica, alinhada ao minimalismo',
      'Funciona como divisória leve de ambientes',
      'Folhas removíveis facilitam a limpeza',
      'Aceita combinação de materiais diferentes',
      'Excelente em vãos largos e portas de correr',
    ],
    disadvantages: [
      'Passa luz nas junções entre as folhas',
      'Trilho de múltiplas vias ocupa profundidade considerável',
      'Não oferece o aconchego visual de uma cortina franzida',
      'Barras inferiores podem desalinhar se o trilho não estiver nivelado',
    ],
    bestRooms: ['Sala integrada', 'Home office', 'Closet', 'Divisória de ambientes', 'Loft'],
    metaTitle: 'Painel Japonês: sistema de trilhos, medidas e usos como divisória',
    metaDescription:
      'Como funciona o painel japonês, quantas vias de trilho escolher, largura ideal de cada folha e por que ele também serve como divisória de ambientes.',
  },
  {
    name: 'Cortina de Trilho Suíço',
    slug: 'cortina-de-trilho-suico',
    category: 'Painéis e Sistemas',
    lightBlocking: 'MEDIO',
    order: 22,
    image: '/images/cortinas/cortina-de-trilho-suico.jpg',
    imageAlt: 'Trilho suíço aparente com roldanas e cortina de linho',
    summary:
      'Trilho aparente com roldanas expostas e acabamento industrial. Combina praticidade mecânica com estética decorativa.',
    description:
      'O trilho suíço é um sistema de fixação em que o próprio trilho faz parte da composição visual.\n\nO trilho comum é feito para desaparecer atrás de um bandô ou dentro de uma sanca.\n\nO suíço é o oposto: fica aparente, em alumínio anodizado, aço escovado ou pintado, com roldanas expostas deslizando por uma canaleta.\n\nO resultado tem um ar levemente industrial e artesanal ao mesmo tempo, e resolve um problema recorrente.\n\nComo instalar cortinas em ambientes com teto de laje aparente, estrutura metálica ou pé-direito alto, onde não há sanca nem interesse em construir uma.\n\nMecanicamente, é um sistema robusto. Suporta tecidos pesados como linho encorpado e veludo com deslizamento suave.\n\nAceita curvas quando o perfil é flexível, útil em janelas de canto e vãos em L, e permite comprimentos longos sem emenda visível.\n\nAs roldanas de qualidade têm rolamentos que reduzem esforço e ruído. Os pontos de atenção envolvem a estética, que precisa combinar com o restante do projeto, e a limpeza.\n\nA canaleta aberta acumula poeira e exige aspiração periódica para que o deslizamento continue suave.\n\nTambém exige fixação bem dimensionada, já que todo o peso do painel se concentra em poucos suportes ao longo do perfil.',
    whenToChoose:
      'Escolha trilho suíço quando não houver sanca e o trilho for ficar visível — lofts, ambientes com laje ou estrutura aparente, pé-direito alto e projetos industriais. É também a melhor opção mecânica para tecidos pesados em vãos longos.',
    priceRange: 'R$ 180 a R$ 550 por metro linear apenas do trilho',
    maintenance:
      'Aspire a canaleta a cada seis meses e aplique silicone em spray nas roldanas para manter o deslizamento suave.',
    installation:
      'Fixação no teto ou na parede com suportes a cada 60 a 80 cm. Perfis flexíveis permitem curvas em janelas de canto.',
    materials: ['Alumínio anodizado', 'Aço escovado', 'Alumínio pintado'],
    advantages: [
      'Trilho aparente com acabamento decorativo',
      'Suporta tecidos pesados com deslizamento suave',
      'Perfis flexíveis atendem janelas em curva e em L',
      'Dispensa sanca de gesso',
      'Comprimentos longos sem emenda visível',
    ],
    disadvantages: [
      'Estética industrial não combina com todos os projetos',
      'Canaleta aberta acumula poeira',
      'Custo do trilho superior ao do modelo convencional',
      'Exige suportes bem dimensionados e alinhados',
    ],
    bestRooms: ['Loft', 'Sala com pé-direito alto', 'Ambiente industrial', 'Ateliê', 'Sala integrada'],
    metaTitle: 'Trilho Suíço para Cortinas: quando o trilho vira decoração',
    metaDescription:
      'O que é o trilho suíço, quanto peso suporta, como instalar sem sanca, opções de acabamento e em quais projetos ele substitui o trilho embutido.',
  },
  {
    name: 'Cortina Rolô com Sistema Zip',
    slug: 'cortina-rolo-com-sistema-zip',
    category: 'Painéis e Sistemas',
    lightBlocking: 'BLACKOUT',
    order: 23,
    image: '/images/cortinas/cortina-rolo-com-sistema-zip.jpg',
    imageAlt: 'Cortina rolô com sistema zip e trilhos laterais vedando as bordas',
    summary:
      'Rolô com zíper lateral que corre dentro de trilhos, eliminando as frestas de luz nas bordas do vão.',
    description:
      'O sistema zip resolve a maior fraqueza da persiana rolô convencional: a fresta lateral.\n\nO tecido recebe um cordão ou um zíper costurado nas duas bordas verticais, e esse elemento corre dentro de trilhos de alumínio fixados nas laterais do vão.\n\nCom o painel travado nas guias, não sobra folga entre o tecido e a parede. Combinado a um tecido blackout e a um bandô superior fechado, é o sistema que mais se aproxima da escuridão absoluta.\n\nO benefício não para na luz. Como as bordas ficam seladas, o zip cria uma barreira efetiva contra vento, poeira e insetos, o que explica seu uso frequente em varandas, áreas gourmet e sacadas.\n\nCom tecido screen, permite fechar o espaço mantendo ventilação filtrada e vista, e sem o balanço típico de painéis soltos.\n\nEm ambientes internos, o mesmo princípio garante desempenho térmico superior, já que elimina a convecção de ar entre a persiana e o vidro.\n\nAs exigências são de instalação. O vão precisa estar em esquadro e as laterais devem receber os trilhos com fixação firme, o que significa parede ou caixilho preparados.\n\nVãos muito largos pedem tecido reforçado e tubo de maior diâmetro. O custo é claramente superior ao de um rolô simples.',
    whenToChoose:
      'Escolha o sistema zip quando o objetivo for escuridão máxima em um quarto, ou quando precisar fechar uma varanda contra vento, poeira e insetos mantendo a vista. É também a melhor escolha em fachadas expostas a vento forte.',
    priceRange: 'R$ 600 a R$ 1.800 por metro quadrado',
    maintenance:
      'Limpe o tecido com pano úmido e aspire os trilhos laterais periodicamente para evitar que sujeira trave o deslizamento.',
    installation:
      'Trilhos laterais fixados no vão, que precisa estar em esquadro. Combine com bandô superior fechado para vedação completa.',
    materials: ['Tecido blackout', 'Screen', 'Poliéster com PVC', 'Tela acrílica para áreas externas'],
    advantages: [
      'Elimina praticamente todas as frestas laterais de luz',
      'Barreira efetiva contra vento, poeira e insetos',
      'Melhor desempenho térmico entre os sistemas de rolô',
      'Painel não balança com vento',
      'Excelente para fechamento de varandas e áreas gourmet',
    ],
    disadvantages: [
      'Custo bem superior ao do rolô convencional',
      'Exige vão em esquadro e laterais preparadas para os trilhos',
      'Trilhos laterais ficam sempre visíveis',
      'Manutenção do zíper exige assistência especializada',
    ],
    bestRooms: ['Quarto', 'Varanda gourmet', 'Sacada', 'Home theater', 'Fachada exposta a vento'],
    metaTitle: 'Cortina Rolô Sistema Zip: blackout sem frestas laterais',
    metaDescription:
      'Como o sistema zip elimina as frestas de luz da persiana rolô, por que é o mais próximo do blackout total e quando usar em varandas contra vento e insetos.',
  },
  // =========================================================================
  // ESPECIAIS E AUTOMACAO
  // =========================================================================
  {
    name: 'Cortina Motorizada',
    slug: 'cortina-motorizada',
    category: 'Especiais e Automação',
    lightBlocking: 'ALTO',
    order: 24,
    featured: true,
    image: '/images/cortinas/cortina-motorizada.jpg',
    imageAlt: 'Cortina motorizada sendo acionada por controle remoto e aplicativo',
    summary:
      'Acionamento por controle, aplicativo ou automação residencial. Conforto real em vãos altos, largos e de difícil acesso.',
    description:
      'A cortina motorizada substitui o acionamento manual por um motor tubular instalado dentro do tubo do rolô ou acoplado ao trilho.\n\nO comando pode vir de um controle remoto por radiofrequência, de um interruptor de parede ou de um aplicativo no celular.\n\nTambém funciona por voz, integrado a sistemas como Alexa, Google Home e Apple HomeKit.\n\nEm termos práticos, a motorização deixa de ser luxo e passa a ser necessidade em três situações.\n\nA primeira são vãos muito altos, onde alcançar a corrente exige escada. A segunda são vãos muito largos, em que o esforço manual é grande e o desgaste do mecanismo acelera.\n\nA terceira são janelas de difícil acesso, atrás de sofás, banheiras ou em pé-direito duplo. Há duas famílias de alimentação.\n\nMotores a bateria recarregável dispensam obra elétrica e são a escolha em reformas; a autonomia varia de seis meses a dois anos conforme o uso, e a recarga é feita por cabo USB ou carregador dedicado.\n\nMotores com alimentação 110/220 V exigem ponto elétrico previsto no projeto, mas não têm limite de acionamentos e são mais indicados para uso intenso.\n\nA automação abre possibilidades reais de eficiência energética: programar o fechamento nos horários de sol mais intenso reduz de forma mensurável a carga térmica e o consumo do ar-condicionado.',
    whenToChoose:
      'Escolha motorização em vãos altos, largos ou de difícil acesso, em projetos de automação residencial e sempre que houver rotina de abrir e fechar diariamente.\n\nTambém é a solução mais segura em casas com crianças, por eliminar cordões soltos.',
    priceRange: 'R$ 900 a R$ 3.500 por vão, incluindo motor e controle',
    maintenance:
      'Motores a bateria precisam de recarga periódica. Verifique anualmente os fins de curso e mantenha o trilho limpo e lubrificado.',
    installation:
      'Prefira prever ponto elétrico ainda na obra. Em reformas, motores a bateria evitam quebra-quebra e mantêm o acabamento intacto.',
    materials: ['Motor tubular a bateria', 'Motor 110/220 V', 'Motor com Wi-Fi integrado', 'Motor com hub Zigbee'],
    advantages: [
      'Aciona vãos altos, largos e de difícil acesso sem esforço',
      'Integra-se a rotinas de automação e assistentes de voz',
      'Elimina cordões soltos — mais segurança para crianças',
      'Programação por horário reduz carga térmica e consumo de energia',
      'Movimento uniforme prolonga a vida útil do tecido e do mecanismo',
    ],
    disadvantages: [
      'Custo inicial significativamente maior',
      'Motores a bateria exigem recarga periódica',
      'Modelos com fio requerem ponto elétrico planejado',
      'Manutenção depende de assistência técnica especializada',
      'Dependência de rede Wi-Fi em modelos conectados',
    ],
    bestRooms: ['Sala com pé-direito duplo', 'Quarto de casal', 'Home theater', 'Varanda', 'Escritório'],
    metaTitle: 'Cortina Motorizada: motores, automação e quando vale o investimento',
    metaDescription:
      'Motor a bateria ou 110/220V? Entenda os tipos de motorização de cortinas, integração com Alexa e Google Home, custos e em quais vãos ela é indispensável.',
  },
  {
    name: 'Persiana Integrada em Vidro Duplo',
    slug: 'persiana-integrada-em-vidro-duplo',
    category: 'Especiais e Automação',
    lightBlocking: 'ALTO',
    order: 25,
    image: '/images/cortinas/persiana-integrada-em-vidro-duplo.jpg',
    imageAlt: 'Persiana integrada entre os vidros de uma esquadria dupla',
    summary:
      'Lâminas instaladas entre dois vidros selados da esquadria. Zero acúmulo de poeira e manutenção praticamente nula.',
    description:
      'Na persiana integrada, as lâminas ficam alojadas dentro da câmara selada entre os dois vidros de uma esquadria de vidro duplo.\n\nO acionamento é feito por ímãs deslizantes na face externa do caixilho, por manivela ou por motor elétrico embutido, e o conjunto inteiro é fabricado em ambiente controlado e entregue lacrado.\n\nA consequência mais evidente é higiênica. Como as lâminas nunca entram em contato com o ar do ambiente, não acumulam poeira nem gordura de cozinha, e nunca precisam ser limpas.\n\nÉ um argumento decisivo para quem tem rinite, asma ou alergia a ácaros, e para hospitais, clínicas e laboratórios.\n\nO desempenho térmico e acústico também melhora, já que a câmara de ar entre os vidros funciona como isolante e as lâminas acrescentam uma barreira adicional contra a radiação solar.\n\nA superfície interna do ambiente fica completamente lisa, sem nada saliente, o que favorece a limpeza geral e ambientes de circulação intensa.\n\nAs restrições são estruturais.\n\nA persiana integrada não é um produto que se compra e instala sobre a janela existente: ela é parte da esquadria e exige a substituição completa do caixilho, com custo e obra correspondentes.\n\nSe o mecanismo interno falhar, o reparo passa por desmontar ou trocar a unidade selada, o que a torna uma decisão de longo prazo.',
    whenToChoose:
      'Escolha persiana integrada em obras novas e em reformas com troca de esquadrias.\n\nEla compensa sobretudo com moradores alérgicos, em ambientes de saúde e em fachadas que exigem isolamento térmico e acústico elevado.',
    priceRange: 'R$ 1.800 a R$ 5.000 por metro quadrado de esquadria completa',
    maintenance:
      'Praticamente nula no interior. Limpe apenas as faces externas do vidro e verifique periodicamente a vedação da esquadria.',
    installation:
      'Fornecida junto com a esquadria de vidro duplo. Não é possível instalar em janelas existentes sem substituir o caixilho.',
    materials: ['Alumínio em vidro duplo', 'Alumínio com acionamento magnético', 'Sistema motorizado embutido'],
    advantages: [
      'Nunca acumula poeira — ideal para alérgicos',
      'Isolamento térmico e acústico superior',
      'Superfície interna totalmente lisa e fácil de limpar',
      'Lâminas protegidas de impacto e umidade',
      'Manutenção interna praticamente inexistente',
    ],
    disadvantages: [
      'Exige substituição completa da esquadria',
      'Custo elevado, com obra associada',
      'Reparo do mecanismo interno é complexo e caro',
      'Opções de cor e acabamento limitadas ao fabricante',
    ],
    bestRooms: ['Quarto de alérgicos', 'Clínica', 'Consultório', 'Escritório corporativo', 'Cozinha'],
    metaTitle: 'Persiana Integrada em Vidro Duplo: higiene e isolamento',
    metaDescription:
      'Como funciona a persiana dentro do vidro duplo, por que é a melhor opção para alérgicos, quanto custa e por que só pode ser instalada com troca de esquadria.',
  },
  {
    name: 'Cortina Acústica e Térmica',
    slug: 'cortina-acustica-e-termica',
    category: 'Especiais e Automação',
    lightBlocking: 'BLACKOUT',
    order: 26,
    image: '/images/cortinas/cortina-acustica-e-termica.jpg',
    imageAlt: 'Cortina acústica multicamadas cobrindo janela de fachada urbana',
    summary:
      'Construção multicamadas com massa e absorção projetadas para reduzir ruído externo e perda térmica.',
    description:
      'A cortina acústica e térmica é um produto de engenharia, não apenas de decoração. Sua construção reúne três a cinco camadas.\n\nUm tecido decorativo na face interna, uma ou mais mantas de material denso — feltro agulhado, poliéster de alta gramatura ou membrana de massa — e um forro externo, frequentemente com face refletiva.\n\nO princípio físico é simples: massa bloqueia som, e porosidade absorve som.\n\nCombinando as duas propriedades, uma cortina bem construída reduz de 5 a 12 decibéis de ruído aéreo em frequências médias e altas, faixa que inclui vozes, latidos, tráfego leve e ruído de televisão.\n\nÉ importante calibrar a expectativa. Nenhuma cortina resolve ruído de baixa frequência, como caminhões, obras e subwoofers de vizinhos, porque isso exige massa e vedação estrutural na própria janela.\n\nO ganho térmico costuma ser mais perceptível que o acústico.\n\nCom gramatura total acima de 600 g/m² e instalação que transborde generosamente o vão, a barreira reduz de forma significativa a troca de calor pelo vidro, ajudando a manter o ambiente climatizado.\n\nPara extrair o máximo do produto, a instalação importa tanto quanto o tecido.\n\nA cortina precisa cobrir de parede a parede, encostar no piso e, idealmente, ter as laterais contidas para impedir que o som e o ar contornem o painel.',
    whenToChoose:
      'Escolha uma cortina acústica quando o imóvel enfrentar ruído urbano de média frequência e trocar a esquadria estiver fora de questão.\n\nÉ o caso de apartamentos em avenidas, quartos voltados para a rua, home studios e home theaters.',
    priceRange: 'R$ 400 a R$ 1.500 por metro linear',
    maintenance:
      'Aspire regularmente as camadas externas. Lavagem a seco na maioria dos modelos, já que as mantas internas não toleram imersão.',
    installation:
      'Cubra de parede a parede, encoste no piso e use sanca ou bandô fechado no topo. Frestas anulam boa parte do desempenho acústico.',
    materials: ['Feltro agulhado', 'Poliéster de alta gramatura', 'Membrana de massa', 'Forro refletivo'],
    advantages: [
      'Reduz de 5 a 12 dB de ruído aéreo em médias e altas frequências',
      'Excelente desempenho térmico com gramaturas altas',
      'Bloqueio de luz total pela própria construção multicamadas',
      'Alternativa viável quando trocar a esquadria não é possível',
      'Melhora a acústica interna reduzindo reverberação',
    ],
    disadvantages: [
      'Não resolve ruído de baixa frequência',
      'Peso elevado exige trilho e fixação reforçados',
      'Custo alto por metro linear',
      'Lavagem quase sempre profissional',
      'Volume considerável quando aberta',
    ],
    bestRooms: ['Quarto voltado para a rua', 'Home studio', 'Home theater', 'Apartamento em avenida', 'Consultório'],
    metaTitle: 'Cortina Acústica e Térmica: quanto ruído ela realmente reduz',
    metaDescription:
      'Como é construída uma cortina acústica multicamadas, quantos decibéis ela reduz de verdade, por que não resolve baixa frequência e como instalar para render o máximo.',
  },
];

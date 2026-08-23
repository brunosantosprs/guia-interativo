import type { Prisma } from '@prisma/client';

/**
 * Servicos do Guia Interativo.
 * Cada servico traz o processo completo, etapa por etapa, os entregaveis e as
 * duvidas mais frequentes — profundidade que sustenta tanto a conversao
 * quanto a avaliacao editorial do Google AdSense.
 */
export type ServiceSeed = Omit<
  Prisma.ServiceCreateInput,
  'createdAt' | 'updatedAt'
>;

export const services: ServiceSeed[] = [
  {
    title: 'Consultoria e Projeto de Cortinas',
    slug: 'consultoria-e-projeto-de-cortinas',
    icon: 'ClipboardList',
    order: 1,
    featured: true,
    image: '/images/servicos/consultoria-e-projeto-de-cortinas.jpg',
    priceNote: 'Consultoria a partir de R$ 350 por ambiente, abatida na contratação do projeto completo.',
    shortDescription:
      'Diagnóstico completo do ambiente, definição do sistema ideal, seleção de tecidos e projeto executivo com todas as cotas.',
    description:
      'A consultoria é a etapa que evita os erros mais caros de um projeto de cortinas.\n\nComprar o sistema errado, subestimar a metragem de tecido ou descobrir tarde demais que a sanca não comporta o trilho escolhido.\n\nO trabalho começa com o diagnóstico do ambiente: orientação solar, horário de incidência direta, ruído externo e uso do cômodo.\n\nEntram na conta também o pé-direito, a existência de sanca, o tipo de esquadria e os móveis próximos ao vão.\n\nSó depois desse levantamento entram as decisões de projeto. Cada vão recebe uma recomendação específica de sistema, com justificativa técnica.\n\nRolô screen para a fachada envidraçada que superaquece à tarde, composição dupla de voil e blackout no dormitório principal, romana em painel único na cozinha onde a bancada encosta na janela.\n\nA seleção de tecidos é feita com amostras físicas avaliadas na própria luz do ambiente, porque cor e caimento mudam radicalmente entre o showroom e a casa do cliente.\n\nO resultado é um projeto executivo com plantas cotadas, especificação técnica de cada peça e memorial de acabamentos.\n\nEle traz ainda o cálculo de metragem, a previsão de pontos elétricos e um orçamento detalhado por ambiente.\n\nEsse documento pode ser executado por qualquer fornecedor, o que dá ao cliente total liberdade de negociação e uma referência clara para comparar propostas.',
    steps: [
      {
        title: '1. Briefing e entendimento do uso',
        description:
          'Conversa inicial de aproximadamente uma hora para entender a rotina da casa, quem usa cada ambiente, sensibilidade à luz, queixas de calor ou ruído, referências estéticas e faixa de investimento pretendida.',
      },
      {
        title: '2. Visita técnica e diagnóstico',
        description:
          'Levantamento presencial de cada vão. Orientação solar, horários de incidência direta, tipo de esquadria, existência de sanca, pé-direito, pontos elétricos disponíveis e interferências como móveis, ar-condicionado e luminárias.',
      },
      {
        title: '3. Definição do sistema por ambiente',
        description:
          'Cada vão recebe a indicação técnica do sistema mais adequado — rolô, romana, wave, painel, screen, blackout ou composição dupla — sempre com a justificativa funcional registrada por escrito.',
      },
      {
        title: '4. Seleção de tecidos com amostras',
        description:
          'Apresentação de três a cinco opções por ambiente, avaliadas com amostras físicas na luz natural do próprio imóvel, considerando caimento, gramatura, comportamento sob sol e facilidade de manutenção.',
      },
      {
        title: '5. Projeto executivo e memorial',
        description:
          'Entrega das plantas cotadas, da especificação técnica de cada peça, do memorial de acabamentos e do cálculo de metragem de tecido, incluindo a previsão de pontos elétricos para eventual motorização.',
      },
      {
        title: '6. Orçamento detalhado e apoio à decisão',
        description:
          'Planilha aberta com custo por ambiente, separando tecido, mão de obra, ferragens e instalação, além de acompanhamento na análise de propostas de fornecedores.',
      },
    ],
    benefits: [
      'Evita compras equivocadas e retrabalho na obra',
      'Justificativa técnica registrada para cada decisão de projeto',
      'Tecidos avaliados na luz real do ambiente, não no showroom',
      'Documento executável por qualquer fornecedor',
      'Previsão antecipada de pontos elétricos para motorização',
      'Orçamento aberto que permite comparar propostas com clareza',
    ],
    deliverables: [
      'Planta cotada de cada vão',
      'Memorial descritivo de acabamentos',
      'Especificação técnica peça a peça',
      'Cálculo de metragem de tecido',
      'Planilha de orçamento por ambiente',
      'Lista de pontos elétricos necessários',
    ],
    faq: [
      {
        question: 'Preciso já ter decidido o tecido antes da consultoria?',
        answer:
          'Não. A escolha do tecido é uma das entregas do processo, e ela vem depois do diagnóstico técnico. Começar pelo tecido é justamente o erro mais comum: sem saber qual sistema o vão comporta e quanto de luz precisa ser bloqueado, a escolha vira aposta.',
      },
      {
        question: 'A consultoria funciona para reforma ou só para obra nova?',
        answer:
          'Funciona nos dois casos. Em obra nova o ganho é maior, porque ainda dá tempo de prever sanca, pontos elétricos e reforço estrutural. Em reforma, o projeto trabalha com as restrições existentes e indica soluções que dispensam quebra-quebra, como motores a bateria e suportes de pressão.',
      },
      {
        question: 'Sou obrigado a comprar com vocês depois do projeto?',
        answer:
          'Não. O projeto executivo é seu e pode ser executado por qualquer fornecedor. Essa independência é intencional: ela garante que a recomendação técnica não seja contaminada pelo interesse de venda de um produto específico.',
      },
      {
        question: 'Quanto tempo leva a consultoria completa?',
        answer:
          'Em média de sete a doze dias úteis entre a visita técnica e a entrega do projeto executivo, dependendo do número de ambientes e da disponibilidade de amostras dos tecidos selecionados.',
      },
    ],
    metaTitle: 'Consultoria e Projeto de Cortinas — diagnóstico técnico completo',
    metaDescription:
      'Consultoria técnica de cortinas: diagnóstico do ambiente, definição do sistema por vão, seleção de tecidos na luz real e projeto executivo com cotas e orçamento aberto.',
  },
  {
    title: 'Medição Técnica Profissional',
    slug: 'medicao-tecnica-profissional',
    icon: 'Ruler',
    order: 2,
    featured: true,
    image: '/images/servicos/medicao-tecnica-profissional.jpg',
    priceNote: 'Medição gratuita quando a fabricação é contratada; avulsa a partir de R$ 180 por visita.',
    shortDescription:
      'Levantamento milimétrico de cada vão, verificação de esquadro, prumo e nível, com laudo assinado antes da fabricação.',
    description:
      'Cortinas e persianas são fabricadas sob medida e não admitem correção depois de prontas.\n\nUm erro de dois centímetros na largura de uma persiana rolô resulta em fresta de luz permanente; dois centímetros a mais e a peça simplesmente não entra no vão.\n\nPor isso a medição técnica não é uma formalidade: é o momento em que o projeto se torna executável. O procedimento vai além de esticar a trena.\n\nCada vão é medido em três alturas e três larguras diferentes, porque paredes raramente são paralelas — em imóveis antigos, variações de um a três centímetros dentro do mesmo vão são comuns.\n\nVerificamos esquadro com esquadro de precisão, prumo e nível com laser, e registramos qualquer desvio no laudo.\n\nTambém mapeamos interferências que costumam passar despercebidas.\n\nPuxadores de janela que impedem o painel de descer rente, aparelhos de ar-condicionado, sancas com profundidade insuficiente, tomadas na trajetória do trilho e vigas que reduzem a altura útil.\n\nCada medida é fotografada e registrada em ficha individual, com a definição de instalação interna ou externa ao vão, o transbordo lateral necessário e a folga inferior recomendada.\n\nO laudo é assinado e serve como documento de referência: se a peça vier fora de medida, a responsabilidade é rastreável.',
    steps: [
      {
        title: '1. Conferência do projeto e do sistema escolhido',
        description:
          'Antes de medir, confirmamos qual sistema será instalado em cada vão, pois rolô, romana, wave e painel exigem referências de medida completamente diferentes.',
      },
      {
        title: '2. Medição em múltiplos pontos',
        description:
          'Cada vão é medido em três larguras (topo, meio e base) e três alturas (esquerda, centro e direita). Adotamos sempre a medida mais crítica para garantir que a peça caiba.',
      },
      {
        title: '3. Verificação de esquadro, prumo e nível',
        description:
          'Uso de nível a laser e esquadro de precisão para identificar desvios da alvenaria. Desvios acima de 1 cm mudam a recomendação de instalação e são registrados no laudo.',
      },
      {
        title: '4. Mapeamento de interferências',
        description:
          'Registro fotográfico de puxadores, aparelhos de ar-condicionado, tomadas, vigas, sancas e qualquer elemento que interfira na trajetória do painel ou na fixação dos suportes.',
      },
      {
        title: '5. Definição de transbordo e folgas',
        description:
          'Decisão sobre instalação interna ou externa ao vão, transbordo lateral, altura de fixação acima do vão e folga inferior — parâmetros que determinam o bloqueio de luz final.',
      },
      {
        title: '6. Laudo assinado e liberação para fabricação',
        description:
          'Emissão da ficha de medidas por vão, com fotos, cotas e observações. O documento é assinado por ambas as partes e só então a fabricação é liberada.',
      },
    ],
    benefits: [
      'Elimina o risco de peça fora de medida',
      'Identifica desvios de alvenaria antes da fabricação',
      'Mapeia interferências que causariam retrabalho',
      'Define com precisão o transbordo necessário para evitar frestas',
      'Laudo assinado com responsabilidade rastreável',
    ],
    deliverables: [
      'Ficha de medidas individual por vão',
      'Registro fotográfico das interferências',
      'Laudo de esquadro, prumo e nível',
      'Definição de instalação interna ou externa',
      'Autorização formal de fabricação',
    ],
    faq: [
      {
        question: 'Posso medir sozinho e enviar as medidas?',
        answer:
          'Pode, mas a responsabilidade passa a ser sua e a maioria dos fabricantes não aceita troca por erro de medida. Se optar por medir, meça em três pontos de largura e três de altura, use trena metálica e sempre adote a menor medida encontrada.',
      },
      {
        question: 'Qual é a diferença entre instalação dentro e fora do vão?',
        answer:
          'Dentro do vão o visual fica mais limpo e a moldura da janela permanece visível, mas sempre sobram frestas laterais de luz. Fora do vão, com transbordo de 10 a 20 cm, o bloqueio é muito superior — é a escolha obrigatória quando o objetivo é blackout.',
      },
      {
        question: 'A medição serve para qualquer tipo de cortina?',
        answer:
          'O procedimento é o mesmo, mas as referências mudam. Um rolô é medido pelo vão útil; uma cortina wave é medida pelo trilho e pela altura do piso ao teto; uma romana precisa da profundidade disponível. Por isso o sistema precisa estar definido antes da visita.',
      },
      {
        question: 'Quanto tempo depois da medição a peça fica pronta?',
        answer:
          'O prazo típico de fabricação sob medida no Brasil varia de dez a vinte e cinco dias úteis, dependendo do tecido, do sistema e de o produto ser nacional ou importado. Motorização costuma acrescentar de cinco a dez dias.',
      },
    ],
    metaTitle: 'Medição Técnica de Cortinas e Persianas — laudo antes da fabricação',
    metaDescription:
      'Como é feita a medição profissional de cortinas: três pontos de largura e altura, verificação de esquadro, mapeamento de interferências e laudo assinado.',
  },
  {
    title: 'Instalação de Cortinas e Persianas',
    slug: 'instalacao-de-cortinas-e-persianas',
    icon: 'Drill',
    order: 3,
    featured: true,
    image: '/images/servicos/instalacao-de-cortinas-e-persianas.jpg',
    priceNote: 'A partir de R$ 120 por vão, com desconto progressivo a partir do terceiro ambiente.',
    shortDescription:
      'Fixação técnica com buchas dimensionadas por tipo de parede, alinhamento a laser e teste completo de funcionamento.',
    description:
      'A instalação define se a cortina vai funcionar bem por dez anos ou dar problema em seis meses.\n\nTrês fatores concentram quase todas as falhas de campo: bucha inadequada ao substrato, trilho fora de nível e fixação sem reforço em drywall.\n\nCada tipo de parede exige uma solução diferente. Alvenaria de tijolo comum aceita bucha plástica convencional, e concreto exige furadeira de impacto com bucha específica.\n\nDrywall precisa de bucha basculante metálica ou, idealmente, de fixação direta no montante de aço.\n\nGesso acartonado sem reforço não sustenta uma cortina pesada; nesse caso instalamos mão-francesa apoiada na laje.\n\nAntes de furar, localizamos tubulações elétricas e hidráulicas com detector — um furo em um eletroduto transforma uma instalação de duas horas em uma reforma.\n\nTodo trilho e todo tubo são alinhados com nível a laser, não com nível de bolha: em vãos acima de dois metros, a diferença entre os dois métodos é visível a olho nu no caimento do tecido.\n\nConcluída a fixação, testamos o ciclo completo de abertura e fechamento pelo menos cinco vezes.\n\nAjustamos os fins de curso em peças motorizadas e verificamos o alinhamento das faixas em double vision. O ambiente é entregue limpo, com orientação de uso e manutenção.',
    steps: [
      {
        title: '1. Conferência da peça recebida',
        description:
          'Antes de furar qualquer parede, a peça é conferida contra o laudo de medição: largura, altura, cor, sentido de acionamento e acessórios. Divergência identificada nessa etapa evita furos inúteis.',
      },
      {
        title: '2. Identificação do substrato e escolha da fixação',
        description:
          'Diagnóstico do tipo de parede — alvenaria, concreto, drywall ou gesso — e seleção da bucha adequada. Em drywall, localizamos os montantes metálicos ou instalamos reforço apropriado.',
      },
      {
        title: '3. Detecção de tubulações',
        description:
          'Varredura com detector de metais e eletricidade na região de fixação para evitar perfuração de eletrodutos, tubulações hidráulicas e dutos de ar-condicionado.',
      },
      {
        title: '4. Marcação e alinhamento a laser',
        description:
          'Marcação dos pontos de fixação com nível a laser, garantindo trilho perfeitamente horizontal. Suportes distribuídos conforme o peso da peça, tipicamente a cada 60 a 80 cm.',
      },
      {
        title: '5. Montagem e regulagem fina',
        description:
          'Fixação dos suportes, encaixe da peça, regulagem de tensionamento, alinhamento de faixas em double vision, ajuste de fins de curso em modelos motorizados e nivelamento da barra inferior.',
      },
      {
        title: '6. Teste, limpeza e orientação de uso',
        description:
          'Cinco ciclos completos de abertura e fechamento, verificação de ruídos e travamentos, limpeza do ambiente e demonstração prática de uso e manutenção para o cliente.',
      },
    ],
    benefits: [
      'Bucha correta para cada tipo de parede, inclusive drywall',
      'Detecção de tubulações antes de qualquer furo',
      'Alinhamento a laser, não a nível de bolha',
      'Teste de ciclo completo antes da entrega',
      'Ambiente entregue limpo e organizado',
      'Orientação prática de uso e manutenção',
    ],
    deliverables: [
      'Peça instalada, nivelada e testada',
      'Ajuste de fins de curso em peças motorizadas',
      'Ambiente limpo após o serviço',
      'Orientação de uso e manutenção',
      'Garantia de instalação de 12 meses',
    ],
    faq: [
      {
        question: 'Cortina pode ser instalada em drywall?',
        answer:
          'Pode, com a fixação correta. O ideal é ancorar diretamente nos montantes metálicos da estrutura. Quando isso não é possível, usamos buchas basculantes metálicas ou instalamos uma mão-francesa apoiada na laje. Bucha plástica comum em drywall é a causa número um de trilho caindo.',
      },
      {
        question: 'Quanto tempo demora a instalação?',
        answer:
          'Uma persiana rolô simples leva de 20 a 40 minutos. Uma cortina wave com trilho embutido em sanca pode levar de duas a três horas. Peças motorizadas exigem tempo adicional para configuração dos fins de curso e pareamento dos controles.',
      },
      {
        question: 'É melhor fixar na parede ou no teto?',
        answer:
          'Depende do efeito desejado. Fixação no teto alonga visualmente o pé-direito e melhora o bloqueio de luz na parte superior. Fixação na parede é mais simples e permite ajustar a altura acima do vão. Em sanca, a fixação é sempre na laje.',
      },
      {
        question: 'Vocês instalam peças compradas em outro fornecedor?',
        answer:
          'Sim. Fazemos a conferência da peça antes de iniciar e informamos qualquer divergência de medida encontrada. A garantia da instalação cobre a fixação e a regulagem, não defeitos de fabricação da peça.',
      },
    ],
    metaTitle: 'Instalação de Cortinas e Persianas — fixação técnica',
    metaDescription:
      'Instalação profissional de cortinas: bucha correta por tipo de parede, detecção de tubulações, alinhamento a laser, teste de ciclo e garantia de 12 meses.',
  },
  {
    title: 'Automação e Motorização',
    slug: 'automacao-e-motorizacao',
    icon: 'Zap',
    order: 4,
    featured: true,
    image: '/images/servicos/automacao-e-motorizacao.jpg',
    priceNote: 'Motorização a partir de R$ 900 por vão, incluindo motor, controle e configuração.',
    shortDescription:
      'Especificação do motor correto, integração com Alexa, Google Home e HomeKit, e programação de cenas e rotinas.',
    description:
      'Motorizar uma cortina é uma decisão técnica que envolve três escolhas encadeadas: o tipo de motor, a forma de alimentação e o protocolo de comunicação.\n\nErrar qualquer uma delas gera frustração — motor subdimensionado que trava sob carga, bateria que descarrega a cada dois meses ou um sistema que não conversa com a automação já existente na casa.\n\nO dimensionamento parte do peso real da peça e do diâmetro do tubo. Um blackout de trama tripla em um vão de três metros pesa muito mais que um voil de mesma dimensão, e o torque do motor precisa acompanhar.\n\nA alimentação define a obra. Motores a bateria recarregável dispensam ponto elétrico e resolvem reformas, com autonomia de seis meses a dois anos conforme o uso diário.\n\nMotores 110/220 V exigem infraestrutura prevista, mas suportam uso intenso sem limite. O protocolo determina a integração.\n\nRadiofrequência simples resolve o acionamento por controle, enquanto Wi-Fi, Zigbee ou Matter permitem incluir a cortina em rotinas junto com iluminação, ar-condicionado e cenas de home theater.\n\nConfiguramos os fins de curso com precisão milimétrica e programamos cenas por horário e por sensor de luminosidade.\n\nO cliente é treinado no uso do aplicativo e recebe o sistema testado e documentado.',
    steps: [
      {
        title: '1. Levantamento de peso, vão e infraestrutura',
        description:
          'Cálculo do peso real da peça, diâmetro de tubo necessário e verificação da infraestrutura elétrica disponível, incluindo a viabilidade de passar cabos sem quebrar acabamentos.',
      },
      {
        title: '2. Escolha entre bateria e alimentação fixa',
        description:
          'Definição do tipo de alimentação com base na frequência de uso e nas restrições de obra. Estimamos a autonomia real da bateria a partir do número de acionamentos diários previstos.',
      },
      {
        title: '3. Definição do protocolo de comunicação',
        description:
          'Seleção entre radiofrequência, Wi-Fi, Zigbee ou Matter conforme a automação já existente na residência e o nível de integração desejado com assistentes de voz.',
      },
      {
        title: '4. Instalação e configuração dos fins de curso',
        description:
          'Montagem do motor, pareamento dos controles e ajuste milimétrico dos limites superior e inferior de curso, garantindo que a peça pare exatamente na posição correta.',
      },
      {
        title: '5. Integração e criação de cenas',
        description:
          'Inclusão dos dispositivos no aplicativo do fabricante e no ecossistema da casa, criação de grupos por ambiente e programação de rotinas por horário, nascer do sol ou sensor de luminosidade.',
      },
      {
        title: '6. Treinamento e documentação do sistema',
        description:
          'Demonstração prática de uso, entrega da documentação com senhas, nomes de dispositivos e cenas criadas, e orientação sobre recarga e manutenção preventiva.',
      },
    ],
    benefits: [
      'Motor dimensionado pelo peso real da peça',
      'Escolha consciente entre bateria e alimentação fixa',
      'Integração com Alexa, Google Home, HomeKit e Matter',
      'Cenas programadas por horário e luminosidade',
      'Redução mensurável da carga térmica e do consumo de energia',
      'Eliminação de cordões soltos — mais segurança para crianças',
    ],
    deliverables: [
      'Motor instalado e configurado',
      'Fins de curso ajustados',
      'Dispositivos integrados ao aplicativo',
      'Cenas e rotinas programadas',
      'Documentação do sistema com nomes e senhas',
      'Treinamento de uso para os moradores',
    ],
    faq: [
      {
        question: 'Dá para motorizar uma cortina que já está instalada?',
        answer:
          'Na maioria dos casos sim, desde que o tubo ou trilho seja compatível com o motor. Em persianas rolô, o motor tubular substitui o mecanismo de corrente. Em cortinas de trilho, é necessário trocar o trilho por um modelo motorizado. A avaliação é feita na visita técnica.',
      },
      {
        question: 'Quanto tempo dura a bateria de um motor?',
        answer:
          'De seis meses a dois anos, dependendo do número de acionamentos diários, do peso da peça e da temperatura ambiente. Um vão acionado duas vezes por dia costuma render de oito a doze meses por carga. Painéis solares acoplados à janela ampliam bastante esse intervalo.',
      },
      {
        question: 'Funciona sem internet?',
        answer:
          'Sim. O controle remoto por radiofrequência funciona independentemente da rede. A internet é necessária apenas para comando por aplicativo fora de casa e para rotinas que dependem de assistentes de voz na nuvem.',
      },
      {
        question: 'A motorização faz muito barulho?',
        answer:
          'Motores atuais operam entre 35 e 45 decibéis, comparável a uma conversa em voz baixa. Modelos silenciosos, indicados para dormitórios, ficam abaixo de 35 dB. O ruído tende a aumentar quando o motor está subdimensionado para o peso da peça.',
      },
    ],
    metaTitle: 'Automação de Cortinas — motorização, integração e cenas',
    metaDescription:
      'Motorização de cortinas com dimensionamento correto do motor, escolha entre bateria e 110/220V, integração com Alexa e Google Home e programação de rotinas.',
  },
  {
    title: 'Manutenção, Limpeza e Reparos',
    slug: 'manutencao-limpeza-e-reparos',
    icon: 'SprayCan',
    order: 5,
    image: '/images/servicos/manutencao-limpeza-e-reparos.jpg',
    priceNote: 'Higienização a partir de R$ 90 por peça; reparos orçados após diagnóstico.',
    shortDescription:
      'Higienização adequada a cada material, troca de componentes e recuperação de mecanismos travados ou desalinhados.',
    description:
      'Cortinas e persianas concentram poeira, ácaros e, em cozinhas, gordura em suspensão.\n\nA higienização periódica não é só questão de aparência: é um fator direto de qualidade do ar interno, especialmente em quartos de pessoas com rinite e asma.\n\nO problema é que cada material exige um método diferente, e o procedimento errado destrói a peça.\n\nTecidos plissados e celulares não podem ser molhados, porque a água desfaz o vinco permanente.\n\nBlackout com revestimento acrílico não tolera dobras nem torção, sob risco de craquelar a película. Madeira não aceita água em quantidade.\n\nBambu e palha só admitem limpeza a seco. Screen e PVC, ao contrário, limpam bem com pano úmido e sabão neutro.\n\nNosso serviço começa pela identificação correta do material e do sistema, seguida do método adequado.\n\nAspiração com bocal macio, limpeza a seco por injeção e extração, higienização com produtos neutros ou remoção para lavagem profissional, conforme o caso.\n\nNa parte mecânica, atuamos nos defeitos mais comuns: corrente que patina, tubo desalinhado e faixas de double vision fora de sincronia.\n\nTambém recuperamos cursores quebrados, cordões rompidos, trilhos empenados e motores com fim de curso perdido.\n\nSempre que possível trocamos apenas o componente defeituoso, o que custa uma fração do valor de uma peça nova.',
    steps: [
      {
        title: '1. Diagnóstico do material e do sistema',
        description:
          'Identificação precisa do tecido, do revestimento e do mecanismo. Essa etapa define o método de limpeza e evita o dano mais comum do setor: aplicar água em material que não a tolera.',
      },
      {
        title: '2. Aspiração e remoção de particulados',
        description:
          'Aspiração com bocal macio em toda a superfície, incluindo o interior das células em persianas colmeia e o vão entre lâminas em modelos horizontais.',
      },
      {
        title: '3. Higienização pelo método adequado',
        description:
          'Limpeza a seco por injeção e extração, higienização com produto neutro ou remoção para lavagem profissional, conforme a composição identificada no diagnóstico.',
      },
      {
        title: '4. Revisão mecânica completa',
        description:
          'Verificação de correntes, cursores, roldanas, cordões, molas, tensionadores e trilhos. Peças com desgaste avançado são identificadas e orçadas antes de qualquer substituição.',
      },
      {
        title: '5. Substituição de componentes e realinhamento',
        description:
          'Troca das peças defeituosas, realinhamento de tubos e faixas, retensionamento de cordões e reconfiguração de fins de curso em modelos motorizados.',
      },
      {
        title: '6. Teste final e plano de manutenção',
        description:
          'Ciclos completos de teste e entrega de um plano de manutenção preventiva personalizado, com a periodicidade recomendada para cada peça da casa.',
      },
    ],
    benefits: [
      'Método de limpeza específico para cada material',
      'Melhora mensurável da qualidade do ar interno',
      'Reparo de componentes em vez de troca da peça inteira',
      'Recuperação de mecanismos travados e desalinhados',
      'Prolonga significativamente a vida útil do investimento',
      'Plano preventivo personalizado por ambiente',
    ],
    deliverables: [
      'Peças higienizadas pelo método correto',
      'Componentes desgastados substituídos',
      'Mecanismos realinhados e testados',
      'Relatório do que foi executado',
      'Plano de manutenção preventiva',
    ],
    faq: [
      {
        question: 'Com que frequência devo higienizar as cortinas?',
        answer:
          'Em ambientes comuns, a cada seis a doze meses. Em cozinhas, a cada três a quatro meses por causa da gordura em suspensão. Em quartos de pessoas alérgicas, a cada três meses, com aspiração quinzenal entre as higienizações profissionais.',
      },
      {
        question: 'Posso lavar minha persiana rolô em casa?',
        answer:
          'Não recomendamos. O tecido de rolô marca de forma permanente ao ser dobrado, e a maioria dos revestimentos não tolera imersão. A limpeza correta é feita com o painel totalmente estendido, usando pano levemente úmido e sabão neutro, sem esfregar.',
      },
      {
        question: 'Vale a pena consertar ou é melhor trocar?',
        answer:
          'Se o tecido estiver íntegro e o problema for mecânico — corrente, cursor, cordão, roldana ou motor — o reparo costuma custar de 10% a 30% do valor de uma peça nova e devolve anos de uso. Tecido rasgado, revestimento craquelado ou desbotamento generalizado justificam a substituição.',
      },
      {
        question: 'A limpeza remove ácaros?',
        answer:
          'A aspiração com filtro adequado e a limpeza profissional reduzem drasticamente a população de ácaros e a carga de alérgenos acumulada. Para alérgicos, a combinação de higienização trimestral com tecidos de trama fechada apresenta o melhor resultado prático.',
      },
    ],
    metaTitle: 'Manutenção e Limpeza de Cortinas e Persianas — método por material',
    metaDescription:
      'Higienização profissional de cortinas com método adequado a cada material, reparo de mecanismos travados, troca de componentes e plano de manutenção preventiva.',
  },
  {
    title: 'Confecção Sob Medida',
    slug: 'confeccao-sob-medida',
    icon: 'Scissors',
    order: 6,
    image: '/images/servicos/confeccao-sob-medida.jpg',
    priceNote: 'Mão de obra de confecção a partir de R$ 90 por metro linear, sem o tecido.',
    shortDescription:
      'Costura artesanal com barra em chumbo, forro técnico e acabamentos que só existem em peças feitas individualmente.',
    description:
      'Uma cortina sob medida se distingue de uma pronta em detalhes que só aparecem depois de instalada. O primeiro é o caimento.\n\nPeças de prateleira vêm em alturas padronizadas e quase sempre ficam curtas ou arrastando.\n\nA confecção individual calcula a altura exata, considerando a espessura do trilho, o tipo de gancho e a folga de piso desejada.\n\nEm geral é 1 cm para não arrastar, ou o efeito puddle proposital, com 5 a 15 cm de tecido repousando no chão. O segundo é o peso da barra.\n\nUma fita de chumbo costurada dentro da bainha inferior faz o painel cair reto e resistir a correntes de ar, algo que nenhuma cortina industrializada oferece.\n\nO terceiro é o forro. Forro blackout, forro térmico ou forro neutro mudam completamente o desempenho e protegem o tecido principal do sol, prolongando sua vida em anos.\n\nA confecção também permite escolher o cabeçote: prega francesa tripla, prega dupla, prega invertida, fita wave, ilhós ou passante.\n\nPermite ainda posicionar as emendas de vãos largos dentro de uma prega, onde ficam invisíveis, e casar estampas entre painéis.\n\nTrabalhamos com o tecido do cliente ou com fornecimento completo, sempre com prova de caimento antes do acabamento final.',
    steps: [
      {
        title: '1. Definição do cabeçote e do acabamento',
        description:
          'Escolha entre prega francesa, prega dupla, prega invertida, fita wave, ilhós ou passante, considerando o estilo do ambiente, o tipo de trilho e o comportamento do tecido selecionado.',
      },
      {
        title: '2. Cálculo de metragem e planejamento de corte',
        description:
          'Cálculo do multiplicador de franzido, das bainhas laterais e inferior, do rapport da estampa e do posicionamento das emendas, sempre planejadas para cair dentro de uma prega.',
      },
      {
        title: '3. Corte no fio e preparação do tecido',
        description:
          'Corte alinhado ao fio do tecido para evitar torção do painel ao longo do tempo, com pré-encolhimento quando a fibra exigir, especialmente em algodão e linho puro.',
      },
      {
        title: '4. Aplicação de forro e barra em chumbo',
        description:
          'Costura do forro técnico escolhido e inserção da fita de chumbo na bainha inferior, garantindo caimento reto e estabilidade contra correntes de ar.',
      },
      {
        title: '5. Montagem do cabeçote e prova de caimento',
        description:
          'Costura das pregas ou aplicação da fita técnica, seguida de prova com a peça pendurada para conferir caimento, altura e simetria antes do acabamento definitivo.',
      },
      {
        title: '6. Acabamento final e revisão de qualidade',
        description:
          'Fechamento das bainhas, revisão de costuras, conferência de simetria entre painéis, passadoria e embalagem individual para transporte sem vincos.',
      },
    ],
    benefits: [
      'Altura exata, sem sobra nem arraste',
      'Barra em chumbo para caimento reto e estável',
      'Forro técnico que protege o tecido e melhora o desempenho',
      'Emendas invisíveis em vãos largos',
      'Estampas casadas entre painéis',
      'Prova de caimento antes do acabamento final',
    ],
    deliverables: [
      'Peça confeccionada sob medida',
      'Forro técnico aplicado',
      'Barra em chumbo costurada',
      'Ganchos e acessórios inclusos',
      'Embalagem individual sem vincos',
      'Ficha técnica com composição e instruções de lavagem',
    ],
    faq: [
      {
        question: 'Quanto tecido preciso comprar?',
        answer:
          'Depende do cabeçote. Pregas francesas e wave pedem de 2,5 a 3 vezes a largura do vão. Ilhós e passante funcionam bem com 2 a 2,5 vezes. Painéis planos, como o japonês, usam praticamente a largura real mais as bainhas. Sempre acrescente o rapport se o tecido for estampado.',
      },
      {
        question: 'Vocês trabalham com tecido do cliente?',
        answer:
          'Sim. Nesse caso conferimos a largura útil, a composição e o comportamento do tecido antes de cortar, e informamos por escrito qualquer limitação identificada — como tendência a encolher, torcer ou desfiar.',
      },
      {
        question: 'Qual a diferença entre forro comum e forro blackout?',
        answer:
          'O forro comum protege o tecido principal do sol e melhora o caimento, mas bloqueia pouca luz. O forro blackout acrescenta uma camada opaca que eleva o bloqueio para perto de 100%. Há ainda o forro térmico, com face refletiva, focado em conforto térmico.',
      },
      {
        question: 'É possível reaproveitar uma cortina antiga?',
        answer:
          'Frequentemente sim. Ajuste de altura, troca de cabeçote, aplicação de forro e substituição da barra em chumbo são serviços comuns e custam bem menos que uma peça nova, desde que o tecido esteja íntegro e sem desbotamento acentuado.',
      },
    ],
    metaTitle: 'Confecção de Cortinas Sob Medida — costura, forro e acabamento',
    metaDescription:
      'Confecção de cortinas sob medida: escolha do cabeçote, cálculo de metragem, corte no fio, forro técnico, barra em chumbo e prova de caimento antes da entrega.',
  },
];

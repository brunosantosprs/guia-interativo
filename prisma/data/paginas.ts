/**
 * Paginas institucionais e legais.
 *
 * As tres politicas sao requisito explicito do Google AdSense: a conta so e
 * aprovada quando o site expoe, de forma acessivel, como trata dados pessoais,
 * cookies e publicidade de terceiros. O texto abaixo cobre LGPD, cookies do
 * Google e a base legal do tratamento.
 */
export interface PageSeed {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  showInFooter: boolean;
  showInMenu: boolean;
  menuOrder: number;
  metaTitle: string;
  metaDescription: string;
}

const HOJE = '22 de agosto de 2026';

export const pages: PageSeed[] = [
  {
    title: 'Política de Privacidade',
    slug: 'politica-de-privacidade',
    showInFooter: true,
    showInMenu: false,
    menuOrder: 1,
    excerpt:
      'Como o Guia Interativo coleta, utiliza, armazena e protege dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD).',
    metaTitle: 'Política de Privacidade — Guia Interativo',
    metaDescription:
      'Saiba como o Guia Interativo trata dados pessoais, quais cookies utiliza, como funcionam Google Analytics e Google AdSense e quais são os seus direitos sob a LGPD.',
    content: `_Última atualização: ${HOJE}_

O **Guia Interativo** (guiainterativo.com) respeita a sua privacidade e está comprometido com a proteção dos dados pessoais de quem visita o site. Esta Política de Privacidade explica, de forma direta, quais informações coletamos, por que coletamos, como utilizamos e quais são os seus direitos.

Este documento foi elaborado em conformidade com a **Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais (LGPD)**.

## 1. Quem é o controlador dos dados

O controlador dos dados pessoais tratados neste site é o **Guia Interativo**, responsável pelo domínio guiainterativo.com.

Para qualquer assunto relacionado a privacidade e proteção de dados, o canal de contato é o e-mail informado na seção "Como exercer seus direitos", ao final deste documento.

## 2. Quais dados coletamos

### 2.1 Dados que você nos fornece diretamente

Coletamos apenas o que você digita voluntariamente:

- **Formulário de contato:** nome, e-mail, telefone (opcional), assunto e mensagem
- **Newsletter:** endereço de e-mail e, opcionalmente, nome
- **Área administrativa:** nome, e-mail e senha (armazenada apenas como hash criptográfico, nunca em texto legível)

### 2.2 Dados coletados automaticamente

Quando você navega pelo site, alguns dados técnicos são registrados automaticamente:

- Endereço IP (anonimizado nas ferramentas de análise)
- Tipo e versão do navegador
- Sistema operacional e tipo de dispositivo
- Páginas visitadas, tempo de permanência e caminho de navegação
- Site ou mecanismo de busca de origem
- Data e horário de acesso

Esses dados são tratados de forma agregada e servem exclusivamente para entender como o site é usado e melhorá-lo.

### 2.3 Dados que NÃO coletamos

Para deixar claro: não coletamos CPF, RG, dados bancários, dados de cartão de crédito, dados de saúde, dados biométricos, orientação sexual, convicção religiosa ou filiação política. Não solicitamos e não temos qualquer uso para essas informações.

## 3. Por que tratamos seus dados

Cada tratamento tem uma finalidade específica e uma base legal correspondente:

| Finalidade | Base legal (LGPD) |
|---|---|
| Responder mensagens do formulário de contato | Execução de procedimentos preliminares a pedido do titular (art. 7º, V) |
| Enviar newsletter | Consentimento do titular (art. 7º, I) |
| Medir audiência e melhorar o conteúdo | Legítimo interesse (art. 7º, IX) |
| Exibir publicidade | Consentimento do titular (art. 7º, I) |
| Autenticar administradores | Execução de contrato (art. 7º, V) |
| Cumprir obrigações legais | Obrigação legal (art. 7º, II) |

## 4. Cookies e tecnologias semelhantes

Cookies são pequenos arquivos de texto armazenados no seu navegador. Utilizamos as seguintes categorias:

### 4.1 Cookies essenciais

Necessários para o funcionamento básico do site — manutenção de sessão na área administrativa e registro da sua preferência sobre cookies. **Não podem ser desativados**, pois sem eles o site não funciona.

### 4.2 Cookies de análise

Utilizamos o **Google Analytics 4** para entender quais conteúdos são mais úteis, de onde vêm os visitantes e onde a navegação apresenta dificuldades. A coleta é configurada com anonimização de IP.

### 4.3 Cookies de publicidade

Utilizamos o **Google AdSense** para exibir anúncios. Esses cookies podem ser usados para personalizar a publicidade com base na sua navegação.

Para detalhes completos sobre cada cookie, consulte a nossa [Política de Cookies](/politica-de-cookies).

## 5. Google Analytics

O Google Analytics 4 é um serviço de análise de audiência fornecido pela Google LLC. Ele utiliza cookies para coletar informações sobre o uso do site de forma agregada e anônima.

**O que fazemos para proteger você:**

- A anonimização de IP está ativada
- Não enviamos dados que permitam identificar você pessoalmente
- Não cruzamos dados do Analytics com dados de formulários

Você pode desativar completamente a coleta instalando o [complemento oficial de desativação do Google Analytics](https://tools.google.com/dlpage/gaoptout).

Política de privacidade do Google: [policies.google.com/privacy](https://policies.google.com/privacy).

## 6. Google AdSense e publicidade de terceiros

Este site utiliza o **Google AdSense** como rede de publicidade. Os anúncios ajudam a manter o conteúdo gratuito e acessível.

Informações que você precisa saber:

- **A Google, como fornecedora terceirizada, utiliza cookies para exibir anúncios** neste site.
- O **cookie DART** permite que a Google exiba anúncios com base nas visitas do usuário a este e a outros sites da internet.
- Os usuários podem **desativar o uso do cookie DART** visitando a [Política de Privacidade da rede de conteúdo e dos anúncios da Google](https://policies.google.com/technologies/ads).
- Fornecedores terceirizados e redes de anúncios parceiras também podem utilizar cookies. Você pode gerenciar essas preferências em [aboutads.info/choices](https://www.aboutads.info/choices/) e em [youronlinechoices.com](https://www.youronlinechoices.com/).

**Não temos controle sobre o conteúdo específico dos anúncios exibidos** nem acesso aos cookies definidos por terceiros. A responsabilidade sobre esses cookies é das respectivas redes de publicidade.

### Personalização de anúncios

Você pode desativar a personalização de anúncios do Google a qualquer momento em [adssettings.google.com](https://adssettings.google.com). Os anúncios continuarão sendo exibidos, mas deixarão de ser baseados nos seus interesses.

## 7. Compartilhamento de dados

**Não vendemos, alugamos ou comercializamos dados pessoais.** Jamais.

O compartilhamento ocorre apenas nas seguintes hipóteses:

- **Prestadores de serviço** que operam a infraestrutura do site (hospedagem, banco de dados, envio de e-mails), sempre vinculados contratualmente a obrigações de confidencialidade
- **Google**, no âmbito do Analytics e do AdSense, conforme descrito acima
- **Autoridades públicas**, quando houver requisição legal ou ordem judicial

## 8. Transferência internacional

Alguns dos serviços que utilizamos — como Google Analytics, Google AdSense e infraestrutura de hospedagem — podem processar dados em servidores localizados fora do Brasil.

Essas transferências ocorrem em conformidade com o artigo 33 da LGPD, com base em cláusulas contratuais padrão e nas garantias oferecidas pelos respectivos fornecedores.

## 9. Por quanto tempo guardamos seus dados

| Tipo de dado | Prazo de retenção |
|---|---|
| Mensagens do formulário de contato | Até 24 meses após o último contato |
| Cadastro na newsletter | Até a solicitação de descadastramento |
| Dados de navegação (Analytics) | 14 meses (padrão do GA4) |
| Contas administrativas | Enquanto a conta estiver ativa |

Após esses prazos, os dados são eliminados ou anonimizados de forma irreversível.

## 10. Segurança da informação

Adotamos medidas técnicas e administrativas para proteger os dados:

- Conexão criptografada via **HTTPS/TLS** em todo o site
- Senhas armazenadas exclusivamente como **hash bcrypt**
- Controle de acesso por perfil na área administrativa
- Validação de todos os dados de entrada, no cliente e no servidor
- Cabeçalhos de segurança HTTP configurados
- Backups periódicos com acesso restrito

Nenhum sistema é totalmente inviolável. Em caso de incidente de segurança que possa acarretar risco relevante aos titulares, comunicaremos os afetados e a **ANPD** conforme o artigo 48 da LGPD.

## 11. Seus direitos como titular

A LGPD garante a você os seguintes direitos:

- **Confirmação** da existência de tratamento
- **Acesso** aos dados que temos sobre você
- **Correção** de dados incompletos, inexatos ou desatualizados
- **Anonimização, bloqueio ou eliminação** de dados desnecessários ou tratados em desconformidade
- **Portabilidade** a outro fornecedor de serviço
- **Eliminação** dos dados tratados com base em consentimento
- **Informação** sobre com quem compartilhamos seus dados
- **Revogação do consentimento** a qualquer momento
- **Oposição** a tratamento realizado com base em legítimo interesse

## 12. Como exercer seus direitos

Envie um e-mail para **contato@guiainterativo.com** com o assunto "LGPD — Solicitação de titular", descrevendo o direito que deseja exercer.

Responderemos em até **15 dias corridos**. Podemos solicitar informações adicionais para confirmar sua identidade antes de atender ao pedido — medida de segurança que protege você.

## 13. Privacidade de crianças e adolescentes

Este site não é direcionado a menores de 18 anos e não coletamos intencionalmente dados de crianças ou adolescentes.

Se você é responsável legal e identificou que um menor sob sua guarda forneceu dados pessoais, entre em contato para que possamos eliminá-los.

## 14. Links para sites externos

Nosso conteúdo pode conter links para sites de terceiros. Esta Política de Privacidade **não se aplica** a esses sites. Recomendamos que você leia as políticas de privacidade de cada site que visitar.

## 15. Alterações nesta política

Esta política pode ser atualizada para refletir mudanças na legislação, nas ferramentas utilizadas ou nas práticas do site. A data da última atualização está sempre indicada no início do documento.

Alterações relevantes serão comunicadas de forma destacada na página inicial.

## 16. Contato

**E-mail:** contato@guiainterativo.com
**Site:** guiainterativo.com

Se entender que seus direitos não foram adequadamente atendidos, você pode apresentar reclamação à **Autoridade Nacional de Proteção de Dados (ANPD)** em [gov.br/anpd](https://www.gov.br/anpd/).`,
  },
  {
    title: 'Termos de Uso',
    slug: 'termos-de-uso',
    showInFooter: true,
    showInMenu: false,
    menuOrder: 2,
    excerpt:
      'Regras e condições para a utilização do site Guia Interativo, incluindo propriedade intelectual, limitação de responsabilidade e conduta do usuário.',
    metaTitle: 'Termos de Uso — Guia Interativo',
    metaDescription:
      'Condições de uso do site Guia Interativo: natureza informativa do conteúdo, direitos autorais, limitação de responsabilidade, links externos e publicidade.',
    content: `_Última atualização: ${HOJE}_

Bem-vindo ao **Guia Interativo**. Ao acessar e utilizar este site, você concorda com os termos descritos abaixo. Se não concordar com alguma condição, por favor não utilize o site.

## 1. Objeto e natureza do serviço

O Guia Interativo é um **portal de conteúdo informativo** dedicado ao universo das cortinas e persianas. Publicamos guias, comparativos, artigos técnicos e catálogos descritivos com finalidade educativa.

O conteúdo aqui publicado tem **caráter informativo e orientativo**. Ele não substitui:

- Avaliação técnica presencial de um profissional qualificado
- Projeto de arquitetura ou design de interiores
- Laudo de medição realizado por técnico habilitado
- Orientação específica do fabricante do produto adquirido

## 2. Aceitação dos termos

O uso do site implica aceitação integral destes Termos de Uso e da nossa [Política de Privacidade](/politica-de-privacidade).

Se você utiliza o site em nome de uma empresa, declara ter poderes para vinculá-la a estes termos.

## 3. Uso permitido

Você pode livremente:

- Ler, consultar e navegar por todo o conteúdo publicado
- Compartilhar links para nossas páginas em redes sociais, blogs e mensagens
- Citar trechos curtos com **atribuição clara** e link para a página original
- Imprimir ou salvar conteúdo para uso pessoal e não comercial

## 4. Uso proibido

É expressamente vedado:

- **Reproduzir integralmente** artigos, guias ou descrições em outros sites, redes sociais ou publicações, com ou sem atribuição
- Utilizar o conteúdo para **fins comerciais** sem autorização prévia por escrito
- Realizar **raspagem automatizada** (scraping) do conteúdo ou do banco de dados
- Tentar acessar áreas restritas, contas de terceiros ou a infraestrutura do servidor
- Introduzir vírus, malware, scripts maliciosos ou qualquer código destinado a comprometer o funcionamento do site
- Sobrecarregar deliberadamente a infraestrutura com requisições automatizadas
- Remover, ocultar ou alterar avisos de direitos autorais
- Utilizar o formulário de contato para envio de spam, propaganda não solicitada ou conteúdo ofensivo

## 5. Propriedade intelectual

Todo o conteúdo original deste site — textos, guias, descrições, comparativos, estrutura de navegação, identidade visual, logotipo e código-fonte — é protegido pela **Lei nº 9.610/1998 (Lei de Direitos Autorais)** e pertence ao Guia Interativo ou aos seus licenciadores.

Marcas de terceiros eventualmente citadas pertencem aos respectivos titulares e são mencionadas apenas em caráter descritivo e informativo, sem qualquer vínculo comercial implícito.

## 6. Limitação de responsabilidade

Empregamos esforço genuíno para manter as informações precisas, atualizadas e tecnicamente corretas. Ainda assim:

- **Não garantimos** que o conteúdo esteja livre de erros, omissões ou desatualizações
- **Não nos responsabilizamos** por decisões de compra, instalação ou reforma tomadas com base exclusivamente no conteúdo do site
- **Não nos responsabilizamos** por danos diretos ou indiretos decorrentes do uso ou da impossibilidade de uso do site
- Preços, faixas de investimento e especificações técnicas são **estimativas de mercado** e variam por região, fornecedor e momento

**Recomendação:** antes de qualquer compra ou instalação, consulte um profissional qualificado e valide as informações com o fabricante do produto.

## 7. Disponibilidade do site

Buscamos manter o site disponível de forma contínua, mas não garantimos operação ininterrupta. O acesso pode ser suspenso temporariamente para manutenção, atualização ou por motivos técnicos alheios ao nosso controle.

## 8. Links para sites de terceiros

O conteúdo pode conter links para sites externos, incluídos apenas quando julgamos que agregam valor informativo ao leitor.

**Não temos controle** sobre esses sites e não nos responsabilizamos por seu conteúdo, suas práticas de privacidade ou eventuais prejuízos decorrentes de sua utilização.

## 9. Publicidade

Este site exibe anúncios por meio do **Google AdSense** e pode exibir conteúdo patrocinado devidamente identificado.

Nossos compromissos editoriais:

- Anúncios são **sempre visualmente distinguíveis** do conteúdo editorial
- Conteúdo patrocinado é **identificado de forma explícita**
- A presença de anúncios **não influencia** as recomendações técnicas dos artigos
- **Não endossamos** os produtos ou serviços anunciados

Eventuais links de afiliados, quando existirem, serão claramente sinalizados.

## 10. Conteúdo enviado por usuários

Ao enviar mensagens pelo formulário de contato, você declara que:

- As informações fornecidas são verdadeiras
- O conteúdo não viola direitos de terceiros
- O conteúdo não é ofensivo, discriminatório ou ilegal

Reservamo-nos o direito de não responder e de excluir mensagens que violem estas condições.

## 11. Alterações nos termos

Estes Termos de Uso podem ser alterados a qualquer momento. A versão vigente é sempre a publicada nesta página, com a data de atualização indicada no início.

O uso continuado do site após alterações implica aceitação dos novos termos.

## 12. Legislação aplicável e foro

Estes Termos são regidos pelas leis da **República Federativa do Brasil**.

Fica eleito o foro da comarca do domicílio do usuário para dirimir eventuais controvérsias, nos termos do **Código de Defesa do Consumidor (Lei nº 8.078/1990)**.

## 13. Contato

Dúvidas sobre estes Termos de Uso podem ser enviadas para **contato@guiainterativo.com** ou pela nossa [página de contato](/contato).`,
  },
  {
    title: 'Política de Cookies',
    slug: 'politica-de-cookies',
    showInFooter: true,
    showInMenu: false,
    menuOrder: 3,
    excerpt:
      'Quais cookies o Guia Interativo utiliza, para que servem, quanto tempo duram e como você pode gerenciá-los ou desativá-los.',
    metaTitle: 'Política de Cookies — Guia Interativo',
    metaDescription:
      'Lista completa dos cookies utilizados pelo Guia Interativo: essenciais, de análise (Google Analytics) e de publicidade (Google AdSense), com prazos e como desativar.',
    content: `_Última atualização: ${HOJE}_

Esta Política de Cookies explica o que são cookies, quais utilizamos no **Guia Interativo**, com que finalidade e como você pode controlá-los.

Ela complementa a nossa [Política de Privacidade](/politica-de-privacidade).

## 1. O que são cookies

Cookies são pequenos arquivos de texto que um site armazena no seu navegador quando você o visita. Eles permitem que o site "lembre" informações entre páginas e entre visitas — como sua preferência de idioma ou o fato de você já ter aceitado um aviso.

Existem outras tecnologias semelhantes, como o **localStorage** e os **pixels de rastreamento**, que cumprem funções parecidas. Neste documento, o termo "cookies" abrange todas elas.

## 2. Classificação dos cookies

### Quanto à origem

- **Cookies próprios (first-party):** definidos pelo domínio guiainterativo.com
- **Cookies de terceiros (third-party):** definidos por outros domínios, como Google Analytics e Google AdSense

### Quanto à duração

- **Cookies de sessão:** apagados automaticamente ao fechar o navegador
- **Cookies persistentes:** permanecem por um período determinado

## 3. Cookies que utilizamos

### 3.1 Cookies estritamente necessários

Sem eles, o site não funciona corretamente. **Não podem ser desativados.**

| Cookie | Origem | Duração | Finalidade |
|---|---|---|---|
| \`gi-cookie-consent\` | Próprio | 12 meses | Registra sua escolha no aviso de cookies |
| \`next-auth.session-token\` | Próprio | 7 dias | Mantém a sessão de administradores autenticados |
| \`next-auth.csrf-token\` | Próprio | Sessão | Proteção contra ataques CSRF |
| \`gi-theme\` | Próprio | 12 meses | Guarda a preferência de tema do site |

### 3.2 Cookies de análise e desempenho

Ajudam a entender como o site é utilizado. São **opcionais** e dependem do seu consentimento.

| Cookie | Origem | Duração | Finalidade |
|---|---|---|---|
| \`_ga\` | Google Analytics | 2 anos | Distingue visitantes únicos |
| \`_ga_<ID>\` | Google Analytics | 2 anos | Mantém o estado da sessão no GA4 |
| \`_gid\` | Google Analytics | 24 horas | Distingue visitantes |
| \`_gat\` | Google Analytics | 1 minuto | Limita a taxa de requisições |

**O que fazemos com esses dados:** identificamos quais conteúdos são mais úteis, onde os leitores abandonam a leitura e quais dispositivos precisam de mais atenção no design. Os dados são agregados e não identificam você individualmente.

### 3.3 Cookies de publicidade

Utilizados pelo **Google AdSense** e por redes parceiras para exibir e medir anúncios. São **opcionais** e dependem do seu consentimento.

| Cookie | Origem | Duração | Finalidade |
|---|---|---|---|
| \`__gads\` | Google AdSense | 13 meses | Mede interações com anúncios |
| \`__gpi\` | Google AdSense | 13 meses | Personalização de anúncios |
| \`IDE\` | DoubleClick | 13 meses | Medição e personalização |
| \`test_cookie\` | DoubleClick | 15 minutos | Verifica suporte a cookies no navegador |

**Importante:** não temos controle sobre os cookies definidos por terceiros nem acesso aos dados que eles coletam. Cada rede publicitária responde pelas próprias práticas.

## 4. Como gerenciar cookies

### 4.1 Pelo aviso do site

Na primeira visita, você verá um aviso com as opções de aceitar ou recusar cookies opcionais. Sua escolha fica registrada por 12 meses e pode ser alterada a qualquer momento limpando os cookies do site.

### 4.2 Pelo seu navegador

Todos os navegadores permitem bloquear, limitar ou apagar cookies:

- **Google Chrome:** Configurações → Privacidade e segurança → Cookies e outros dados do site
- **Mozilla Firefox:** Configurações → Privacidade e Segurança → Cookies e dados de sites
- **Safari:** Preferências → Privacidade → Gerenciar dados de sites
- **Microsoft Edge:** Configurações → Cookies e permissões do site
- **Navegadores móveis:** Configurações → Privacidade → Cookies

**Atenção:** bloquear todos os cookies impede o funcionamento correto de muitos sites, inclusive deste.

### 4.3 Ferramentas específicas

- **Google Analytics:** [complemento oficial de desativação](https://tools.google.com/dlpage/gaoptout)
- **Anúncios do Google:** [adssettings.google.com](https://adssettings.google.com)
- **Rede de anunciantes (EUA):** [aboutads.info/choices](https://www.aboutads.info/choices/)
- **Rede de anunciantes (Europa):** [youronlinechoices.com](https://www.youronlinechoices.com/)

### 4.4 Navegação anônima

O modo anônimo (ou privativo) do navegador apaga automaticamente os cookies ao fechar a janela. É uma forma simples de limitar o rastreamento entre sessões.

## 5. O que acontece se você recusar

**Cookies essenciais:** continuam ativos, pois são indispensáveis ao funcionamento.

**Cookies de análise:** deixamos de saber como o site é utilizado. O conteúdo continua acessível normalmente.

**Cookies de publicidade:** os anúncios continuam sendo exibidos, mas deixam de ser personalizados com base no seu comportamento de navegação. Anúncios genéricos costumam ser menos relevantes.

## 6. Cookies e dados pessoais

Alguns cookies podem ser considerados dados pessoais sob a **LGPD**, quando permitem identificar ou tornar identificável uma pessoa natural.

Nesses casos, aplicam-se todos os direitos previstos na nossa [Política de Privacidade](/politica-de-privacidade), incluindo acesso, correção, eliminação e revogação de consentimento.

## 7. Atualizações desta política

Esta Política de Cookies pode ser atualizada sempre que houver mudança nas ferramentas utilizadas ou na legislação aplicável. A data da última revisão está indicada no início do documento.

## 8. Contato

Dúvidas sobre esta política podem ser enviadas para **contato@guiainterativo.com**.`,
  },
  {
    title: 'Aviso Legal',
    slug: 'aviso-legal',
    showInFooter: true,
    showInMenu: false,
    menuOrder: 4,
    excerpt:
      'Natureza informativa do conteúdo, limites de responsabilidade e por que nenhuma orientação publicada aqui substitui avaliação técnica presencial.',
    metaTitle: 'Aviso Legal — Guia Interativo',
    metaDescription:
      'Isenção de responsabilidade do Guia Interativo: caráter informativo do conteúdo, limites das orientações técnicas, estimativas de preço e uso por conta e risco.',
    content: `_Última atualização: ${HOJE}_

Este documento delimita o alcance das informações publicadas no **Guia Interativo** e a responsabilidade do site sobre elas. Leia com atenção antes de tomar qualquer decisão de compra, medição, instalação ou reforma com base no que publicamos.

## 1. Natureza do conteúdo

O Guia Interativo é um **portal editorial de conteúdo técnico**. Não somos fabricante, não somos loja e não somos escritório de arquitetura ou engenharia.

Tudo o que publicamos — guias, comparativos, fichas de tipos de cortinas, descrições de serviços — tem finalidade **informativa e educativa**. É material de referência para você decidir melhor, não um projeto executivo nem um laudo técnico.

## 2. O que este conteúdo NÃO substitui

Nenhum texto deste site substitui:

- **Medição presencial** feita por profissional habilitado
- **Projeto de arquitetura ou design de interiores** assinado por profissional registrado
- **Laudo técnico** de estrutura, esquadria, elétrica ou alvenaria
- **Manual e garantia do fabricante** do produto que você comprar
- **Norma técnica aplicável** ao seu caso específico
- **Orientação médica** em qualquer questão de saúde eventualmente mencionada (alergias, ácaros, qualidade do sono)

## 3. Medidas, instalação e risco

Boa parte do nosso conteúdo trata de **medição e instalação**. Sobre isso, é preciso ser explícito.

Cortinas e persianas sob medida **não admitem correção depois de fabricadas**. Se você medir por conta própria seguindo nossos guias, a responsabilidade pelas medidas é **inteiramente sua**, e a maioria dos fabricantes não aceita troca por erro de medida.

Instalação envolve **furadeira, altura e rede elétrica embutida**. Perfurar parede sem detectar tubulação pode causar choque elétrico, alagamento e dano estrutural. Se você não tem prática, contrate um instalador.

Trabalho em altura exige equipamento adequado. **Não nos responsabilizamos por acidentes** decorrentes de execução própria.

## 4. Preços e especificações

Todas as faixas de valores publicadas são **estimativas de mercado**, coletadas em pesquisa e sujeitas a variação por:

- Região do país
- Fornecedor e marca
- Tecido, mecanismo e acabamento escolhidos
- Complexidade da instalação
- Momento econômico e câmbio, em produtos importados

Use esses números como **ordem de grandeza**, jamais como orçamento. Nenhum valor aqui constitui proposta comercial.

Especificações técnicas de materiais (gramaturas, percentuais de bloqueio, desempenho térmico e acústico) baseiam-se em dados divulgados por fabricantes e em literatura de conforto ambiental. **Podem divergir** do produto específico que você adquirir.

## 5. Segurança infantil

O conteúdo sobre segurança de cordões e correntes em coberturas de janela é apresentado em caráter informativo e **não substitui** as instruções do fabricante nem as normas de segurança aplicáveis.

Se há crianças pequenas no ambiente, siga sempre as orientações do fabricante do produto instalado e mantenha berços e móveis escaláveis longe de janelas.

## 6. Ausência de garantia

O conteúdo é fornecido **"no estado em que se encontra"**. Empregamos esforço genuíno de apuração e revisão, mas não garantimos que as informações estejam:

- Livres de erros, omissões ou desatualizações
- Completas para todos os casos particulares
- Adequadas a qualquer finalidade específica sua

## 7. Limitação de responsabilidade

Na máxima extensão permitida pela legislação brasileira, o Guia Interativo **não se responsabiliza** por danos diretos, indiretos, incidentais ou lucros cessantes decorrentes de:

- Decisões de compra tomadas com base no conteúdo
- Erros de medição feitos pelo leitor
- Execução própria de instalação
- Indisponibilidade temporária do site
- Conteúdo de sites de terceiros acessados a partir daqui

Esta limitação **não afeta** os direitos assegurados ao consumidor pela Lei nº 8.078/1990 quanto aos serviços efetivamente contratados junto a nós.

## 8. Serviços prestados

As páginas de **Serviços** descrevem trabalhos que efetivamente prestamos. Sobre esses serviços contratados aplicam-se, integralmente, as garantias legais e contratuais cabíveis — o presente aviso trata apenas do **conteúdo editorial gratuito** do site.

## 9. Links e marcas de terceiros

Links para sites externos são incluídos quando agregam valor informativo. **Não temos controle** sobre esse conteúdo e não endossamos produtos, serviços ou opiniões ali veiculados.

Marcas citadas — de fabricantes, tecidos, sistemas ou assistentes de voz — pertencem aos respectivos titulares e são mencionadas em caráter **descritivo**, sem vínculo comercial implícito.

## 10. Publicidade

Este site exibe anúncios do Google AdSense. **Não temos controle editorial** sobre quais anúncios aparecem e **não endossamos** os produtos anunciados. A presença de publicidade não influencia as recomendações técnicas publicadas.

## 11. Contato

Dúvidas sobre este aviso: **contato@guiainterativo.com**.

Este documento deve ser lido em conjunto com os [Termos de Uso](/termos-de-uso), a [Política de Privacidade](/politica-de-privacidade) e a [Política Editorial](/politica-editorial).`,
  },
  {
    title: 'Política Editorial',
    slug: 'politica-editorial',
    showInFooter: true,
    showInMenu: false,
    menuOrder: 5,
    excerpt:
      'Como as pautas nascem, como apuramos as informações técnicas, como revisamos e corrigimos, e por que a publicidade não interfere no conteúdo.',
    metaTitle: 'Política Editorial — Guia Interativo',
    metaDescription:
      'Critérios editoriais do Guia Interativo: origem das pautas, fontes de apuração, revisão, correção de erros, independência em relação a anunciantes e uso de IA.',
    content: `_Última atualização: ${HOJE}_

Esta política descreve **como o conteúdo do Guia Interativo é produzido**. Ela existe para que você possa avaliar a confiabilidade do que lê aqui — e para nos manter responsáveis pelo que publicamos.

## 1. A quem servimos

Nosso leitor é quem precisa **decidir**: escolher um sistema de cortina, medir uma janela, entender por que o quarto continua claro às seis da manhã.

Escrevemos para essa pessoa, não para mecanismos de busca e não para anunciantes. Quando os dois interesses conflitam, **o leitor vence**.

## 2. Como as pautas nascem

As pautas vêm de **dúvidas reais e recorrentes**, identificadas em:

- Perguntas repetidas em atendimento e no formulário de contato
- Buscas que trazem visitantes ao site
- Erros que vemos acontecer com frequência em campo
- Lacunas evidentes no material disponível em português

Não publicamos texto apenas porque um termo tem volume de busca. Se não temos o que acrescentar sobre um assunto, não escrevemos sobre ele.

## 3. Como apuramos

Cada conteúdo técnico é construído a partir de:

- **Fichas técnicas de fabricantes** (composição, gramatura, fator de abertura, torque, bloqueio de UV)
- **Normas e regulamentos aplicáveis**, quando existem
- **Literatura de conforto ambiental** para desempenho térmico e acústico
- **Prática de campo** de instaladores, medidores e projetistas
- **Verificação cruzada** entre pelo menos duas fontes independentes para números relevantes

Quando um dado é estimativa, **dizemos que é estimativa**. Quando há divergência entre fontes, apresentamos a faixa em vez de escolher um número conveniente.

## 4. O que sempre declaramos

Todo material do site segue quatro regras fixas:

1. **Limitações aparecem.** Cada tipo de cortina traz desvantagens reais. Nenhum produto é apresentado como solução universal.
2. **Expectativa é calibrada.** Se uma cortina acústica reduz 5 a 12 dB, dizemos isso — e dizemos também o que ela não resolve.
3. **Contexto regional é sinalizado.** Preços, disponibilidade e clima variam no Brasil, e o texto avisa quando isso importa.
4. **Datas ficam visíveis.** Todo artigo mostra quando foi atualizado pela última vez.

## 5. Autoria

Os conteúdos são assinados pela equipe editorial do Guia Interativo. A página de cada artigo identifica o autor responsável e traz sua descrição.

Não publicamos conteúdo assinado por terceiros sem identificação clara, e não usamos autores fictícios.

## 6. Uso de inteligência artificial

Ferramentas de IA podem ser usadas como apoio em etapas auxiliares — organização de estrutura, revisão gramatical, sugestão de títulos.

**Nenhum conteúdo é publicado sem revisão humana.** A apuração técnica, a verificação de números e a decisão final sobre o que é afirmado são sempre de responsabilidade da equipe editorial. Não publicamos texto gerado automaticamente e não revisado.

## 7. Atualização e correção

Conteúdo técnico envelhece: preços mudam, tecnologias surgem, normas são revisadas.

**Revisão periódica.** Cada artigo é reavaliado com regularidade. Quando algo muda, o texto muda junto e a data de atualização é alterada.

**Correção de erros.** Se identificarmos um erro relevante, corrigimos e sinalizamos a correção no próprio artigo. Não apagamos silenciosamente informação incorreta que já circulou.

**Você pode nos avisar.** Correções enviadas por leitores são levadas a sério. Use o assunto "Correção de conteúdo" na [página de contato](/contato), indicando a página e o trecho.

## 8. Independência em relação à publicidade

O site é sustentado por publicidade do Google AdSense e pela prestação dos serviços técnicos descritos em [Serviços](/servicos). Sobre isso, nossos compromissos:

- **Anunciantes não têm influência** sobre o conteúdo editorial
- **Não sabemos, nem controlamos**, quais anúncios o Google exibe em cada página
- **Anúncios são sempre rotulados** e visualmente separados do texto
- **Conteúdo patrocinado**, se existir, será identificado de forma explícita no topo da página
- **Links de afiliados**, se existirem, serão sinalizados

Nenhum artigo é escrito para favorecer um fornecedor específico, e nenhuma recomendação técnica muda em função de receita.

## 9. Conflito de interesses

Prestamos serviços de consultoria, medição, instalação, automação, manutenção e confecção. Isso cria um conflito potencial: poderíamos escrever conteúdo que empurra o leitor para nossos serviços.

Nossa resposta é editorial: os guias ensinam a **fazer sozinho** sempre que fazer sozinho é viável — inclusive medir e instalar. Quando recomendamos contratar profissional, explicamos o motivo técnico, e você é livre para contratar quem quiser.

## 10. O que não publicamos

- Conteúdo copiado ou reescrito a partir de outros sites
- Afirmações de desempenho sem base em fonte verificável
- Promessas de resultado que o produto não entrega
- Conteúdo sensacionalista ou títulos que não correspondem ao texto

## 11. Contato

Sugestões de pauta, correções e críticas: **contato@guiainterativo.com** ou pela [página de contato](/contato).`,
  },
  {
    title: 'Direitos Autorais',
    slug: 'direitos-autorais',
    showInFooter: true,
    showInMenu: false,
    menuOrder: 6,
    excerpt:
      'Titularidade do conteúdo, licença das fotografias, o que você pode reutilizar com atribuição e como solicitar remoção de material.',
    metaTitle: 'Direitos Autorais — Guia Interativo',
    metaDescription:
      'Política de direitos autorais do Guia Interativo: titularidade dos textos, licença das imagens, uso permitido com atribuição e procedimento de notificação.',
    content: `_Última atualização: ${HOJE}_

Esta página esclarece a quem pertence o material publicado no **Guia Interativo**, o que você pode reutilizar e como proceder se entender que algum conteúdo aqui viola direitos seus.

## 1. Titularidade do conteúdo

Todo o conteúdo original deste site é protegido pela **Lei nº 9.610/1998 (Lei de Direitos Autorais)** e pertence ao Guia Interativo. Isso inclui:

- Textos de artigos, guias e comparativos
- Descrições dos tipos de cortinas e persianas
- Descrições de serviços, etapas e perguntas frequentes
- Tabelas, checklists e critérios de decisão
- Estrutura de navegação e organização do catálogo
- Identidade visual, logotipo e código-fonte

## 2. Imagens

As **fotografias** utilizadas no site são obtidas no [Unsplash](https://unsplash.com) e usadas sob a **Licença Unsplash**, que permite uso gratuito, inclusive comercial, sem necessidade de permissão prévia.

A relação completa das imagens, com o nome de cada fotógrafo e o link para o arquivo original, está publicada no repositório do projeto. Atribuição não é exigida pela licença, mas mantemos a lista como cortesia a quem produziu as fotos.

O **logotipo**, o favicon e os ícones ilustrativos são criações próprias do Guia Interativo.

## 3. O que você pode fazer livremente

Sem pedir autorização, você pode:

- **Ler, consultar e imprimir** conteúdo para uso pessoal
- **Compartilhar links** para nossas páginas em qualquer canal
- **Citar trechos curtos** — até cerca de 300 caracteres — desde que com **atribuição clara ao Guia Interativo e link para a página original**
- **Referenciar** nossos dados em trabalhos acadêmicos, com citação da fonte

## 4. O que exige autorização

É necessária autorização prévia e por escrito para:

- Reproduzir artigos, guias ou fichas **na íntegra ou em parte substancial**
- Utilizar o conteúdo em **material comercial**, apresentações de venda ou catálogos
- **Traduzir** o conteúdo para outros idiomas
- Utilizar o conteúdo para **treinar modelos de linguagem** ou alimentar bases de dados comerciais
- Realizar **raspagem automatizada** (scraping) do site ou do banco de dados

Solicitações: **contato@guiainterativo.com**, com o assunto "Autorização de uso".

## 5. O que é vedado

Independentemente de finalidade:

- Republicar conteúdo apresentando-o como próprio
- Remover, ocultar ou alterar créditos e avisos de autoria
- Reproduzir o conteúdo em sites que agregam material de terceiros sem valor editorial próprio
- Utilizar a marca **Guia Interativo** de forma que sugira parceria, endosso ou vínculo inexistente

## 6. Marcas de terceiros

Marcas, nomes comerciais e denominações de produtos citados — de fabricantes, tecidos, sistemas construtivos ou plataformas de automação — pertencem aos respectivos titulares.

São mencionados exclusivamente em caráter **descritivo e informativo**, ao amparo do uso nominativo legítimo, sem qualquer vínculo comercial, patrocínio ou endosso implícito.

## 7. Notificação de violação

Se você é titular de direitos autorais e entende que algum material publicado aqui viola esses direitos, entre em contato pelo e-mail **contato@guiainterativo.com** com o assunto "Notificação de direitos autorais", informando:

1. **Identificação da obra** supostamente violada
2. **URL exata** da página deste site onde o material aparece
3. **Comprovação de titularidade** ou de representação do titular
4. **Dados de contato** para retorno
5. **Declaração** de que a informação prestada é verdadeira

Analisamos toda notificação e, quando procedente, **removemos ou corrigimos o material em até 5 dias úteis**, informando você do desfecho.

## 8. Se encontrar nosso conteúdo copiado

Agradecemos o aviso. Se você encontrar textos deste site republicados sem autorização em outro domínio, escreva para **contato@guiainterativo.com** com o link. Levamos plágio a sério — não apenas por direito autoral, mas porque conteúdo duplicado prejudica quem produziu o original.

## 9. Contato

**E-mail:** contato@guiainterativo.com
**Site:** guiainterativo.com

Este documento complementa os [Termos de Uso](/termos-de-uso) e deve ser lido em conjunto com eles.`,
  },
];

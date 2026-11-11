/**
 * Quadro de Missão: the text pools the generator mixes into a poster.
 * Everything here is new flavor text written for the module (the book only gives the rules);
 * the places and residents follow the descriptions of Candeh'ssa (pp. 28-45).
 *
 * Placeholders, filled by generator.mjs:
 *   {npc} requester · {estab} place name · {a_estab} {de_estab} {na_estab} the place with article
 *   {a_masmorra} {na_masmorra} {da_masmorra} the target dungeon ("a próxima masmorra"...)
 *   {a_camara} {na_camara} {da_camara} the numbered chamber · {item} {oficio} {criatura}
 *   {motivo} {razao} {pessoa} {ritual} {fenomeno} {pericia} {cd} {espacos}
 * A placeholder written with a capital letter ({A_masmorra}, {Pessoa}) is capitalized.
 * Texts avoid gendered words about the residents, whose pronouns the book does not always give.
 */

export const TITLES = {
  manufatura: ["Encomenda especial", "Procura-se artesão aventureiro", "Mãos habilidosas, paga justa", "Um trabalho que só se faz lá dentro"],
  escolta: ["Procura-se escolta", "Companhia para uma jornada perigosa", "Guarda-costas para a masmorra", "Ninguém deve ir sozinho"],
  entrega: ["Entrega urgente", "Encomenda para as profundezas", "Procura-se mensageiro corajoso", "Leve isto até lá"],
  caca: ["Procura-se fera", "Caçada!", "Recompensa por uma presa", "Troféu desejado"],
  ritual: ["Rito pendente", "Cerimônia nas profundezas", "Procura-se oficiante", "Um rito que não pode esperar"],
  recuperacao: ["Objeto perdido", "Recompensa pela devolução", "Recupere o que é nosso", "Achados e perdidos"],
  resgate: ["Desaparecido!", "Socorro!", "Resgate urgente", "Alguém ficou para trás"],
  pesquisa: ["Procura-se observador", "Estudo de campo", "Registro de fenômeno", "Pesquisa nas profundezas"]
};

/** The core paragraph of each objective. */
export const CORE = {
  manufatura: [
    "{Npc} precisa de {item}, e isso só pode ser feito {na_camara} {da_masmorra}. Os materiais já estão separados; falta quem tenha mãos firmes e coragem para trabalhar lá dentro.",
    "Os materiais e as instruções estão prontos. O que falta é chegar até {a_camara} {da_masmorra}, o único lugar onde se pode fabricar {item}. Um dia inteiro de trabalho, com cuidado.",
    "Procura-se quem fabrique {item}. O trabalho leva um dia e precisa ser feito {na_camara} {da_masmorra}. {Na_estab}, entregamos tudo o que for preciso."
  ],
  escolta: [
    "{Npc} {motivo} e, para isso, precisa atravessar {a_masmorra} do começo ao fim. Procura-se um grupo disposto a levar companhia e a trazê-la de volta.",
    "Procura-se escolta! {Npc} vai entrar {na_masmorra} porque {motivo}, e procura aventureiros que garantam o caminho até a saída.",
    "Não é um passeio, e todos sabem disso. Mas {npc} {motivo}, e a única chance é seguir com quem já enfrenta {a_masmorra}."
  ],
  entrega: [
    "Precisamos que {item} chegue até {a_camara} {da_masmorra}. Não abram a encomenda, não a percam e, por tudo o que é sagrado, não a deixem para trás.",
    "Encomenda para as profundezas: {item}. O destino é {a_camara} {da_masmorra}. Pode ser que algo monte guarda por lá.",
    "{Npc} prometeu entregar {item} {na_camara} {da_masmorra}, e promessa em Candeh’ssa é coisa séria. Falta só quem leve."
  ],
  caca: [
    "Procura-se {criatura}. A presa ronda {a_masmorra} e é mais esperta e resistente que as outras da sua espécie. {Npc} quer a presa abatida e trazida até Candeh’ssa.",
    "Recompensa por {criatura}! Abatam a presa {na_masmorra} e tragam o corpo até {a_estab}.",
    "Dizem que {criatura} anda dando trabalho {na_masmorra}. {Npc} quer a presa abatida e trazida até a cidade, como prova."
  ],
  ritual: [
    "{Na_camara} {da_masmorra}, é preciso realizar {ritual}. O rito leva algumas horas e pede alguém que entenda de {pericia}.",
    "{Npc} precisa de alguém que conduza, {na_camara} {da_masmorra}, {ritual}. Nada de improviso: um rito malfeito cobra o seu preço de quem o conduz.",
    "Há um rito por fazer {na_camara} {da_masmorra}: {ritual}. Horas de cânticos e gestos precisos, longe de qualquer ajuda."
  ],
  recuperacao: [
    "{Item} está {na_camara} {da_masmorra} e precisa voltar para casa. Quem trouxer será bem recompensado.",
    "Recompensa pela devolução de {item}! A última pista aponta para {a_camara} {da_masmorra}.",
    "{Npc} quer de volta {item}, que hoje repousa {na_camara} {da_masmorra}. Cuidado: os moradores de lá não vão gostar de ver a peça sair."
  ],
  resgate: [
    "{Pessoa} entrou {na_masmorra} e não voltou. A última notícia vem {da_camara}. Tragam de volta com vida, por favor.",
    "Socorro! {Pessoa} está {na_camara} {da_masmorra} e precisa de resgate. Cada hora conta.",
    "Alguém ficou para trás: {pessoa}. O rastro termina {na_camara} {da_masmorra}. Quem encontrar, que traga para casa."
  ],
  pesquisa: [
    "Há relatos de {fenomeno} {na_camara} {da_masmorra}. Precisamos de um registro cuidadoso: horas de observação, anotações e nenhuma pressa.",
    "{Npc} quer entender o que acontece {na_camara} {da_masmorra}: {fenomeno}. Observem, anotem e tragam tudo por escrito.",
    "Procura-se olhar atento para registrar {fenomeno}, {na_camara} {da_masmorra}. Quem entender de {pericia} sai na frente."
  ]
};

/** The closing line of each reward (in the voice of the poster). */
export const REWARD_FLAVOR = {
  informacao: [
    "Em troca, {npc} compartilha uma informação valiosa com quem cumprir.",
    "O pagamento é em segredos: {npc} sabe de coisas que pouca gente sabe."
  ],
  favor: [
    "{Npc} fica devendo um favor a quem cumprir.",
    "Quem cumprir ganha um favor de {npc}, e favores em Candeh’ssa são levados a sério."
  ],
  riqueza: [
    "Pagamento em riquezas, como manda a tradição da Guilda.",
    "Uma bolsa pesada aguarda quem cumprir."
  ],
  item: [
    "Um item do tesouro {de_estab} aguarda quem cumprir.",
    "Quem cumprir leva um objeto de valor guardado para a ocasião."
  ],
  ambos: [
    "Riquezas e um item do tesouro {de_estab} aguardam quem cumprir.",
    "Pagamento dobrado: uma bolsa pesada e um objeto de valor."
  ],
  afinidade: [
    "A gratidão {de_estab} será lembrada por muito tempo.",
    "{Npc} nunca esquece quem ajuda a casa."
  ],
  poder: [
    "{Npc} promete ensinar um truque ou dois a quem cumprir.",
    "Quem cumprir sai daqui mais preparado do que chegou."
  ]
};

/** The rules text of each reward (p. 34), shown on the poster under "Recompensa". */
export const REWARD_RULES = {
  informacao: "Informação: uma dica para se aproximar de um morador, o Agrado dos Deuses de uma das próximas masmorras ou um aviso sobre perigos futuros. Quem cumprir escolhe; o mestre aprova.",
  favor: "Favor de um morador {de_estab}: um uso adicional da honraria, a ajuda dele como parceiro na próxima masmorra ou outro favor aprovado pelo mestre.",
  riqueza: "Tesouro (riqueza): role na tabela Tesouros (Tormenta20, p. 328), coluna de riquezas, na linha do seu nível.",
  item: "Tesouro (item): role na tabela Tesouros (Tormenta20, p. 328), coluna de itens, na linha do seu nível.",
  ambos: "Tesouro (ambos): role na tabela Tesouros (Tormenta20, p. 328), colunas de riquezas e de itens, na linha do seu nível.",
  afinidade: "Afinidade: 1d4 Pontos de Afinidade com um morador {de_estab} à sua escolha (só uma vez por morador).",
  poder: "Poder: um benefício de treinamento, definido aleatoriamente, até o fim da próxima masmorra."
};

/** Generic pools, mixed with the place's own pools. */
export const GENERIC = {
  entrega: ["um pacote embrulhado em lona e barbante", "uma caixa lacrada com cera púrpura", "uma carta selada para alguém que vive lá dentro"],
  recuperacao: ["um medalhão de família", "uma caixinha de lembranças", "um objeto que alguém jura ter deixado lá"],
  resgate: ["um morador de Candeh’ssa que atravessou o portal por engano", "um curioso que seguiu os últimos heróis"],
  manufatura: [{ item: "um marco de pedra com runas de proteção", oficio: "artesão" }],
  ritual: [
    { desc: "um rito de proteção para quem passar por lá depois", pericia: "Misticismo" },
    { desc: "uma prece aos deuses do lugar", pericia: "Religião" }
  ],
  pesquisa: [
    { desc: "uma luz púrpura que pulsa sozinha", pericia: "Investigação" },
    { desc: "sons que imitam vozes conhecidas", pericia: "Conhecimento" },
    { desc: "pegadas que surgem e somem no chão", pericia: "Sobrevivência" }
  ],
  greet: ["Aviso afixado pela Guilda de Candeh’ssa:", "Atenção, Libertadores!"],
  sign: ["Detalhes no balcão da Guilda.", "Aceitar, entregar ou desistir: só no balcão da Guilda."]
};

/**
 * The pools of each place. `escolta` and `caca` are clauses about the requester:
 * escolta = what {npc} wants to do there (starts with a verb); caca = why the place wants the prey.
 */
export const PLACES = {
  taverna: {
    greet: ["Aos frequentadores da Taverna!", "Do balcão da Taverna, com um pedido sério (desta vez)."],
    sign: ["A primeira rodada na volta é por conta da casa!", "Procurem o balcão para os detalhes."],
    entrega: ["um barril lacrado do hidromel da casa", "uma garrafa de licor estrelado", "um baralho embrulhado em seda vermelha"],
    recuperacao: ["a caneca de prata do primeiro brinde de Candeh’ssa", "um dado de osso que nunca perdeu uma aposta", "um alaúde esquecido por um bardo apressado"],
    manufatura: [
      { item: "um barril que conserva qualquer bebida gelada", oficio: "artesão" },
      { item: "um ensopado que só apura no calor do lugar", oficio: "cozinheiro" }
    ],
    resgate: ["um bardo que foi buscar inspiração e não voltou", "um ajudante da cozinha que seguiu um grupo de aventureiros às escondidas"],
    escolta: ["quer ver com os próprios olhos as histórias contadas no balcão", "precisa colher um tempero raro que só cresce lá dentro"],
    caca: ["A cabeça vai ficar sobre a lareira, para todo mundo ver.", "A história vai render rodadas e rodadas de conversa."],
    ritual: [{ desc: "um brinde cerimonial em memória dos heróis que caíram", pericia: "Religião" }],
    pesquisa: [{ desc: "uma música que, dizem, toca sozinha", pericia: "Conhecimento" }]
  },
  estalagem: {
    greet: ["Aviso aos hóspedes da Estalagem:", "Com licença, viajantes: um pedido da Estalagem."],
    sign: ["Cama quente e quarto limpo esperam a volta.", "Procurem a recepção para os detalhes."],
    entrega: ["uma lamparina de cerâmica pintada à mão", "um mapa antigo enrolado num tubo de couro", "um jogo de lençóis bordados"],
    recuperacao: ["a chave-mestra da Estalagem, levada por engano", "um vaso de cerâmica de estimação", "o livro de hóspedes mais antigo da cidade"],
    manufatura: [
      { item: "um travesseiro de penas que garante sono sem pesadelos", oficio: "artesão" },
      { item: "um vaso moldado com o barro do lugar", oficio: "artesão" }
    ],
    resgate: ["um hóspede sonâmbulo que atravessou o portal dormindo", "um carregador que foi buscar a bagagem de um aventureiro"],
    escolta: ["quer desenhar um mapa de verdade, feito no próprio lugar", "precisa conferir um caminho que só conhece de ouvir falar"],
    caca: ["Ninguém dorme tranquilo sabendo que aquilo anda por aí.", "Os hóspedes merecem noites sem esse pesadelo."],
    ritual: [{ desc: "uma bênção de repouso para quem dorme longe de casa", pericia: "Religião" }],
    pesquisa: [{ desc: "um sono estranho que toma quem descansa ali", pericia: "Investigação" }]
  },
  laboratorio: {
    greet: ["Atenção, aventureiros! (Ignorem a fumaça colorida.)", "Do Laboratório, com urgência e cuidado com o frasco azul."],
    sign: ["Explosões na volta não são culpa nossa.", "Procurem o casebre das chaminés coloridas."],
    entrega: ["uma caixa de frascos acolchoados que não pode tremer", "um invento de engrenagens que precisa ser ligado no lugar certo", "um alambique desmontado em três volumes"],
    recuperacao: ["um caderno de fórmulas levado por uma explosão", "o protótipo de um invento que saiu andando sozinho", "um cristal catalisador que sumiu num experimento"],
    manufatura: [
      { item: "um elixir que só estabiliza no ar do lugar", oficio: "alquimista" },
      { item: "uma engenhoca de medição calibrada no próprio local", oficio: "engenhoqueiro" }
    ],
    resgate: ["um aprendiz que foi buscar um reagente raro", "uma cobaia voluntária, já arrependida"],
    escolta: ["precisa medir a energia do lugar com os próprios instrumentos", "quer testar um invento novo onde ele faz diferença de verdade"],
    caca: ["Os componentes dessa presa valem mais que qualquer reagente da estante.", "Tem experimento esperando por essa presa."],
    ritual: [{ desc: "a ativação de um círculo alquímico de transmutação", pericia: "Misticismo" }],
    pesquisa: [{ desc: "uma névoa que muda de cor conforme quem a atravessa", pericia: "Investigação" }]
  },
  templo: {
    greet: ["Em nome das vinte colunas do Templo:", "Que os deuses guiem quem ler este aviso."],
    sign: ["Os deuses observam.", "O Templo atende a qualquer hora."],
    entrega: ["um relicário de prata com cinzas consagradas", "uma vela votiva que não pode se apagar", "um ícone sagrado envolto em linho"],
    recuperacao: ["um cálice consagrado roubado do altar", "o símbolo sagrado de um sacerdote que nunca voltou", "um pergaminho de orações muito antigo"],
    manufatura: [
      { item: "um incensário moldado com metal consagrado no local", oficio: "artesão" },
      { item: "um símbolo sagrado forjado diante de um altar esquecido", oficio: "armeiro" }
    ],
    resgate: ["um noviço que foi rezar onde não devia", "um peregrino que confundiu o portal com um santuário"],
    escolta: ["quer rezar diante de um altar que nunca visitou", "precisa consagrar um lugar onde a fé anda esquecida"],
    caca: ["A criatura profanou um lugar sagrado e precisa responder por isso.", "Há uma oferenda que só se completa com essa presa."],
    ritual: [
      { desc: "uma oração de purificação diante de um altar profanado", pericia: "Religião" },
      { desc: "um rito de passagem para as almas presas no lugar", pericia: "Religião" }
    ],
    pesquisa: [{ desc: "visões que aparecem a quem reza ali", pericia: "Conhecimento" }]
  },
  biblioteca: {
    greet: ["Silêncio, por favor. E leiam com atenção:", "Da Biblioteca, um pedido erudito."],
    sign: ["Devolução no prazo, por favor.", "Procurem o balcão de consulta."],
    entrega: ["um tomo raro que precisa voltar à estante de onde veio", "um tinteiro de tinta que nunca seca", "uma caixa de pergaminhos selados"],
    recuperacao: ["o volume que falta numa coleção de doze", "um pergaminho com uma magia esquecida", "as anotações de um sábio desaparecido"],
    manufatura: [
      { item: "um livro encadernado com o papel do lugar", oficio: "escriba" },
      { item: "uma tinta mágica preparada no próprio local", oficio: "alquimista" }
    ],
    resgate: ["um copista que foi conferir uma citação no lugar errado", "um estudante distraído que atravessou o portal lendo"],
    escolta: ["precisa ler uma inscrição que nenhum desenho conseguiu copiar", "quer catalogar pessoalmente o que vive lá dentro"],
    caca: ["A criatura merece um estudo completo, de preferência sem morder o pesquisador.", "Falta essa presa no bestiário da casa."],
    ritual: [{ desc: "a leitura de um texto que só vale se recitado no lugar certo", pericia: "Misticismo" }],
    pesquisa: [
      { desc: "inscrições que mudam de lugar quando ninguém está olhando", pericia: "Conhecimento" },
      { desc: "pegadas de uma criatura que nenhum bestiário descreve", pericia: "Sobrevivência" }
    ]
  },
  oficina: {
    greet: ["Da Oficina, entre uma martelada e outra:", "Atenção, aventureiros de braço forte!"],
    sign: ["A forja fica acesa até a volta.", "Procurem o pátio da forja."],
    entrega: ["uma bigorna pequena que precisa ficar no lugar certo", "uma lâmina recém-forjada embrulhada em couro", "um conjunto de ferramentas de mestre"],
    recuperacao: ["um martelo de forja que pertenceu a um mestre antigo", "um molde de armadura que não pode ser refeito", "uma lima de adamante esquecida numa expedição"],
    manufatura: [
      { item: "uma lâmina temperada no calor do lugar", oficio: "armeiro" },
      { item: "uma peça de armadura moldada com o metal do local", oficio: "armeiro" },
      { item: "uma ferramenta de precisão feita com madeira rara de lá", oficio: "artesão" }
    ],
    resgate: ["um aprendiz que foi buscar minério e não voltou", "um ferreiro errante que jurou achar o metal perfeito"],
    escolta: ["quer conhecer o metal das masmorras antes de trabalhar com ele", "precisa ver de perto uma arma lendária"],
    caca: ["Couro, ossos e presas viram peças que nenhum mercador tem.", "Tem uma bancada inteira esperando por esse material."],
    ritual: [{ desc: "a têmpera ritual de uma lâmina sob a luz de um altar", pericia: "Religião" }],
    pesquisa: [{ desc: "um metal que muda de forma conforme a temperatura", pericia: "Investigação" }]
  },
  churrascaria: {
    greet: ["Da Churrascaria, com fome de aventura:", "Aviso da Churrascaria (o cheiro está ótimo, obrigado)."],
    sign: ["Prato cheio na volta!", "Procurem a grelha."],
    entrega: ["um caldeirão de caldo quente para alguém que espera lá dentro", "uma marmita encantada que não esfria", "um saco de sal grosso abençoado"],
    recuperacao: ["o espeto de prata da casa", "um livro de receitas de família", "um pote de especiarias raras"],
    manufatura: [
      { item: "um assado que só fica perfeito no fogo do lugar", oficio: "cozinheiro" },
      { item: "uma conserva preparada com ingredientes colhidos no local", oficio: "cozinheiro" }
    ],
    resgate: ["um ajudante que foi buscar ingredientes frescos", "um cliente que saiu sem pagar e sem saber para onde ia"],
    escolta: ["quer provar ingredientes que só existem lá dentro", "precisa colher uma erva para o próximo misturadinho"],
    caca: ["Dizem que a carne dessa presa rende o melhor churrasco de Candeh’ssa.", "Tem espeto esperando por essa presa."],
    ritual: [{ desc: "uma oferenda de banquete aos deuses do lugar", pericia: "Religião" }],
    pesquisa: [{ desc: "um cheiro irresistível que sai de uma câmara vazia", pericia: "Sobrevivência" }]
  },
  casaDeBanho: {
    greet: ["Da Casa de Banho, com perfume e discrição:", "Psiu! Um pedido da Casa de Banho."],
    sign: ["Uma toalha quentinha espera a volta.", "Discrição garantida."],
    entrega: ["um frasco de perfume raro para uma cliente exigente", "uma toalha bordada com fios de ouro", "um pacote de sais de banho encantados"],
    recuperacao: ["um pente de marfim que guarda muitos segredos", "um frasco de essência que sumiu sem deixar cheiro", "um tricô favorito, ainda inacabado"],
    manufatura: [
      { item: "um óleo perfumado que só se fixa no ar do lugar", oficio: "alquimista" },
      { item: "sais de banho cristalizados no próprio local", oficio: "alquimista" }
    ],
    resgate: ["uma massagista que foi atrás de uma flor rara", "um cliente que saiu do banho direto para o portal"],
    escolta: ["morre de curiosidade de ver as masmorras por dentro", "quer descobrir um segredo que só se sussurra lá dentro"],
    caca: ["Ninguém relaxa sabendo que aquilo anda por aí.", "Os clientes andam comentando, e isso não é bom para a casa."],
    ritual: [{ desc: "um banho ritual de purificação numa fonte esquecida", pericia: "Religião" }],
    pesquisa: [{ desc: "uma fonte de água morna que cura e assusta ao mesmo tempo", pericia: "Investigação" }]
  },
  antiquario: {
    greet: ["Do Antiquário, para olhos que sabem o valor das coisas:", "Raridade procura dono. Ou melhor: dono procura raridade."],
    sign: ["Atendimento de dia e de noite.", "Peças raras, preços justos."],
    entrega: ["um espelho antigo que precisa voltar ao lugar onde foi feito", "uma caixa de música com uma maldição pequena", "um amuleto que não gosta de ficar longe de casa"],
    recuperacao: ["uma joia que pertenceu a uma rainha esquecida", "um anel que sumiu do mostruário sozinho", "a peça que falta num conjunto de sete"],
    manufatura: [
      { item: "uma réplica perfeita de uma relíquia, moldada diante do original", oficio: "artesão" },
      { item: "um engaste de gema que só aceita a luz do lugar", oficio: "joalheiro" }
    ],
    resgate: ["um avaliador que foi conferir uma peça no lugar dela", "um colecionador que não resistiu a um boato"],
    escolta: ["quer ver uma relíquia no lugar onde ela nasceu", "precisa avaliar uma peça que não pode ser removida"],
    caca: ["A presa carrega algo valioso, e o Antiquário quer saber o quê.", "Peças assim não aparecem duas vezes."],
    ritual: [{ desc: "o desencantamento de uma peça amaldiçoada no lugar onde foi criada", pericia: "Misticismo" }],
    pesquisa: [{ desc: "objetos que aparecem e somem sem explicação", pericia: "Investigação" }]
  },
  arena: {
    greet: ["Da Arena, para quem tem coragem de verdade:", "Atenção, lutadores!"],
    sign: ["Lugar na primeira fila garantido na volta.", "Quem cumprir ganha aplausos, e algo mais."],
    entrega: ["um estandarte de campeão que deve ser fincado no lugar certo", "uma arma de duelo para um desafiante que espera lá dentro", "um cinturão de campeão"],
    recuperacao: ["uma arma exótica de coleção", "o cinturão de um campeão derrotado", "um par de manoplas lendárias"],
    manufatura: [
      { item: "uma arma de treino temperada no calor do lugar", oficio: "armeiro" },
      { item: "um troféu esculpido com a pedra do próprio local", oficio: "artesão" }
    ],
    resgate: ["um gladiador novato que foi provar seu valor cedo demais", "um treinador que seguiu um aluno teimoso"],
    escolta: ["quer meditar sobre a luta num lugar sagrado", "precisa enfrentar um desafio que só existe lá dentro"],
    caca: ["A Arena quer a presa como troféu.", "Uma presa dessas merece ser exibida no centro da Arena."],
    ritual: [{ desc: "um juramento de combate diante de um altar de guerra", pericia: "Religião" }],
    pesquisa: [{ desc: "o estilo de luta de criaturas que parecem nunca errar um golpe", pericia: "Investigação" }]
  },
  pesqueiro: {
    greet: ["Do Pesqueiro, com cheiro de lago:", "Aviso do cais do Pesqueiro."],
    sign: ["Bote grátis na volta.", "Procurem o cais."],
    entrega: ["um viveiro com peixes para um lago escondido", "uma rede de pesca encantada", "um anzol de prata para alguém que nunca pescou"],
    recuperacao: ["uma faca de filetar de lâmina perfeita", "o anzol da sorte de um pescador antigo", "uma concha que guarda o som de outro mar"],
    manufatura: [
      { item: "uma isca que só funciona se preparada no lugar", oficio: "artesão" },
      { item: "um peixe defumado no calor do próprio local", oficio: "cozinheiro" }
    ],
    resgate: ["um pescador que remou longe demais", "um aprendiz de pescador que seguiu um peixe dourado"],
    escolta: ["quer pescar numa água que nenhum anzol tocou", "precisa ver de perto um peixe raro que só vive lá dentro"],
    caca: ["A presa pode virar isca para algo muito maior.", "Faz tempo que o lago não vê algo assim."],
    ritual: [{ desc: "uma oferenda às águas para acalmar um lago agitado", pericia: "Religião" }],
    pesquisa: [{ desc: "peixes que nadam no ar de uma câmara seca", pericia: "Sobrevivência" }]
  },
  bosque: {
    greet: ["Do Bosque, em voz baixa (para não assustar ninguém):", "Um pedido do Bosque, com folhas e cuidado."],
    sign: ["Andem com cuidado e falem baixo.", "O Bosque agradece."],
    entrega: ["uma muda de árvore que precisa ser plantada no lugar certo", "um ninho com ovos para uma ave que os perdeu", "um punhado de sementes abençoadas"],
    recuperacao: ["uma flauta de madeira que acalma qualquer animal", "um ovo raro levado por um predador", "uma semente da primeira árvore de Candeh’ssa"],
    manufatura: [
      { item: "um unguento de ervas que só se colhem no lugar", oficio: "alquimista" },
      { item: "um cajado entalhado em madeira viva do local", oficio: "carpinteiro" }
    ],
    resgate: ["um filhote que se perdeu ao atravessar o portal", "um guardião do Bosque que foi atrás de um caçador"],
    escolta: ["quer conhecer a natureza que os deuses criaram lá dentro", "precisa ouvir os animais de um lugar que nunca viu"],
    caca: ["A presa ameaça o equilíbrio do lugar.", "Há bichos demais sofrendo por causa dessa presa."],
    ritual: [{ desc: "um rito de cura para uma terra ferida", pericia: "Religião" }],
    pesquisa: [{ desc: "rastros de uma criatura que ninguém conseguiu ver", pericia: "Sobrevivência" }]
  },
  mercado: {
    greet: ["Do Mercado, onde tudo se compra (quase tudo):", "Oportunidade de negócio!"],
    sign: ["Negócio fechado é negócio cumprido.", "Procurem a banca maior."],
    entrega: ["um carregamento para um comprador misterioso", "um buquê de flores que não murcha", "um baú trancado (não perguntem o conteúdo)"],
    recuperacao: ["uma balança de mercador que nunca mente", "uma bolsa de moedas de um reino que não existe mais", "um carregamento extraviado"],
    manufatura: [
      { item: "um arranjo de flores que só desabrocha no lugar", oficio: "artesão" },
      { item: "uma caixa-forte montada no próprio local", oficio: "engenhoqueiro" }
    ],
    resgate: ["um mascate que foi vender onde não devia", "um carregador que se perdeu com a encomenda"],
    escolta: ["quer conhecer as maravilhas de que os aventureiros tanto falam", "precisa fechar um negócio com alguém que vive lá dentro"],
    caca: ["Partes dessa presa valem uma pequena fortuna no Mercado.", "Tem comprador esperando por essa presa."],
    ritual: [{ desc: "uma bênção de prosperidade sobre um tesouro esquecido", pericia: "Religião" }],
    pesquisa: [{ desc: "moedas que se multiplicam (ou parecem se multiplicar)", pericia: "Investigação" }]
  },
  guilda: {
    greet: ["Requisição oficial da Guilda de Candeh’ssa:", "Aviso da Guilda (favor ler até o fim)."],
    sign: ["Requisição registrada e carimbada.", "Entregas e desistências só no balcão da Guilda."],
    entrega: ["um malote de correspondência oficial", "um selo da Guilda que marca território explorado", "um registro de expedição que precisa ficar no lugar"],
    recuperacao: ["o diário de bordo de uma expedição antiga", "um selo oficial da Guilda", "a lista de nomes de um grupo que nunca voltou"],
    manufatura: [
      { item: "um marco de pedra com o brasão da Guilda, esculpido no local", oficio: "artesão" },
      { item: "um mapa gravado em metal diante do próprio terreno", oficio: "escriba" }
    ],
    resgate: ["um explorador da Guilda que não respondeu à chamada", "um cartógrafo que foi longe demais"],
    escolta: ["precisa conferir pessoalmente uma requisição antiga", "quer registrar a expedição com os próprios olhos"],
    caca: ["A criatura está na lista de ameaças da Guilda há tempo demais.", "Os relatórios sobre essa presa já enchem uma gaveta."],
    ritual: [{ desc: "um rito de reconhecimento que marca a passagem dos Libertadores", pericia: "Misticismo" }],
    pesquisa: [{ desc: "um fenômeno citado nos relatórios de três grupos diferentes", pericia: "Investigação" }]
  }
};

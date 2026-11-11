/**
 * Quadro de Missão: rules data from "Jornada Heroica: A Libertação de Valkaria" (Jambô, 2025).
 * Page numbers are the printed pages of the book. Rule texts are short paraphrases.
 * Pure data, no Foundry calls (the generator and the tests import it).
 */

/** The three tables of "Missões Aleatórias" (p. 34). */
export const BOOK_PAGES = { missions: 33, table: 34, guild: 31, npcs: "35-45" };

/**
 * Solicitante (2d8, p. 34) and the named residents of each place (pp. 28-45).
 * `a`/`de`/`em` are the place with its article, so texts read naturally in Portuguese.
 */
export const ESTABLISHMENTS = {
  taverna: { label: "Taverna", a: "a Taverna", de: "da Taverna", em: "na Taverna", page: 32, rolls: [2, 3], icon: "fa-solid fa-beer-mug-empty", residents: ["Artemisia", "Bragi", "Nima"] },
  estalagem: { label: "Estalagem", a: "a Estalagem", de: "da Estalagem", em: "na Estalagem", page: 31, rolls: [4], icon: "fa-solid fa-bed", residents: ["Mahin"] },
  laboratorio: { label: "Laboratório", a: "o Laboratório", de: "do Laboratório", em: "no Laboratório", page: 31, rolls: [5], icon: "fa-solid fa-flask", residents: ["Frann", "Nthanda"] },
  templo: { label: "Templo", a: "o Templo", de: "do Templo", em: "no Templo", page: 33, rolls: [6], icon: "fa-solid fa-place-of-worship", residents: ["Rafiq", "Tanit"] },
  biblioteca: { label: "Biblioteca", a: "a Biblioteca", de: "da Biblioteca", em: "na Biblioteca", page: 29, rolls: [7], icon: "fa-solid fa-book", residents: ["Barossa", "Teclis", "Eh’mmed"] },
  oficina: { label: "Oficina", a: "a Oficina", de: "da Oficina", em: "na Oficina", page: 32, rolls: [8], icon: "fa-solid fa-hammer", residents: ["Harko", "Kandor", "Phylla"] },
  churrascaria: { label: "Churrascaria", a: "a Churrascaria", de: "da Churrascaria", em: "na Churrascaria", page: 30, rolls: [9], icon: "fa-solid fa-drumstick-bite", residents: ["Punddin", "Tonhão"] },
  casaDeBanho: { label: "Casa de Banho", a: "a Casa de Banho", de: "da Casa de Banho", em: "na Casa de Banho", page: 29, rolls: [10], icon: "fa-solid fa-bath", residents: ["Aaliyah"] },
  antiquario: { label: "Antiquário", a: "o Antiquário", de: "do Antiquário", em: "no Antiquário", page: 28, rolls: [11], icon: "fa-solid fa-gem", residents: ["Ashtad", "Khordad"] },
  arena: { label: "Arena", a: "a Arena", de: "da Arena", em: "na Arena", page: 28, rolls: [12], icon: "fa-solid fa-shield-halved", residents: ["Caliandre", "Juno"] },
  pesqueiro: { label: "Pesqueiro", a: "o Pesqueiro", de: "do Pesqueiro", em: "no Pesqueiro", page: 32, rolls: [13], icon: "fa-solid fa-fish", residents: ["Andris", "Nerus"] },
  bosque: { label: "Bosque", a: "o Bosque", de: "do Bosque", em: "no Bosque", page: 29, rolls: [14], icon: "fa-solid fa-tree", residents: ["Lassance", "Viridiane"] },
  mercado: { label: "Mercado", a: "o Mercado", de: "do Mercado", em: "no Mercado", page: 32, rolls: [15], icon: "fa-solid fa-store", residents: ["Lyssara", "Nahiri", "Tharuk"] },
  guilda: { label: "Guilda", a: "a Guilda", de: "da Guilda", em: "na Guilda", page: 31, rolls: [16], icon: "fa-solid fa-scroll", residents: ["Myssia"] }
};

/** Eh'mmed only shows up after the 10th dungeon or 5 guild missions (p. 37). */
export const GATED_RESIDENTS = { "Eh’mmed": { page: 37, afterDungeon: 10, afterMissions: 5 } };

/** Every named resident (for the "out of play" list). */
export const ALL_RESIDENTS = Object.values(ESTABLISHMENTS).flatMap(e => e.residents);

/** Objetivo (1d8, p. 34). Rules: p. 33. */
export const OBJECTIVES = {
  manufatura: { label: "Manufatura", roll: 1, icon: "fa-solid fa-screwdriver-wrench" },
  escolta: { label: "Escolta", roll: 2, icon: "fa-solid fa-person-walking" },
  entrega: { label: "Entrega", roll: 3, icon: "fa-solid fa-box" },
  caca: { label: "Caça", roll: 4, icon: "fa-solid fa-paw" },
  ritual: { label: "Ritual", roll: 5, icon: "fa-solid fa-hand-sparkles" },
  recuperacao: { label: "Recuperação", roll: 6, icon: "fa-solid fa-hand-holding" },
  resgate: { label: "Resgate", roll: 7, icon: "fa-solid fa-life-ring" },
  pesquisa: { label: "Pesquisa", roll: 8, icon: "fa-solid fa-feather-pointed" }
};

/**
 * Recompensa (1d6, p. 34). "Poder" is described on p. 34 but is not on the 1d6 table,
 * so it can only be chosen by hand (`roll: null`).
 */
export const REWARDS = {
  informacao: { label: "Informação", roll: 1, icon: "fa-solid fa-comment-dots" },
  favor: { label: "Favor", roll: 2, icon: "fa-solid fa-handshake" },
  riqueza: { label: "Tesouro (riqueza)", roll: 3, icon: "fa-solid fa-coins" },
  item: { label: "Tesouro (item)", roll: 4, icon: "fa-solid fa-ring" },
  ambos: { label: "Tesouro (ambos)", roll: 5, icon: "fa-solid fa-sack-dollar" },
  afinidade: { label: "1d4 PA (Afinidade)", roll: 6, icon: "fa-solid fa-heart" },
  poder: { label: "Poder (fora da tabela)", roll: null, icon: "fa-solid fa-bolt" }
};

/** Objectives whose target is a numbered chamber of the dungeon map (p. 33). */
export const CHAMBER_OBJECTIVES = new Set(["manufatura", "entrega", "ritual", "recuperacao", "resgate", "pesquisa"]);

/**
 * The 20 dungeons (Desafio N is for characters of level N). For each one:
 * page, numbered areas (the last one is the Guardian), the Agrado aos Deuses in short,
 * and the random encounter table used by Caça ("role a tabela de encontros da próxima masmorra").
 *
 * Hunt entries: `t` = target (one creature, with article), `h` = the same without the god's name
 * (used while the god is hidden from players), `r` = sheet reference, `x` = not a creature (re-roll).
 */
export const DUNGEONS = [
  null,
  {
    n: 1, god: "Allihanna", page: 53, encPage: 54, die: 6,
    agrado: "não matar nenhum habitante nem destruir grandes porções da mata (efeitos de área)", agradoPage: 53,
    areas: ["o lago", "serval assassino", "covil do urso protetor", "o santuário de Allihanna", "o druida defensor"],
    areaPages: [54, 54, 54, 56, 56],
    hunt: [
      { roll: [1], t: "uma capivara", r: "Ameaças de Arton, p. 211" },
      { roll: [2], t: "um centauro combatente", r: "Tormenta20, p. 290" },
      { roll: [3], t: "um gali-gali", r: "Ameaças de Arton, p. 247" },
      { roll: [4], t: "um lobo", r: "Tormenta20, p. 290" },
      { roll: [5], t: "um urso panda", r: "Ameaças de Arton, p. 223" },
      { roll: [6], t: "um ente (que só quer conversar)", r: "Ameaças de Arton, p. 106" }
    ]
  },
  {
    n: 2, god: "Ragnar", page: 58, encPage: 59, die: 6,
    agrado: "lutar todas as batalhas até o fim (sem fugir, render-se ou oferecer rendição) e sacrificar a prisioneira final e os resgatados", agradoPage: 58,
    areas: ["o covil dos ogros", "os orcs de Graordek", "armadilhas", "Rornagar, o Conquistador esquecido"],
    areaPages: [59, 59, 61, 61],
    hunt: [
      { roll: [1], t: "um orc combatente", r: "Ameaças de Arton, p. 33" },
      { roll: [2], t: "um orc veterano", r: "Ameaças de Arton, p. 33" },
      { roll: [3], t: "um bandido goblin", r: "Libertação de Valkaria, p. 63" },
      { roll: [4], t: "um meio-orc capanga", r: "Ameaças de Arton, p. 31" },
      { roll: [5], t: "um bugbear sentinela", r: "Ameaças de Arton, p. 79" },
      { roll: [6], t: "um hobgoblin patife", r: "Libertação de Valkaria, p. 64" }
    ]
  },
  {
    n: 3, god: "Glórienn", page: 65, encPage: 67, die: 6,
    agrado: "não roubar nem danificar arte, não pilhar os inimigos e não matar nenhum elfo", agradoPage: 65,
    areas: ["o fosso", "defensores de Glórienn", "sarau do sofrimento", "Sharin, a maga guardiã"],
    areaPages: [67, 67, 68, 68],
    hunt: [
      { roll: [1], t: "um arqueiro de Glórienn", h: "um arqueiro élfico", r: "Libertação de Valkaria, p. 69" },
      { roll: [2], t: "um caçador de Glórienn", h: "um caçador élfico", r: "Libertação de Valkaria, p. 69" },
      { roll: [3], t: "um menestrel elfo", r: "Libertação de Valkaria, p. 70" },
      { roll: [4], t: "um menestrel elfo", r: "Libertação de Valkaria, p. 70" },
      { roll: [5], t: "um arqueiro de Glórienn", h: "um arqueiro élfico", r: "Libertação de Valkaria, p. 69" },
      { roll: [6], t: "um menestrel elfo", r: "Libertação de Valkaria, p. 70" }
    ]
  },
  {
    n: 4, god: "Lena", page: 71, encPage: 72, die: 6,
    agrado: "não matar nem causar dano a nenhuma criatura (usar cura para ferir também viola)", agradoPage: 71,
    note: "As criaturas daqui têm Imunidade Vital e Vulnerabilidade a Cura (p. 71): abater a presa sem violar o Agrado é quase impossível.",
    areas: ["rios de seiva", "o covil dos dilaceradores", "câmara sem saída", "o dragonete"],
    areaPages: [72, 72, 72, 74],
    hunt: [
      { roll: [1], t: "um lobo Grande", r: "Tormenta20, p. 290 (tamanho aumentado)" },
      { roll: [2], t: "um sapo atroz Enorme", r: "Ameaças de Arton, p. 36 (tamanho aumentado)" },
      { roll: [3], t: "uma capivara Grande", r: "Ameaças de Arton, p. 211 (tamanho aumentado)" },
      { roll: [4], t: "um urso pardo Enorme", r: "Ameaças de Arton, p. 223 (tamanho aumentado)" },
      { roll: [5], t: "uma tropa de tentacutes Grande", r: "Ameaças de Arton, p. 195 (tamanho aumentado)" },
      { roll: [6], t: "um carrasco de Lena Enorme", h: "um carrasco gigantesco", r: "Ameaças de Arton, p. 103 (tamanho aumentado)" }
    ]
  },
  {
    n: 5, god: "Hyninn", page: 76, encPage: 77, die: 6,
    agrado: "cada membro do grupo passa em pelo menos um teste real (CD 20 ou mais) de Acrobacia, Enganação, Furtividade, Jogatina ou Ladinagem", agradoPage: 76,
    areas: ["armadilhas", "a gárgula suspeita", "jogo arriscado", "o primeiro tigre"],
    areaPages: [77, 80, 80, 80],
    hunt: [
      { roll: [1, 2], x: "armadilha" },
      { roll: [3], t: "uma gárgula", r: "Ameaças de Arton, p. 125" },
      { roll: [4], t: "um mímico", r: "Ameaças de Arton, p. 203" },
      { roll: [5], t: "uma gárgula assassina", r: "Ameaças de Arton, p. 125" },
      { roll: [6], t: "um tigre-de-Hyninn", h: "um tigre que caça invisível", r: "Ameaças de Arton, p. 206" }
    ]
  },
  {
    n: 6, god: "Marah", page: 83, encPage: 84, die: 6,
    agrado: "nenhuma forma de violência", agradoPage: 83,
    note: "Os habitantes de Marah são amistosos e têm Aura de Paz (p. 83): a caçada vai contra o Agrado.",
    areas: ["a festa das fadas", "o lago das elfas", "guerreiros celestiais", "o salão dos amores possíveis", "a tentação da paz"],
    areaPages: [84, 86, 86, 86, 87],
    hunt: [
      { roll: [1], t: "um sacerdote", r: "Guia de NPCs, p. 68" },
      { roll: [2], t: "um gnoll xamã de Marah", h: "um gnoll xamã", r: "Ameaças de Arton, p. 119" },
      { roll: [3], t: "uma sílfide bardo", r: "Libertação de Valkaria, p. 88" },
      { roll: [4], t: "um xamã de Sarana", r: "Ameaças de Arton, p. 268" },
      { roll: [5], t: "um mestre mercante", r: "Guia de NPCs, p. 67" },
      { roll: [6], t: "um instrumento divino de Marah", h: "um instrumento divino", r: "Ameaças de Arton, p. 133" }
    ]
  },
  {
    n: 7, god: "Tenebra", page: 89, encPage: 90, die: 6,
    agrado: "nenhuma iluminação mágica e nenhum dano de luz", agradoPage: 89,
    areas: ["câmaras da morte", "a maldição da banshee", "o mago fantasma", "o campeão das trevas"],
    areaPages: [90, 90, 92, 92],
    hunt: [
      { roll: [1], t: "um armeiro de Tenebra devoto", h: "um armeiro devoto", r: "Ameaças de Arton, p. 253" },
      { roll: [2], t: "uma aparição", r: "Tormenta20, p. 298" },
      { roll: [3], t: "um trog rei dos túneis", r: "Ameaças de Arton, p. 38" },
      { roll: [4], t: "um esqueleto", r: "Tormenta20, p. 297" },
      { roll: [5], t: "um gigante esqueleto", r: "Ameaças de Arton, p. 230" },
      { roll: [6], t: "uma garra-zumbi gigante", r: "Ameaças de Arton, p. 234" }
    ]
  },
  {
    n: 8, god: "Azgher", page: 94, encPage: 95, die: 6,
    agrado: "deixar na masmorra todo objeto de ouro que o grupo carrega e não levar o ouro de lá", agradoPage: 94,
    areas: ["a praga dos besouros", "o jardim das estátuas", "o guardião do sol"],
    areaPages: [95, 95, 95],
    hunt: [
      { roll: [1], t: "um ber-baram", r: "Ameaças de Arton, p. 95" },
      { roll: [2], t: "uma esfinge", r: "Libertação de Valkaria, p. 99" },
      { roll: [3], t: "um pamgra", r: "Ameaças de Arton, p. 98" },
      { roll: [4], t: "um celestial corrompido", r: "Libertação de Valkaria, p. 98" },
      { roll: [5], t: "uma múmia", r: "Ameaças de Arton, p. 236" },
      { roll: [6], x: "areia movediça" }
    ]
  },
  {
    n: 9, god: "Tauron", page: 100, encPage: 101, die: 6,
    agrado: "nenhuma arma ou habilidade que cause dano à distância", agradoPage: 100,
    areas: ["desafios da força", "no coração da serpente", "arena do Guardião"],
    areaPages: [101, 101, 104],
    hunt: [
      { roll: [1], t: "um centurião", r: "Ameaças de Arton, pp. 169 e 173" },
      { roll: [2], t: "um sargento dos soldados da fortuna", r: "Guia de NPCs, p. 78" },
      { roll: [3], t: "um chefe de quadrilha", r: "Ameaças de Arton, pp. 43-45" },
      { roll: [4], t: "um hobgoblin soldado", r: "Tormenta20, p. 300" },
      { roll: [5], t: "um minotauro chefe da manada", r: "Ameaças de Arton, p. 352" },
      { roll: [6], t: "um centurião de elite", r: "Ameaças de Arton, pp. 170 e 173" }
    ]
  },
  {
    n: 10, god: "Tanna-Toh", page: 106, encPage: 106, die: 0,
    agrado: "não roubar nem danificar livros e não atacar nem perturbar os habitantes (exceto o Guardião e o que ele conjura)", agradoPage: 106,
    note: "Esta masmorra não tem tabela de encontros (o crânio de cristal conjura monstros, p. 106): escolha a presa e edite o cartaz.",
    areas: ["o bardo insano", "o poder das histórias", "o Guardião do conhecimento"],
    areaPages: [107, 108, 110],
    hunt: []
  },
  {
    n: 11, god: "Lin-Wu", page: 112, encPage: 113, die: 8,
    agrado: "quem testar Enganação, Furtividade ou Ladinagem perde os PD; só armas da masmorra ou ataques desarmados", agradoPage: 112,
    areas: ["câmaras de treinamento", "jardins de meditação", "questão de honra", "o guardião"],
    areaPages: [113, 113, 116, 116],
    hunt: [
      { roll: [1, 2], t: "um mashin monge", r: "Ameaças de Arton, p. 160" },
      { roll: [3], t: "um tengu bandoleiro", r: "Ameaças de Arton, p. 164" },
      { roll: [4, 5], t: "um monge do Sonho", r: "Libertação de Valkaria, p. 116" },
      { roll: [6], t: "um mashin samurai", r: "Ameaças de Arton, p. 160" },
      { roll: [7], t: "um samurai visitante", r: "Libertação de Valkaria, p. 118" },
      { roll: [8], t: "um dragão celestial jovem", r: "Ameaças de Arton, p. 165" }
    ]
  },
  {
    n: 12, god: "Wynna", page: 119, encPage: 122, die: 6,
    agrado: "cada um deixa junto ao portal um item mágico de pelo menos T$ 18.000", agradoPage: 119,
    areas: ["os relicários", "pequenos feiticeiros", "a oficina da animadora de móveis", "o guardião das trevas"],
    areaPages: [122, 123, 123, 124],
    hunt: [
      { roll: [1], t: "um qareen tecelão de desejos", r: "Libertação de Valkaria, p. 126" },
      { roll: [2], t: "um golem de espelhos", r: "Ameaças de Arton, p. 128" },
      { roll: [3], t: "uma nagah mística", r: "Ameaças de Arton, p. 331" },
      { roll: [4], t: "um dracomante", r: "Ameaças de Arton, p. 149" },
      { roll: [5], t: "um corgann", r: "Ameaças de Arton, p. 89" },
      { roll: [6], t: "uma bruxa goblin", r: "Ameaças de Arton, p. 79" }
    ]
  },
  {
    n: 13, god: "Oceano", page: 128, encPage: 129, die: 6,
    agrado: "libertar cativos da tribo rival (1 PD por libertar um lado, 3 PD pelos dois)", agradoPage: 128,
    note: "Encontros aleatórios só acontecem em áreas neutras do mapa (p. 128).",
    areas: ["aldeia dos elfos-do-mar", "aldeia das sereias", "covil do Guardião"],
    areaPages: [129, 129, 131],
    hunt: [
      { roll: [1], t: "um selakostigre", r: "Ameaças de Arton, p. 323" },
      { roll: [2], t: "um elfo-do-mar bárbaro", r: "Libertação de Valkaria, p. 132" },
      { roll: [3], t: "uma água-viva gigante", r: "Ameaças de Arton, p. 319" },
      { roll: [4], t: "uma sereia feiticeira", r: "Libertação de Valkaria, p. 133" },
      { roll: [5], t: "uma nereida", r: "Ameaças de Arton, p. 320" },
      { roll: [6], t: "um mega-selako", r: "Ameaças de Arton, p. 323" }
    ]
  },
  {
    n: 14, god: "Thyatis", page: 134, encPage: 135, die: 6,
    agrado: "não libertar as gizzehi nem ferir o ovo de fênix", agradoPage: 134,
    note: "Em Thyatis toda criatura que morre volta à vida em 1d6+3 rodadas e fica amaldiçoada, sem poder sair da masmorra (p. 134).",
    areas: ["covis de dragões", "câmaras da profecia", "o lago dos gênios", "pássaro de fogo"],
    areaPages: [135, 135, 136, 136],
    hunt: [
      { roll: [1], t: "uma pirohidra", r: "Libertação de Valkaria, p. 139" },
      { roll: [2], t: "um ber-baram", r: "Ameaças de Arton, p. 95" },
      { roll: [3], t: "um dragão feral", r: "Ameaças de Arton, p. 72" },
      { roll: [4], t: "um serpentaar", r: "Ameaças de Arton, p. 96" },
      { roll: [5], t: "um dragão adulto", r: "Tormenta20, p. 311" },
      { roll: [6], t: "um golem de ferro superior", r: "Ameaças de Arton, p. 130" }
    ]
  },
  {
    n: 15, god: "Sszzaas", page: 140, encPage: 141, die: 6,
    agrado: "ninguém pode ajudar um companheiro (a ação ajudar ou qualquer habilidade benéfica usada em outro)", agradoPage: 140,
    areas: ["câmaras do veneno", "altar profano", "o guardião traidor"],
    areaPages: [141, 141, 143],
    hunt: [
      { roll: [1], t: "uma serpe anciã", r: "Ameaças de Arton, p. 310" },
      { roll: [2], t: "um nagah retalhador", r: "Ameaças de Arton, p. 332" },
      { roll: [3], t: "uma hidra", r: "Tormenta20, p. 306" },
      { roll: [4], t: "uma górgona matriarca", r: "Ameaças de Arton, p. 330" },
      { roll: [5], t: "um elemental do veneno grande", r: "Ameaças de Arton, p. 328" },
      { roll: [6], t: "um lagash", r: "Tormenta20, p. 306" }
    ]
  },
  {
    n: 16, god: "Keenn", page: 145, encPage: 146, die: 6,
    agrado: "nenhuma cura mágica (vencer a Área 3 perdoa as violações)", agradoPage: 145,
    areas: ["santuários de descanso", "covil de Harkash", "guerra sem fim", "batalha decisiva"],
    areaPages: [146, 147, 147, 148],
    hunt: [
      { roll: [1, 2, 3, 4], t: "um candidato do Torneio", r: "Libertação de Valkaria, p. 150" },
      { roll: [5], x: "servos dos santuários (não combatentes)" },
      { roll: [6], t: "Harkash, o demônio que patrulha os corredores", r: "Libertação de Valkaria, p. 150" }
    ]
  },
  {
    n: 17, god: "Megalokk", page: 152, encPage: 153, die: 6,
    agrado: "nenhuma perícia baseada em Inteligência e nada de Furtividade, preparar ações ou sustentar efeitos", agradoPage: 152,
    note: "Os 3 primeiros encontros sorteados nesta masmorra viram carcaças devoradas por Vorakking (p. 153).",
    areas: ["covil do rei", "totem da selvageria", "duelo territorial", "o devorador"],
    areaPages: [153, 153, 154, 156],
    hunt: [
      { roll: [1], t: "um grande tachygloss", r: "Ameaças de Arton, p. 308" },
      { roll: [2], t: "um razza’kham", r: "Ameaças de Arton, p. 309" },
      { roll: [3], t: "um oxxdon imenso", r: "Ameaças de Arton, p. 309" },
      { roll: [4], t: "um centauro xamã de Megalokk", h: "um centauro xamã", r: "Ameaças de Arton, p. 105" },
      { roll: [5], t: "uma mantícora primal", r: "Ameaças de Arton, p. 298" },
      { roll: [6], t: "um rei-tirano", r: "Ameaças de Arton, p. 251" }
    ]
  },
  {
    n: 18, god: "Nimb", page: 158, encPage: 158, die: 20,
    agrado: "não há regras: no fim, cada um escolhe par ou ímpar e rola um dado", agradoPage: 158,
    note: "Em Nimb o encontro usa 1d20 para escolher a tabela de qualquer masmorra (p. 158). O módulo rola de novo quando cai numa masmorra sem tabela (Tanna-Toh ou Khalmyr).",
    areas: ["câmaras da loucura", "jogo perigoso", "a guardiã"],
    areaPages: [159, 162, 162],
    /* The table of Nimb itself ("1d5" with 8 rows, p. 159); used when the 1d20 lands on 18. */
    hunt: [
      { roll: [1], t: "um hynne dormindo", r: "Libertação de Valkaria, p. 159" },
      { roll: [2], t: "o Goblin do Cantinho", r: "Guia de NPCs, p. 65" },
      { roll: [3], t: "um dragão bicéfalo", r: "Ameaças de Arton, p. 72" },
      { roll: [3.5], t: "um queijo", r: "Libertação de Valkaria, p. 159" },
      { roll: [4], t: "Nialandarena de Wynna", r: "Guia de NPCs, p. 39" },
      { roll: [5], t: "um vagalhão kobold", r: "Ameaças de Arton, p. 189" },
      { roll: [6], t: "um Rhandomm", r: "Ameaças de Arton, p. 113" },
      { roll: [7], t: "Tarso, o Dragão-rei dos Mortos", r: "Ameaças de Arton, p. 241" }
    ]
  },
  {
    n: 19, god: "Khalmyr", page: 164, encPage: 165, die: 0,
    agrado: "código de honra (sem flanquear, atacar caídos ou desprevenidos, mentir, roubar, veneno, Ataque Furtivo, encantamento, ilusão ou necromancia) e passar nos 5 testes", agradoPage: 164,
    note: "Khalmyr não tem encontros aleatórios (p. 165): escolha a presa e edite o cartaz.",
    areas: ["teste da bondade", "teste da percepção do mal", "teste da punição", "teste de vontade", "teste da coragem", "guardiões do mal"],
    areaPages: [165, 165, 168, 168, 168, 168],
    hunt: []
  },
  {
    n: 20, god: "Valkaria", page: 171, encPage: 172, die: 20,
    agrado: "não há", agradoPage: 172,
    note: "Os encontros daqui são réplicas de Guardiões (pp. 176-179); os itens delas somem quando são vencidas.",
    areas: ["cofres do tesouro", "rio de lágrimas", "desafio final"],
    areaPages: [172, 172, 174],
    hunt: [
      { roll: [1], t: "uma réplica de Fallandi", r: "Libertação de Valkaria, p. 176" },
      { roll: [2], t: "uma réplica de Rornagar", r: "Libertação de Valkaria, p. 176" },
      { roll: [3], t: "uma réplica de Sharin", r: "Libertação de Valkaria, p. 176" },
      { roll: [4], t: "uma réplica de Tandan", r: "Libertação de Valkaria, p. 177" },
      { roll: [5], t: "uma réplica do Tigre Primordial", r: "Libertação de Valkaria, p. 177" },
      { roll: [6], t: "uma réplica de Prislanya", r: "Libertação de Valkaria, p. 177" },
      { roll: [7], t: "uma réplica de Ravarimm", r: "Libertação de Valkaria, p. 177" },
      { roll: [8], t: "uma réplica de Al-khab", r: "Libertação de Valkaria, p. 177" },
      { roll: [9], t: "uma réplica de Potentius", r: "Libertação de Valkaria, p. 177" },
      { roll: [10], t: "uma réplica de Sathane", r: "Libertação de Valkaria, p. 178" },
      { roll: [11], t: "uma réplica de Yon-Ude", r: "Libertação de Valkaria, p. 178" },
      { roll: [12], t: "uma réplica de Darkazimm", r: "Libertação de Valkaria, p. 178" },
      { roll: [13], t: "uma réplica de Coriphena", r: "Libertação de Valkaria, p. 178" },
      { roll: [14], t: "uma réplica de Reyjane", r: "Libertação de Valkaria, p. 178" },
      { roll: [15], t: "uma réplica do Guardião traidor", r: "Libertação de Valkaria, p. 178" },
      { roll: [16], t: "uma réplica de Turukuto", r: "Libertação de Valkaria, p. 179" },
      { roll: [17], t: "uma réplica de Vorakking", r: "Libertação de Valkaria, p. 179" },
      { roll: [18], t: "uma réplica de Hit", r: "Libertação de Valkaria, p. 179" },
      { roll: [19], t: "uma réplica de Thomar", r: "Libertação de Valkaria, p. 179" },
      { roll: [20], t: "um amálgama de dois Guardiões", r: "Libertação de Valkaria, p. 179" }
    ]
  }
];

export const DUNGEON_COUNT = 20;

/** Ofício types that exist in Tormenta20 (used by Manufatura). */
export const OFICIOS = ["alquimista", "armeiro", "artesão", "carpinteiro", "cozinheiro", "engenhoqueiro", "escriba", "joalheiro"];

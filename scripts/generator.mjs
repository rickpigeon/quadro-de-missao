/**
 * Quadro de Missão: the mission generator (pure functions, no Foundry calls).
 *
 * The three tables of "Missões Aleatórias" (p. 34): Solicitante 2d8, Objetivo 1d8, Recompensa 1d6.
 * Each objective then needs its own details (p. 33): a numbered chamber, the 2d4 / 1d3 spaces of the
 * item, or the prey of a hunt (a roll on the encounter table of the target dungeon).
 * The poster text is composed from texts.mjs with a seeded random generator, so the same draft
 * always gives the same text until "Outro texto" changes the seed.
 */
import { CHAMBER_OBJECTIVES, DUNGEONS, DUNGEON_COUNT, ESTABLISHMENTS, GATED_RESIDENTS, OBJECTIVES, REWARDS } from "./data.mjs";
import { CORE, GENERIC, PLACES, REWARD_FLAVOR, REWARD_RULES, TITLES } from "./texts.mjs";

/* -------------------------------------------- */
/*  Random numbers                              */
/* -------------------------------------------- */

/** A small seeded generator (mulberry32): same seed, same sequence. */
export function makeRng(seed) {
  let a = (Number(seed) >>> 0) || 1;
  return function() {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const newSeed = (rng = Math.random) => Math.floor(rng() * 4294967296) >>> 0;

/** One die: an integer from 1 to `faces`. */
export const rollDie = (faces, rng = Math.random) => 1 + Math.floor(rng() * faces);

/** Several dice of the same kind: { dice: [..], total }. */
export function rollDice(count, faces, rng = Math.random) {
  const dice = Array.from({ length: count }, () => rollDie(faces, rng));
  return { dice, total: dice.reduce((s, d) => s + d, 0) };
}

const pick = (list, rng) => list[Math.floor(rng() * list.length)];

/* -------------------------------------------- */
/*  The three tables                            */
/* -------------------------------------------- */

export const establishmentForRoll = total => Object.keys(ESTABLISHMENTS).find(k => ESTABLISHMENTS[k].rolls.includes(total)) ?? null;
export const objectiveForRoll = n => Object.keys(OBJECTIVES).find(k => OBJECTIVES[k].roll === n) ?? null;
export const rewardForRoll = n => Object.keys(REWARDS).find(k => REWARDS[k].roll === n) ?? null;

export function rollRequester(rng = Math.random) {
  const r = rollDice(2, 8, rng);
  return { estab: establishmentForRoll(r.total), dice: r.dice, total: r.total };
}

export function rollObjective(rng = Math.random) {
  const n = rollDie(8, rng);
  return { objective: objectiveForRoll(n), roll: n };
}

export function rollReward(rng = Math.random) {
  const n = rollDie(6, rng);
  return { reward: rewardForRoll(n), roll: n };
}

/* -------------------------------------------- */
/*  Residents                                   */
/* -------------------------------------------- */

/**
 * The residents of a place who can sign a poster now.
 * ctx: { nextDungeon, completedMissions, unavailable: [names] }
 */
export function availableResidents(estabKey, ctx = {}) {
  const estab = ESTABLISHMENTS[estabKey];
  if ( !estab ) return [];
  const out = new Set(ctx.unavailable ?? []);
  return estab.residents.filter(name => {
    if ( out.has(name) ) return false;
    const gate = GATED_RESIDENTS[name];
    if ( !gate ) return true;
    return (Number(ctx.nextDungeon) > gate.afterDungeon) || (Number(ctx.completedMissions) >= gate.afterMissions);
  });
}

/** Who signs when every named resident of the place is out of play. */
export const fallbackResident = estabKey => `o encarregado ${ESTABLISHMENTS[estabKey]?.de ?? "da Guilda"}`;

export function pickResident(estabKey, ctx, rng = Math.random) {
  const list = availableResidents(estabKey, ctx);
  return list.length ? pick(list, rng) : fallbackResident(estabKey);
}

/* -------------------------------------------- */
/*  Details of each objective                   */
/* -------------------------------------------- */

export const dungeon = n => DUNGEONS[Math.min(DUNGEON_COUNT, Math.max(1, Math.round(Number(n) || 1)))];

/** A random numbered chamber of the dungeon, leaving out the Guardian's (the last area). */
export function rollChamber(dungeonN, rng = Math.random) {
  const d = dungeon(dungeonN);
  const usable = Math.max(1, d.areas.length - 1);
  return String(rollDie(usable, rng));
}

const entryFor = (table, roll) => table.find(e => e.roll.includes(roll)) ?? null;

/**
 * The prey of a hunt: a roll on the encounter table of the dungeon (p. 33).
 * Results that are not creatures (traps, quicksand, the non-combatant servants of Keenn) are re-rolled.
 * Nimb (p. 158): 1d20 picks the table of any dungeon; 18 is Nimb's own joke table ("1d5" with 8 rows,
 * read here as one of the 8 rows); dungeons without a table are re-rolled.
 * Tanna-Toh and Khalmyr have no table: the GM picks the prey.
 * Returns { t, h, r, table, log } or { none: true, log }.
 */
export function rollHunt(dungeonN, rng = Math.random) {
  const d = dungeon(dungeonN);
  const log = [];
  if ( d.n === 18 ) {
    for ( let guard = 0; guard < 40; guard++ ) {
      const which = rollDie(20, rng);
      const target = DUNGEONS[which];
      if ( which === 18 ) {
        const i = Math.floor(rng() * target.hunt.length);
        const e = target.hunt[i];
        log.push(`1d20 = 18 (a própria tabela de Nimb, p. 159), linha ${e.roll[0]}`);
        return { ...e, table: 18, log };
      }
      if ( !target.hunt.length ) {
        log.push(`1d20 = ${which} (${target.god} não tem tabela, rola de novo)`);
        continue;
      }
      log.push(`1d20 = ${which} (tabela de ${target.god}, p. ${target.encPage})`);
      const inner = rollOnTable(target, rng);
      return { ...inner, table: which, log: [...log, ...inner.log] };
    }
    return { none: true, log };
  }
  if ( !d.hunt.length ) return { none: true, log: [`${d.god} não tem tabela de encontros`] };
  const res = rollOnTable(d, rng);
  return { ...res, table: d.n };
}

function rollOnTable(d, rng) {
  const log = [];
  for ( let guard = 0; guard < 40; guard++ ) {
    const roll = rollDie(d.die, rng);
    const e = entryFor(d.hunt, roll);
    if ( !e ) continue;
    if ( e.x ) {
      log.push(`1d${d.die} = ${roll} (${e.x}, rola de novo)`);
      continue;
    }
    log.push(`1d${d.die} = ${roll}`);
    return { t: e.t, h: e.h ?? "", r: e.r, log };
  }
  return { none: true, log };
}

/**
 * Roll every detail the objective needs. Keeps what the draft already has unless `force`.
 * Returns a partial draft: { chamber, spaces, spacesDice, hunt }.
 */
export function rollDetails(draft, rng = Math.random) {
  const out = { chamber: "", spaces: 0, spacesDice: [], hunt: null };
  if ( CHAMBER_OBJECTIVES.has(draft.objective) ) out.chamber = rollChamber(draft.dungeon, rng);
  if ( draft.objective === "entrega" || draft.objective === "recuperacao" ) {
    const r = rollDice(2, 4, rng);
    out.spaces = r.total;
    out.spacesDice = r.dice;
  }
  else if ( draft.objective === "manufatura" ) {
    const r = rollDice(1, 3, rng);
    out.spaces = r.total;
    out.spacesDice = r.dice;
  }
  if ( draft.objective === "caca" ) out.hunt = rollHunt(draft.dungeon, rng);
  return out;
}

/** A complete random draft (every table and detail rolled). */
export function rollEverything(ctx = {}, rng = Math.random) {
  const req = rollRequester(rng);
  const obj = rollObjective(rng);
  const rew = rollReward(rng);
  const draft = {
    estab: req.estab,
    npc: pickResident(req.estab, ctx, rng),
    objective: obj.objective,
    reward: rew.reward,
    dungeon: dungeon(ctx.nextDungeon ?? 1).n,
    dice: { requester: req.dice, objective: obj.roll, reward: rew.roll },
    textSeed: newSeed(rng)
  };
  return { ...draft, ...rollDetails(draft, rng) };
}

/* -------------------------------------------- */
/*  Words                                       */
/* -------------------------------------------- */

const cap = s => (s ? s.charAt(0).toLocaleUpperCase("pt-BR") + s.slice(1) : s);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/** How a poster names the dungeon: "a próxima masmorra", "a 5ª masmorra" or "o Desafio de Lena". */
export function dungeonWords(n, ctx = {}) {
  const d = dungeon(n);
  if ( ctx.revealGod ) return { a: `o Desafio de ${d.god}`, na: `no Desafio de ${d.god}`, da: `do Desafio de ${d.god}` };
  if ( d.n === Number(ctx.nextDungeon) ) return { a: "a próxima masmorra", na: "na próxima masmorra", da: "da próxima masmorra" };
  return { a: `a ${d.n}ª masmorra`, na: `na ${d.n}ª masmorra`, da: `da ${d.n}ª masmorra` };
}

export function chamberWords(chamber) {
  const c = String(chamber ?? "").trim();
  if ( !c ) return { a: "certa câmara", na: "em certa câmara", da: "de certa câmara" };
  return { a: `a câmara ${c}`, na: `na câmara ${c}`, da: `da câmara ${c}` };
}

/** Fill {placeholders}. A capitalized name ({Npc}) capitalizes the value of {npc}. */
export function fill(template, vars) {
  const text = String(template).replace(/\{([A-Za-z_]+)\}/g, (match, key) => {
    if ( Object.hasOwn(vars, key) ) return vars[key];
    const lower = key.charAt(0).toLowerCase() + key.slice(1);
    if ( key !== lower && Object.hasOwn(vars, lower) ) return cap(String(vars[lower]));
    return match;
  });
  /* Portuguese contractions, for "o encarregado" and similar values. */
  return text.replace(/\bde o\b/g, "do").replace(/\bde a\b/g, "da").replace(/\bem o\b/g, "no").replace(/\bem a\b/g, "na");
}

/* -------------------------------------------- */
/*  The poster                                  */
/* -------------------------------------------- */

/** The prey as players read it (without the god's name while the god is hidden). */
export function preyName(hunt, ctx = {}) {
  if ( !hunt || hunt.none ) return "uma criatura perigosa da masmorra";
  return (!ctx.revealGod && hunt.h) ? hunt.h : hunt.t;
}

/**
 * Compose every text of a poster from a draft.
 * draft: { estab, npc, objective, reward, dungeon, chamber, spaces, hunt, textSeed }
 * ctx:   { nextDungeon, revealGod }
 * Returns { title, body, signature, terms: [..], rewardText, gmNotes: [..] }.
 */
export function composePoster(draft, ctx = {}) {
  const rng = makeRng(draft.textSeed ?? 1);
  const estabKey = ESTABLISHMENTS[draft.estab] ? draft.estab : "guilda";
  const estab = ESTABLISHMENTS[estabKey];
  const place = PLACES[estabKey];
  const objective = OBJECTIVES[draft.objective] ? draft.objective : "entrega";
  const reward = REWARDS[draft.reward] ? draft.reward : "informacao";
  const d = dungeon(draft.dungeon);
  const level = d.n;
  const cd = 15 + level;
  const dw = dungeonWords(d.n, ctx);
  const cw = chamberWords(draft.chamber);
  const npc = String(draft.npc ?? "").trim() || fallbackResident(estabKey);
  const spaces = Math.max(0, Math.round(Number(draft.spaces) || 0));

  /* A place's own pool most of the time, the generic pool now and then. */
  const fromPlace = (key, chance = 0.75) => {
    const own = place[key] ?? [];
    const generic = GENERIC[key] ?? [];
    if ( own.length && (!generic.length || rng() < chance) ) return pick(own, rng);
    return generic.length ? pick(generic, rng) : pick(own, rng);
  };

  const manu = objective === "manufatura" ? fromPlace("manufatura", 0.85) : null;
  const rit = objective === "ritual" ? fromPlace("ritual", 0.7) : null;
  const pesq = objective === "pesquisa" ? fromPlace("pesquisa", 0.6) : null;
  const vars = {
    npc,
    estab: estab.label,
    a_estab: estab.a,
    de_estab: estab.de,
    na_estab: estab.em,
    a_masmorra: dw.a,
    na_masmorra: dw.na,
    da_masmorra: dw.da,
    a_camara: cw.a,
    na_camara: cw.na,
    da_camara: cw.da,
    cd: String(cd),
    espacos: plural(spaces, "espaço", "espaços"),
    item: "",
    oficio: "",
    criatura: preyName(draft.hunt, ctx),
    motivo: "",
    razao: "",
    pessoa: "",
    ritual: "",
    fenomeno: "",
    pericia: ""
  };
  if ( objective === "entrega" || objective === "recuperacao" ) vars.item = fromPlace(objective);
  if ( manu ) Object.assign(vars, { item: manu.item, oficio: manu.oficio });
  if ( objective === "escolta" ) vars.motivo = fromPlace("escolta", 1);
  if ( objective === "caca" ) vars.razao = fromPlace("caca", 1);
  if ( objective === "resgate" ) vars.pessoa = fromPlace("resgate");
  if ( rit ) Object.assign(vars, { ritual: rit.desc, pericia: rit.pericia });
  if ( pesq ) Object.assign(vars, { fenomeno: pesq.desc, pericia: pesq.pericia });

  const title = pick(TITLES[objective], rng);
  const greet = rng() < 0.75 ? pick(place.greet, rng) : pick(GENERIC.greet, rng);
  let core = fill(pick(CORE[objective], rng), vars);
  if ( vars.razao ) core += ` ${vars.razao}`;
  const closing = [fill(pick(REWARD_FLAVOR[reward], rng), vars), rng() < 0.7 ? pick(place.sign, rng) : pick(GENERIC.sign, rng)].join(" ");
  const body = [fill(greet, vars), core, closing].join("\n\n");

  const terms = termsFor(objective, vars, spaces);
  const rewardText = fill(REWARD_RULES[reward], vars);
  const gmNotes = gmNotesFor({ ...draft, objective, reward }, d, vars);
  return { title, body, signature: `${cap(npc)} · ${estab.label}`, terms, rewardText, gmNotes };
}

/** What the players need to know to do the job (the rules of p. 33). */
export function termsFor(objective, vars, spaces) {
  switch ( objective ) {
    case "manufatura": return [
      `Fabricar ${vars.item}: 1 dia de trabalho no local, com um teste de Ofício (${vars.oficio}) CD ${vars.cd}.`,
      `Matérias-primas fornecidas pelo solicitante: ${plural(spaces, "espaço", "espaços")}.`
    ];
    case "escolta": return [
      `${cap(vars.npc)} conta como parceiro iniciante que não fornece benefícios e é vulnerável (Tormenta20, p. 262).`,
      "Precisa percorrer a masmorra com o grupo, do início ao fim. Se morrer, a missão falha."
    ];
    case "entrega": return [
      `A encomenda ocupa ${plural(spaces, "espaço", "espaços")}.`,
      "Se a masmorra não for concluída, a encomenda volta sozinha para a cidade e a missão falha."
    ];
    case "caca": return [
      `Presa: ${vars.criatura}.`,
      "Abater a presa e trazê-la até Candeh’ssa."
    ];
    case "ritual": return [`Teste estendido de ${vars.pericia} (CD ${vars.cd}, 3 sucessos). Cada teste leva 1 hora.`];
    case "recuperacao": return [`O objeto ocupa ${plural(spaces, "espaço", "espaços")}.`];
    case "resgate": return ["Quem for resgatado acompanha o grupo como numa escolta: parceiro iniciante, sem benefícios e vulnerável."];
    case "pesquisa": return [`Teste estendido de ${vars.pericia} (CD ${vars.cd}, 3 sucessos). Cada teste leva 1 hora.`];
    default: return [];
  }
}

const OBJECTIVE_GM_RULE = {
  manufatura: "Ofício CD 15 + nível da masmorra; materiais fornecidos pelo solicitante (p. 33).",
  escolta: "Se o NPC morrer, a missão falha e ele não estará mais disponível: marque-o como fora de jogo nas opções do quadro (p. 33).",
  entrega: "A câmara pode ou não estar protegida por uma criatura (p. 33).",
  caca: "A presa recebe +2 em testes de perícia e na Defesa (p. 33).",
  ritual: "Falha total: um desastre sobrenatural; os PM máximos de cada personagem diminuem em 1 por nível até a conclusão da próxima masmorra (p. 33).",
  recuperacao: "Depois que o objeto é pego, as criaturas da masmorra recebem +2 nos testes de ataque contra o grupo (p. 33).",
  resgate: "Depois do resgate, as criaturas da masmorra recebem +2 nas rolagens de dano contra o grupo (p. 33).",
  pesquisa: "Falha total: um acidente perigoso; os PV máximos de cada personagem diminuem em 1 por nível até a conclusão da próxima masmorra (p. 33)."
};

/** What only the GM sees: where exactly, the Agrado, the hidden rules and the dice. */
export function gmNotesFor(draft, d, vars) {
  const notes = [];
  let where = `Desafio de ${d.god} (${d.n}º nível, p. ${d.page}).`;
  const c = Number(draft.chamber);
  if ( c >= 1 && c <= d.areas.length ) where += ` Câmara ${c}: Área ${c}, “${d.areas[c - 1]}” (p. ${d.areaPages[c - 1]}).`;
  notes.push(where);
  notes.push(`Agrado aos Deuses: ${d.agrado} (p. ${d.agradoPage}).`);
  notes.push(OBJECTIVE_GM_RULE[draft.objective]);
  if ( draft.objective === "caca" ) {
    const h = draft.hunt;
    if ( !h || h.none ) notes.push("Presa ainda não definida: escolha a criatura e edite o cartaz.");
    else {
      const shown = vars.criatura !== h.t ? ` (no cartaz: “${vars.criatura}”)` : "";
      notes.push(`Presa: ${h.t}${shown}. Ficha: ${h.r}.`);
    }
    if ( h?.log?.length ) notes.push(`Rolagem da presa: ${h.log.join(" → ")}.`);
    if ( d.note ) notes.push(d.note);
  }
  if ( draft.spacesDice?.length ) {
    const formula = draft.objective === "manufatura" ? "1d3" : "2d4";
    notes.push(`Espaços: ${formula} = ${draft.spacesDice.join(" + ")}.`);
  }
  if ( draft.reward === "afinidade" ) notes.push("Os 1d4 PA são rolados quando a missão é marcada como cumprida.");
  if ( draft.reward === "poder" ) notes.push("“Poder” é descrito na p. 34, mas não está na tabela de 1d6: só entra quando escolhido à mão.");
  return notes;
}

/** "Onde" line of a poster. GM view adds the god and the area name. */
export function whereText(poster, ctx = {}, gm = false) {
  const d = dungeon(poster.dungeon);
  const reveal = ctx.revealGod || gm;
  const head = reveal ? `Desafio de ${d.god} (${d.n}ª masmorra)` : `${d.n}ª masmorra`;
  const c = String(poster.chamber ?? "").trim();
  if ( !c ) return head;
  return `${head} · câmara ${c}`;
}

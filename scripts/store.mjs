/**
 * Storage and settings. Posters live in the world setting `board` as { list: [...] }
 * (an Object setting never holds a bare array), so only GMs can change them; every client reads them.
 * Note: world settings reach every client, so a player who digs in the browser console could read
 * drafts and GM notes. The board itself never shows them to players.
 */
import { MODULE_ID, PINS, STATUSES } from "./constants.mjs";
import { ALL_RESIDENTS, DUNGEONS, DUNGEON_COUNT, ESTABLISHMENTS, OBJECTIVES, REWARDS } from "./data.mjs";

export function registerSettings(onChange) {
  const changed = () => onChange?.();
  game.settings.register(MODULE_ID, "board", {
    scope: "world",
    config: false,
    type: Object,
    default: { list: [] },
    onChange: changed
  });
  const dungeonChoices = Object.fromEntries(DUNGEONS.slice(1).map(d => [d.n, `${d.n}ª · Desafio de ${d.god} (${d.n}º nível)`]));
  game.settings.register(MODULE_ID, "nextDungeon", {
    name: "Próxima masmorra",
    hint: "A masmorra que as missões novas usam (CD 15 + nível, tabela de encontros da Caça, câmaras). O livro gera as missões para a próxima masmorra (p. 33).",
    scope: "world",
    config: true,
    type: Number,
    choices: dungeonChoices,
    default: 1,
    onChange: changed
  });
  game.settings.register(MODULE_ID, "revealGod", {
    name: "Mostrar o deus da masmorra nos cartazes",
    hint: "Desligado, os cartazes dizem só \"a próxima masmorra\" e o número dela, porque a ordem das masmorras é segredo (p. 46). Ligue se o grupo já sabe qual é.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: changed
  });
  game.settings.register(MODULE_ID, "partySize", {
    name: "Personagens jogadores no grupo",
    hint: "O grupo pode ter tantas missões aceitas quanto personagens jogadores (p. 33). Com 0 o módulo conta os jogadores que têm personagem.",
    scope: "world",
    config: true,
    type: Number,
    range: { min: 0, max: 12, step: 1 },
    default: 0,
    onChange: changed
  });
  game.settings.register(MODULE_ID, "unavailable", {
    scope: "world",
    config: false,
    type: Object,
    default: { list: [] },
    onChange: changed
  });
  game.settings.register(MODULE_ID, "completedCount", {
    scope: "world",
    config: false,
    type: Number,
    default: 0,
    onChange: changed
  });
}

const safeGet = (key, fallback) => {
  try {
    return game.settings.get(MODULE_ID, key);
  } catch {
    return fallback;
  }
};

/** Everything the generator needs to know about the campaign. */
export function campaignContext() {
  return {
    nextDungeon: clampInt(safeGet("nextDungeon", 1), 1, DUNGEON_COUNT, 1),
    revealGod: !!safeGet("revealGod", false),
    unavailable: getUnavailable(),
    completedMissions: clampInt(safeGet("completedCount", 0), 0, 999, 0)
  };
}

export function getUnavailable() {
  const stored = safeGet("unavailable", { list: [] });
  const list = Array.isArray(stored?.list) ? stored.list : [];
  return list.filter(name => ALL_RESIDENTS.includes(name));
}

export async function setUnavailable(names) {
  await game.settings.set(MODULE_ID, "unavailable", { list: [...new Set(names)].filter(n => ALL_RESIDENTS.includes(n)) });
}

/** Characters assigned to players (for the "aceita por" list and the mission limit). */
export function partyCharacters() {
  return game.users?.filter(u => !u.isGM && u.character).map(u => u.character.name) ?? [];
}

export function partyLimit() {
  const set = clampInt(safeGet("partySize", 0), 0, 12, 0);
  return set || partyCharacters().length || 0;
}

/* -------------------------------------------- */
/*  Posters                                     */
/* -------------------------------------------- */

const text = (value, max = 400) => String(value ?? "").replace(/\r\n?/g, "\n").trim().slice(0, max);
const oneOf = (value, catalog, fallback) => (Object.hasOwn(catalog, value) ? value : fallback);
function clampInt(value, min, max, fallback) {
  const n = Math.round(Number(value));
  if ( !Number.isFinite(n) ) return fallback;
  return Math.min(max, Math.max(min, n));
}
const intList = (value, max = 4) => (Array.isArray(value) ? value.map(v => clampInt(v, 0, 99, 0)).slice(0, max) : []);

/** Text list: an array, or a string with one item per line. */
function lines(value, maxItems = 12, maxLen = 600) {
  const list = Array.isArray(value) ? value : String(value ?? "").split(/\r?\n/);
  return list.map(v => text(v, maxLen)).filter(Boolean).slice(0, maxItems);
}

function normalizeHunt(raw) {
  if ( !raw || typeof raw !== "object" ) return null;
  if ( raw.none ) return { none: true, t: "", h: "", r: "", log: lines(raw.log, 6, 200) };
  const t = text(raw.t, 160);
  if ( !t ) return null;
  return { none: false, t, h: text(raw.h, 160), r: text(raw.r, 160), log: lines(raw.log, 6, 200) };
}

/** Coerce any input (form data, generator draft, imported JSON) into a valid poster. */
export function normalizePoster(raw = {}) {
  const meta = raw.meta && typeof raw.meta === "object" ? raw.meta : {};
  const dice = meta.dice && typeof meta.dice === "object" ? meta.dice : {};
  return {
    id: text(raw.id, 64) || foundry.utils.randomID(),
    title: text(raw.title, 120) || "Missão",
    body: text(raw.body, 4000),
    signature: text(raw.signature, 120),
    estab: oneOf(raw.estab, ESTABLISHMENTS, "guilda"),
    npc: text(raw.npc, 80),
    objective: oneOf(raw.objective, OBJECTIVES, "entrega"),
    dungeon: clampInt(raw.dungeon, 1, DUNGEON_COUNT, 1),
    chamber: text(raw.chamber, 12),
    terms: lines(raw.terms, 8, 400),
    reward: oneOf(raw.reward, REWARDS, "informacao"),
    rewardText: text(raw.rewardText, 600),
    gmNotes: lines(raw.gmNotes, 12, 600),
    status: oneOf(raw.status, STATUSES, "afixada"),
    visible: raw.visible === undefined ? true : (raw.visible === true || raw.visible === "true" || raw.visible === "on"),
    acceptedBy: text(raw.acceptedBy, 80),
    tilt: Math.max(-4, Math.min(4, Number(raw.tilt) || 0)),
    pin: oneOf(raw.pin, PINS, "vermelho"),
    created: clampInt(raw.created, 0, Number.MAX_SAFE_INTEGER, Date.now()),
    meta: {
      spaces: clampInt(meta.spaces, 0, 99, 0),
      spacesDice: intList(meta.spacesDice, 2),
      dice: { requester: intList(dice.requester, 2), objective: clampInt(dice.objective, 0, 8, 0), reward: clampInt(dice.reward, 0, 6, 0) },
      textSeed: clampInt(meta.textSeed, 0, 4294967295, 1),
      hunt: normalizeHunt(meta.hunt)
    }
  };
}

export function getPosters() {
  const stored = safeGet("board", { list: [] });
  const list = Array.isArray(stored?.list) ? stored.list : [];
  return list.map(normalizePoster);
}

export async function savePosters(list) {
  if ( !game.user.isGM ) throw new Error("Só o mestre pode mudar o quadro.");
  await game.settings.set(MODULE_ID, "board", { list: list.map(normalizePoster) });
}

export function getPoster(id) {
  return getPosters().find(p => p.id === id) ?? null;
}

/** Insert or replace a poster (by id). New posters go to the front of the board. */
export async function upsertPoster(poster) {
  const clean = normalizePoster(poster);
  const list = getPosters();
  const i = list.findIndex(p => p.id === clean.id);
  if ( i >= 0 ) list[i] = clean;
  else list.unshift(clean);
  await savePosters(list);
  return clean;
}

export async function deletePoster(id) {
  await savePosters(getPosters().filter(p => p.id !== id));
}

export async function patchPoster(id, changes) {
  const poster = getPoster(id);
  if ( !poster ) throw new Error("Esse cartaz não existe mais no quadro.");
  return upsertPoster({ ...poster, ...changes, id });
}

export async function addCompleted(delta) {
  const now = clampInt(safeGet("completedCount", 0), 0, 999, 0);
  await game.settings.set(MODULE_ID, "completedCount", Math.max(0, now + delta));
}

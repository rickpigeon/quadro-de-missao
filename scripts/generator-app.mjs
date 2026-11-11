/**
 * The mission generator (GM): the three tables of p. 34, each rolled or chosen by hand,
 * the details of the objective (chamber, spaces, prey) and a live preview of the poster.
 */
import { MODULE_ID, MODULE_TITLE, PINS, TEMPLATES, random } from "./constants.mjs";
import { CHAMBER_OBJECTIVES, DUNGEONS, ESTABLISHMENTS, OBJECTIVES, REWARDS } from "./data.mjs";
import {
  availableResidents, composePoster, dungeon, fallbackResident, newSeed, pickResident, rollChamber, rollDetails,
  rollDice, rollEverything, rollHunt, rollObjective, rollRequester, rollReward
} from "./generator.mjs";
import { campaignContext, normalizePoster } from "./store.mjs";
import { renderPoster } from "./poster-view.mjs";
import { guardActions } from "./errors.mjs";
import { savePosterAndFocus, BoardApp } from "./board-app.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const APP_ID = `${MODULE_ID}-generator`;

const rangeLabel = rolls => (rolls.length > 1 ? `${rolls[0]}–${rolls[rolls.length - 1]}` : String(rolls[0]));

/** Turn a generator draft into a poster (not saved). */
export function posterFromDraft(draft, ctx, extra = {}) {
  const composed = composePoster(draft, ctx);
  const pins = Object.keys(PINS);
  return normalizePoster({
    id: draft.id ?? foundry.utils.randomID(),
    ...composed,
    estab: draft.estab,
    npc: draft.npc,
    objective: draft.objective,
    reward: draft.reward,
    dungeon: draft.dungeon,
    chamber: draft.chamber,
    status: "afixada",
    visible: true,
    tilt: draft.tilt ?? Math.round(((random() * 5) - 2.5) * 10) / 10,
    pin: draft.pin ?? pins[Math.floor(random() * pins.length)],
    created: Date.now(),
    meta: { spaces: draft.spaces, spacesDice: draft.spacesDice, dice: draft.dice, textSeed: draft.textSeed, hunt: draft.hunt },
    ...extra
  });
}

export class GeneratorApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(options = {}) {
    super(options);
    const ctx = campaignContext();
    this.draft = rollEverything(ctx, random);
    this.draft.tilt = Math.round(((random() * 5) - 2.5) * 10) / 10;
    const pins = Object.keys(PINS);
    this.draft.pin = pins[Math.floor(random() * pins.length)];
  }

  static DEFAULT_OPTIONS = {
    id: APP_ID,
    classes: ["quadro-de-missao", "qdm-generator-app"],
    window: { title: "Gerar missão (Aventuras sem fim!, p. 33-34)", icon: "fa-solid fa-dice", resizable: true },
    position: { width: 1000, height: 760 },
    actions: guardActions({
      rollAll: GeneratorApp.#onRollAll,
      rollRequester: GeneratorApp.#onRollRequester,
      rollNpc: GeneratorApp.#onRollNpc,
      rollObjective: GeneratorApp.#onRollObjective,
      rollReward: GeneratorApp.#onRollReward,
      rollChamber: GeneratorApp.#onRollChamber,
      rollSpaces: GeneratorApp.#onRollSpaces,
      rollPrey: GeneratorApp.#onRollPrey,
      newText: GeneratorApp.#onNewText,
      post: GeneratorApp.#onPost,
      saveDraft: GeneratorApp.#onSaveDraft,
      openEditor: GeneratorApp.#onOpenEditor
    })
  };

  static PARTS = {
    main: { template: `${TEMPLATES}/generator.hbs`, scrollable: [".qdm-gen-controls", ".qdm-gen-preview"] }
  };

  static open() {
    if ( !game.user.isGM ) {
      ui.notifications.warn(`${MODULE_TITLE}: só o mestre gera missões.`);
      return null;
    }
    const existing = foundry.applications.instances.get(APP_ID);
    if ( existing ) {
      existing.render({ force: true });
      existing.bringToFront?.();
      return existing;
    }
    const app = new GeneratorApp();
    app.render({ force: true });
    return app;
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const ctx = campaignContext();
    const d = this.draft;
    const dg = dungeon(d.dungeon);
    const residents = availableResidents(d.estab, ctx);
    const npcOptions = residents.map(name => ({ value: name, label: name, selected: name === d.npc }));
    if ( !residents.includes(d.npc) ) npcOptions.unshift({ value: d.npc, label: d.npc, selected: true });
    const req = d.dice?.requester ?? [];
    const spacesFormula = d.objective === "manufatura" ? "1d3" : "2d4";
    Object.assign(context, {
      draft: d,
      dungeons: DUNGEONS.slice(1).map(x => ({ value: x.n, label: `${x.n}ª · Desafio de ${x.god} (nível ${x.n}, CD ${15 + x.n})`, selected: x.n === dg.n })),
      isNext: dg.n === ctx.nextDungeon,
      estabs: Object.entries(ESTABLISHMENTS).map(([key, e]) => ({ value: key, label: `${rangeLabel(e.rolls)} · ${e.label}`, selected: key === d.estab })),
      npcs: npcOptions,
      npcFallback: fallbackResident(d.estab),
      objectives: Object.entries(OBJECTIVES).map(([key, o]) => ({ value: key, label: `${o.roll} · ${o.label}`, selected: key === d.objective })),
      rewards: Object.entries(REWARDS).map(([key, r]) => ({ value: key, label: r.roll ? `${r.roll} · ${r.label}` : r.label, selected: key === d.reward })),
      reqDice: req.length === 2 ? `2d8: ${req[0]} + ${req[1]} = ${req[0] + req[1]}` : "escolhido à mão",
      objDice: d.dice?.objective ? `1d8: ${d.dice.objective}` : "escolhido à mão",
      rewDice: d.dice?.reward ? `1d6: ${d.dice.reward}` : "escolhido à mão",
      needsChamber: CHAMBER_OBJECTIVES.has(d.objective),
      chamberHint: `${dg.areas.length} áreas numeradas; o módulo sorteia entre 1 e ${Math.max(1, dg.areas.length - 1)} (a última é a do Guardião)`,
      areaName: Number(d.chamber) >= 1 && Number(d.chamber) <= dg.areas.length ? dg.areas[Number(d.chamber) - 1] : "",
      needsSpaces: ["entrega", "recuperacao", "manufatura"].includes(d.objective),
      spacesFormula,
      spacesLabel: d.objective === "manufatura" ? "Matérias-primas (espaços)" : "Tamanho do item (espaços)",
      spacesDice: d.spacesDice?.length ? `${spacesFormula}: ${d.spacesDice.join(" + ")}` : "",
      isHunt: d.objective === "caca",
      prey: d.hunt && !d.hunt.none ? d.hunt.t : "",
      preyLog: d.hunt?.log?.join(" → ") ?? "",
      preyRef: d.hunt?.r ?? "",
      noTable: dg.hunt.length === 0,
      preview: renderPoster(posterFromDraft(d, ctx), { mode: "full", gm: true, ctx, openNotes: true })
    });
    return context;
  }

  async _onRender(context, options) {
    await super._onRender(context, options);
    for ( const el of this.element.querySelectorAll("[data-field]") ) {
      el.addEventListener("change", () => this.#onField(el.dataset.field, el.value));
    }
  }

  #onField(field, value) {
    const d = this.draft;
    const ctx = campaignContext();
    switch ( field ) {
      case "dungeon":
        d.dungeon = dungeon(value).n;
        Object.assign(d, rollDetails(d, random));
        break;
      case "estab":
        d.estab = value;
        d.dice = { ...d.dice, requester: [] };
        d.npc = pickResident(value, ctx, random);
        break;
      case "npc":
        d.npc = String(value).trim() || fallbackResident(d.estab);
        break;
      case "objective":
        d.objective = value;
        d.dice = { ...d.dice, objective: 0 };
        Object.assign(d, rollDetails(d, random));
        break;
      case "reward":
        d.reward = value;
        d.dice = { ...d.dice, reward: 0 };
        break;
      case "chamber":
        d.chamber = String(value).trim().slice(0, 12);
        break;
      case "spaces":
        d.spaces = Math.max(0, Math.min(99, Math.round(Number(value) || 0)));
        d.spacesDice = [];
        break;
      case "prey": {
        const t = String(value).trim();
        d.hunt = t ? { t, h: "", r: "", log: ["escolhida à mão"] } : { none: true, log: [] };
        break;
      }
      default: return;
    }
    this.render();
  }

  static async #onRollAll() {
    const keep = { tilt: this.draft.tilt, pin: this.draft.pin };
    this.draft = { ...this.#freshDraft(this.draft.dungeon), ...keep };
    this.render();
  }

  static async #onRollRequester() {
    const r = rollRequester(random);
    Object.assign(this.draft, { estab: r.estab, npc: pickResident(r.estab, campaignContext(), random) });
    this.draft.dice = { ...this.draft.dice, requester: r.dice };
    this.render();
  }

  static async #onRollNpc() {
    this.draft.npc = pickResident(this.draft.estab, campaignContext(), random);
    this.render();
  }

  static async #onRollObjective() {
    const r = rollObjective(random);
    this.draft.objective = r.objective;
    this.draft.dice = { ...this.draft.dice, objective: r.roll };
    Object.assign(this.draft, rollDetails(this.draft, random));
    this.render();
  }

  static async #onRollReward() {
    const r = rollReward(random);
    this.draft.reward = r.reward;
    this.draft.dice = { ...this.draft.dice, reward: r.roll };
    this.render();
  }

  static async #onRollChamber() {
    this.draft.chamber = rollChamber(this.draft.dungeon, random);
    this.render();
  }

  static async #onRollSpaces() {
    const r = this.draft.objective === "manufatura" ? rollDice(1, 3, random) : rollDice(2, 4, random);
    this.draft.spaces = r.total;
    this.draft.spacesDice = r.dice;
    this.render();
  }

  static async #onRollPrey() {
    this.draft.hunt = rollHunt(this.draft.dungeon, random);
    this.render();
  }

  static async #onNewText() {
    this.draft.textSeed = newSeed(random);
    this.render();
  }

  /** Every table rolled again, keeping the target dungeon the GM picked. */
  #freshDraft(dungeonN) {
    const draft = rollEverything(campaignContext(), random);
    draft.dungeon = dungeon(dungeonN).n;
    return { ...draft, ...rollDetails(draft, random) };
  }

  async #save(visible) {
    const poster = posterFromDraft(this.draft, campaignContext(), { visible });
    const saved = await savePosterAndFocus(poster);
    ui.notifications.info(`${MODULE_TITLE}: "${saved.title}" ${visible ? "afixado no quadro" : "guardado como rascunho (só você vê)"}.`);
    BoardApp.open({ focus: saved.id });
    /* A fresh mission for the next click. */
    const pins = Object.keys(PINS);
    this.draft = { ...this.#freshDraft(this.draft.dungeon), tilt: Math.round(((random() * 5) - 2.5) * 10) / 10, pin: pins[Math.floor(random() * pins.length)] };
    this.render();
    return saved;
  }

  static async #onPost() {
    return this.#save(true);
  }

  static async #onSaveDraft() {
    return this.#save(false);
  }

  static async #onOpenEditor() {
    const { PosterEditor } = await import("./poster-editor.mjs");
    PosterEditor.open(posterFromDraft(this.draft, campaignContext()), { isNew: true });
  }
}

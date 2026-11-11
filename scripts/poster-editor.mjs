/**
 * Poster editor (GM): every field of one poster, with a live preview.
 * "Gerar texto de novo" rewrites the texts from the current place, objective, reward and dungeon.
 */
import { MODULE_ID, MODULE_TITLE, PINS, STATUSES, TEMPLATES, choices, random } from "./constants.mjs";
import { ALL_RESIDENTS, CHAMBER_OBJECTIVES, DUNGEONS, ESTABLISHMENTS, OBJECTIVES, REWARDS } from "./data.mjs";
import { composePoster, newSeed, rollChamber, rollDice, rollHunt } from "./generator.mjs";
import { campaignContext, getPoster, normalizePoster, partyCharacters } from "./store.mjs";
import { renderPoster } from "./poster-view.mjs";
import { guardActions, reportError } from "./errors.mjs";
import { BoardApp, savePosterAndFocus } from "./board-app.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/** Read every named field of the form. */
function readForm(form) {
  const out = {};
  for ( const el of form.querySelectorAll("[name]") ) {
    const name = el.getAttribute("name");
    out[name] = el.type === "checkbox" ? el.checked : el.value;
  }
  return out;
}

export class PosterEditor extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(options = {}) {
    super(options);
    this.draft = normalizePoster(options.poster ?? {});
    this.isNew = !!options.isNew;
  }

  static DEFAULT_OPTIONS = {
    classes: ["quadro-de-missao", "qdm-editor-app"],
    tag: "form",
    window: { icon: "fa-solid fa-pen-nib", resizable: true },
    position: { width: 1000, height: 780 },
    form: { handler: PosterEditor.#onSubmit, submitOnChange: false, closeOnSubmit: true },
    actions: guardActions({
      regenerate: PosterEditor.#onRegenerate
    })
  };

  static PARTS = {
    form: { template: `${TEMPLATES}/editor.hbs`, scrollable: [".qdm-ed-fields", ".qdm-ed-preview"] }
  };

  /** One editor per poster. `poster` is a poster object or the id of a saved one. */
  static open(posterOrId, { isNew = false } = {}) {
    if ( !game.user.isGM ) {
      ui.notifications.warn(`${MODULE_TITLE}: só o mestre edita cartazes.`);
      return null;
    }
    const poster = typeof posterOrId === "string" ? getPoster(posterOrId) : posterOrId;
    if ( !poster ) {
      ui.notifications.warn(`${MODULE_TITLE}: cartaz não encontrado.`);
      return null;
    }
    const id = `${MODULE_ID}-editor-${poster.id}`;
    const existing = foundry.applications.instances.get(id);
    if ( existing ) {
      existing.bringToFront?.();
      return existing;
    }
    const app = new PosterEditor({ id, poster, isNew });
    app.render({ force: true });
    return app;
  }

  get title() {
    return this.isNew ? "Novo cartaz" : `Editar cartaz: ${this.draft.title}`;
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const p = this.draft;
    Object.assign(context, {
      poster: p,
      isNew: this.isNew,
      termsText: p.terms.join("\n"),
      notesText: p.gmNotes.join("\n"),
      estabs: choices(Object.fromEntries(Object.entries(ESTABLISHMENTS).map(([k, e]) => [k, e.label])), p.estab),
      objectives: choices(OBJECTIVES, p.objective),
      rewards: choices(REWARDS, p.reward),
      statuses: choices(STATUSES, p.status),
      pins: choices(PINS, p.pin),
      dungeons: DUNGEONS.slice(1).map(d => ({ value: d.n, label: `${d.n}ª · Desafio de ${d.god}`, selected: d.n === p.dungeon })),
      residents: ALL_RESIDENTS,
      party: partyCharacters(),
      tiltLabel: p.tilt.toFixed(1)
    });
    return context;
  }

  /* The form element itself survives re-renders, so its listeners are added only once. */
  async _onFirstRender(context, options) {
    await super._onFirstRender(context, options);
    const form = this.#form();
    const update = () => {
      try {
        this.#refreshPreview();
      } catch ( err ) {
        reportError(err, "prévia");
      }
    };
    form.addEventListener("input", update);
    form.addEventListener("change", update);
  }

  async _onRender(context, options) {
    await super._onRender(context, options);
    this.#refreshPreview();
  }

  #form() {
    return this.element.tagName === "FORM" ? this.element : this.element.querySelector("form");
  }

  /** Current form values as a normalized poster (keeps id, creation date and meta). */
  #current() {
    const values = readForm(this.#form());
    return normalizePoster({ ...this.draft, ...values, id: this.draft.id, created: this.draft.created, meta: this.draft.meta });
  }

  #refreshPreview() {
    const poster = this.#current();
    const box = this.element.querySelector(".qdm-ed-preview");
    if ( box ) box.innerHTML = renderPoster(poster, { mode: "full", gm: true, ctx: campaignContext(), openNotes: true });
    const tilt = this.element.querySelector("[data-tilt-label]");
    if ( tilt ) tilt.textContent = poster.tilt.toFixed(1);
  }

  static async #onRegenerate() {
    const ok = await foundry.applications.api.DialogV2.confirm({
      window: { title: "Gerar texto de novo" },
      content: "<p>Trocar o título, o texto, a assinatura, os termos, a recompensa e as notas do mestre por um texto novo, feito a partir do solicitante, do objetivo, da recompensa e da masmorra escolhidos?</p>",
      rejectClose: false,
      modal: true
    });
    if ( !ok ) return;
    const cur = this.#current();
    const ctx = campaignContext();
    const meta = { ...cur.meta, textSeed: newSeed(random) };
    let chamber = cur.chamber;
    if ( CHAMBER_OBJECTIVES.has(cur.objective) && !chamber ) chamber = rollChamber(cur.dungeon, random);
    const needsSpaces = ["entrega", "recuperacao", "manufatura"].includes(cur.objective);
    const spacesOk = cur.objective === "manufatura" ? meta.spaces >= 1 && meta.spaces <= 3 : meta.spaces >= 2 && meta.spaces <= 8;
    if ( needsSpaces && !spacesOk ) {
      const r = cur.objective === "manufatura" ? rollDice(1, 3, random) : rollDice(2, 4, random);
      meta.spaces = r.total;
      meta.spacesDice = r.dice;
    }
    if ( cur.objective === "caca" && !meta.hunt ) meta.hunt = rollHunt(cur.dungeon, random);
    const composed = composePoster({
      estab: cur.estab, npc: cur.npc, objective: cur.objective, reward: cur.reward, dungeon: cur.dungeon, chamber,
      spaces: meta.spaces, spacesDice: meta.spacesDice, hunt: meta.hunt, textSeed: meta.textSeed
    }, ctx);
    this.draft = normalizePoster({ ...cur, ...composed, chamber, meta });
    this.render();
  }

  static async #onSubmit(event, form) {
    const poster = this.#current();
    const saved = await savePosterAndFocus(poster);
    ui.notifications.info(`${MODULE_TITLE}: cartaz "${saved.title}" salvo${saved.visible ? "" : " como rascunho (só você vê)"}.`);
    BoardApp.open({ focus: saved.id });
  }
}

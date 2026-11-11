/**
 * The board: every poster pinned to the Guild's cork board.
 * Players see the posters the GM made visible (read only); clicking one enlarges it.
 * The GM also gets the generator, new/edit/delete, status changes, chat and "show to everybody".
 */
import { MODULE_ID, MODULE_TITLE, STATUSES, TEMPLATES, escapeHTML } from "./constants.mjs";
import { DUNGEONS } from "./data.mjs";
import { campaignContext, deletePoster, getPoster, getPosters, normalizePoster, partyLimit, patchPoster, savePosters, upsertPoster } from "./store.mjs";
import { renderPoster } from "./poster-view.mjs";
import { guardActions } from "./errors.mjs";
import { announcePoster } from "./chat.mjs";
import { showToAll } from "./broadcast.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const APP_ID = `${MODULE_ID}-board`;

const FILTERS = {
  abertas: { label: "Em aberto", test: p => p.status === "afixada" || p.status === "aceita" },
  encerradas: { label: "Encerradas", title: "Cumpridas e fracassadas", test: p => p.status === "cumprida" || p.status === "fracassou" },
  todas: { label: "Todas", test: () => true }
};

export class BoardApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(options = {}) {
    super(options);
    this.ui = { filter: "abertas", focus: options.focus ?? null };
  }

  static DEFAULT_OPTIONS = {
    id: APP_ID,
    classes: ["quadro-de-missao", "qdm-board-app"],
    window: { title: "Quadro de Missão: Guilda de Candeh’ssa", icon: "fa-solid fa-scroll", resizable: true },
    position: { width: 1040, height: 740 },
    actions: guardActions({
      generate: BoardApp.#onGenerate,
      newPoster: BoardApp.#onNewPoster,
      options: BoardApp.#onOptions,
      showBoard: BoardApp.#onShowBoard,
      setFilter: BoardApp.#onSetFilter,
      focus: BoardApp.#onFocus,
      closeFocus: BoardApp.#onCloseFocus,
      edit: BoardApp.#onEdit,
      accept: BoardApp.#onAccept,
      complete: BoardApp.#onComplete,
      fail: BoardApp.#onFail,
      reopen: BoardApp.#onReopen,
      toggleVisible: BoardApp.#onToggleVisible,
      showPoster: BoardApp.#onShowPoster,
      announce: BoardApp.#onAnnounce,
      duplicate: BoardApp.#onDuplicate,
      remove: BoardApp.#onRemove
    })
  };

  static PARTS = {
    main: { template: `${TEMPLATES}/board.hbs`, scrollable: [".qdm-cork"] }
  };

  /** Open (or bring forward) the board. `focus`: a poster id to enlarge. */
  static open({ focus = null } = {}) {
    const existing = foundry.applications.instances.get(APP_ID);
    if ( existing ) {
      if ( focus !== null ) existing.ui.focus = focus;
      existing.render({ force: true });
      existing.bringToFront?.();
      return existing;
    }
    const app = new BoardApp({ focus });
    app.render({ force: true });
    return app;
  }

  /** Re-draw the board if it is open (after the stored posters or settings change). */
  static refresh() {
    const app = foundry.applications.instances.get(APP_ID);
    if ( app?.rendered ) app.render();
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const gm = game.user.isGM;
    const ctx = campaignContext();
    const all = getPosters();
    const visible = gm ? all : all.filter(p => p.visible);
    const filter = FILTERS[this.ui.filter] ? this.ui.filter : "abertas";
    const shown = visible.filter(FILTERS[filter].test);
    const accepted = visible.filter(p => p.status === "aceita").length;
    const limit = partyLimit();
    if ( this.ui.focus && !visible.some(p => p.id === this.ui.focus) ) this.ui.focus = null;
    const focused = this.ui.focus ? visible.find(p => p.id === this.ui.focus) : null;

    Object.assign(context, {
      gm,
      tiles: shown.map(p => ({ id: p.id, html: renderPoster(p, { mode: "tile", gm, ctx }), visible: p.visible, status: p.status })),
      hasTiles: shown.length > 0,
      emptyText: visible.length
        ? "Nenhum cartaz neste filtro."
        : (gm ? "O quadro está vazio. Gere uma missão ou crie um cartaz em branco." : "O quadro está vazio. Myssia ainda está organizando as requisições."),
      filters: Object.entries(FILTERS).map(([key, f]) => ({
        key, label: f.label, title: f.title ?? f.label, active: key === filter, count: visible.filter(f.test).length
      })),
      accepted,
      limit,
      overLimit: limit > 0 && accepted > limit,
      limitText: limit ? `${accepted} / ${limit}` : String(accepted),
      drafts: gm ? all.filter(p => !p.visible).length : 0,
      dungeons: gm ? DUNGEONS.slice(1).map(d => ({ value: d.n, label: `${d.n}ª · ${d.god}`, selected: d.n === ctx.nextDungeon })) : [],
      focus: focused ? this.#focusContext(focused, gm, ctx) : null
    });
    return context;
  }

  #focusContext(poster, gm, ctx) {
    return {
      id: poster.id,
      html: renderPoster(poster, { mode: "full", gm, ctx }),
      status: poster.status,
      statusLabel: STATUSES[poster.status].label,
      isOpen: poster.status === "afixada",
      isAccepted: poster.status === "aceita",
      isClosed: poster.status === "cumprida" || poster.status === "fracassou",
      visible: poster.visible
    };
  }

  async _onRender(context, options) {
    await super._onRender(context, options);
    const select = this.element.querySelector("select[name=nextDungeon]");
    select?.addEventListener("change", () => {
      game.settings.set(MODULE_ID, "nextDungeon", Number(select.value)).catch(err => console.error(err));
    });
    const backdrop = this.element.querySelector(".qdm-focus-backdrop");
    backdrop?.addEventListener("click", event => {
      if ( event.target === backdrop ) {
        this.ui.focus = null;
        this.render();
      }
    });
  }

  static #posterOf(target) {
    const id = target.closest("[data-poster-id]")?.dataset.posterId;
    const poster = id ? getPoster(id) : null;
    if ( !poster ) throw new Error("Esse cartaz não existe mais no quadro.");
    return poster;
  }

  static #gmOnly() {
    if ( !game.user.isGM ) throw new Error("Só o mestre pode mexer nos cartazes.");
  }

  static async #onGenerate() {
    BoardApp.#gmOnly();
    const { GeneratorApp } = await import("./generator-app.mjs");
    GeneratorApp.open();
  }

  static async #onNewPoster() {
    BoardApp.#gmOnly();
    const { PosterEditor } = await import("./poster-editor.mjs");
    const ctx = campaignContext();
    PosterEditor.open(normalizePoster({
      id: foundry.utils.randomID(),
      title: "Nova missão",
      estab: "guilda",
      npc: "Myssia",
      signature: "Myssia · Guilda",
      dungeon: ctx.nextDungeon,
      visible: false,
      tilt: (Math.random() * 5) - 2.5
    }), { isNew: true });
  }

  static async #onOptions() {
    BoardApp.#gmOnly();
    const { OptionsApp } = await import("./options-app.mjs");
    OptionsApp.open();
  }

  static async #onShowBoard() {
    BoardApp.#gmOnly();
    showToAll(null);
    ui.notifications.info(`${MODULE_TITLE}: quadro aberto para todos os jogadores.`);
  }

  static async #onSetFilter(event, target) {
    this.ui.filter = target.dataset.filter;
    this.render();
  }

  static async #onFocus(event, target) {
    if ( event.target.closest("button") && !event.target.closest("[data-action=focus]") ) return;
    this.ui.focus = BoardApp.#posterOf(target).id;
    this.render();
  }

  static async #onCloseFocus() {
    this.ui.focus = null;
    this.render();
  }

  static async #onEdit(event, target) {
    BoardApp.#gmOnly();
    const { PosterEditor } = await import("./poster-editor.mjs");
    PosterEditor.open(BoardApp.#posterOf(target));
  }

  static async #onAccept(event, target) {
    BoardApp.#gmOnly();
    const { StatusApp } = await import("./status-app.mjs");
    StatusApp.open(BoardApp.#posterOf(target).id, "aceita");
  }

  static async #onComplete(event, target) {
    BoardApp.#gmOnly();
    const { StatusApp } = await import("./status-app.mjs");
    StatusApp.open(BoardApp.#posterOf(target).id, "cumprida");
  }

  static async #onFail(event, target) {
    BoardApp.#gmOnly();
    const { StatusApp } = await import("./status-app.mjs");
    StatusApp.open(BoardApp.#posterOf(target).id, "fracassou");
  }

  static async #onReopen(event, target) {
    BoardApp.#gmOnly();
    const poster = BoardApp.#posterOf(target);
    const { reopenPoster } = await import("./status-app.mjs");
    await reopenPoster(poster);
  }

  static async #onToggleVisible(event, target) {
    BoardApp.#gmOnly();
    const poster = BoardApp.#posterOf(target);
    await patchPoster(poster.id, { visible: !poster.visible });
  }

  static async #onShowPoster(event, target) {
    BoardApp.#gmOnly();
    const poster = BoardApp.#posterOf(target);
    if ( !poster.visible ) await patchPoster(poster.id, { visible: true });
    showToAll(poster.id);
    ui.notifications.info(`${MODULE_TITLE}: "${poster.title}" aberto na tela de todos.`);
  }

  static async #onAnnounce(event, target) {
    BoardApp.#gmOnly();
    await announcePoster(BoardApp.#posterOf(target));
  }

  static async #onDuplicate(event, target) {
    BoardApp.#gmOnly();
    const poster = BoardApp.#posterOf(target);
    const list = getPosters();
    const i = list.findIndex(p => p.id === poster.id);
    const copy = normalizePoster({ ...poster, id: foundry.utils.randomID(), title: `${poster.title} (cópia)`, status: "afixada", acceptedBy: "", visible: false, created: Date.now() });
    list.splice(i, 0, copy);
    await savePosters(list);
    this.ui.focus = copy.id;
  }

  static async #onRemove(event, target) {
    BoardApp.#gmOnly();
    const poster = BoardApp.#posterOf(target);
    const ok = await foundry.applications.api.DialogV2.confirm({
      window: { title: "Excluir cartaz" },
      content: `<p>Arrancar <strong>${escapeHTML(poster.title)}</strong> do quadro? Isso não pode ser desfeito.</p>`,
      rejectClose: false,
      modal: true
    });
    if ( !ok ) return;
    if ( this.ui.focus === poster.id ) this.ui.focus = null;
    await deletePoster(poster.id);
  }
}

/** Helper for other windows: save and keep the board focused on the poster. */
export async function savePosterAndFocus(poster) {
  const saved = await upsertPoster(poster);
  const app = foundry.applications.instances.get(APP_ID);
  if ( app ) app.ui.focus = saved.id;
  return saved;
}

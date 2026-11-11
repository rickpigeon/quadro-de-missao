/**
 * Quadro de Missão: entry point.
 *
 * Opening the board (everybody): the "Quadro de Missão" button in the Token controls,
 * a keybinding (unassigned by default) or `game.modules.get("quadro-de-missao").api.open()`.
 * The GM can also open it on every screen at once ("Mostrar para todos").
 */
import { MODULE_ID, MODULE_TITLE } from "./constants.mjs";
import { campaignContext, getPosters, registerSettings, upsertPoster } from "./store.mjs";
import { BoardApp } from "./board-app.mjs";
import { GeneratorApp, posterFromDraft } from "./generator-app.mjs";
import { listenSocket, showToAll } from "./broadcast.mjs";
import { watchUncaught } from "./errors.mjs";
import { rollEverything } from "./generator.mjs";
import { random } from "./constants.mjs";

/* Several settings can change in one save: redraw the open windows once. */
let refreshTimer = null;
function scheduleRefresh() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    BoardApp.refresh();
    const generator = foundry.applications.instances.get(`${MODULE_ID}-generator`);
    if ( generator?.rendered ) generator.render();
  }, 40);
}

Hooks.once("init", () => {
  watchUncaught();
  registerSettings(scheduleRefresh);
  game.keybindings.register(MODULE_ID, "open", {
    name: "Abrir o Quadro de Missão",
    editable: [],
    restricted: false,
    onDown: () => {
      BoardApp.open();
      return true;
    }
  });
  game.keybindings.register(MODULE_ID, "generate", {
    name: "Gerar missão (mestre)",
    editable: [],
    restricted: true,
    onDown: () => {
      GeneratorApp.open();
      return true;
    }
  });
});

Hooks.once("ready", () => {
  listenSocket();
  const module = game.modules.get(MODULE_ID);
  if ( module ) {
    module.api = {
      /** Open the board on this screen (anyone). `focus`: a poster id to enlarge. */
      open: (focus = null) => BoardApp.open({ focus }),
      /** Open the board on every screen (GM). */
      show: (focus = null) => showToAll(focus),
      /** Open the generator window (GM). */
      generator: () => GeneratorApp.open(),
      /** Roll a whole mission and pin it (GM). Returns the saved poster. `visible: false` keeps it as a draft. */
      generate: async ({ visible = true } = {}) => {
        if ( !game.user.isGM ) throw new Error(`${MODULE_TITLE}: só o mestre gera missões.`);
        const ctx = campaignContext();
        return upsertPoster(posterFromDraft(rollEverything(ctx, random), ctx, { visible }));
      },
      /** Copies of every poster. */
      posters: () => getPosters()
    };
  }
});

/* Redraw when the stored posters or the options change (every client). */
function onSettingChanged(setting) {
  if ( String(setting?.key ?? "").startsWith(`${MODULE_ID}.`) ) scheduleRefresh();
}
Hooks.on("createSetting", onSettingChanged);
Hooks.on("updateSetting", onSettingChanged);

/* v13: controls is a record of controls, each with a record of tools. Visible to everybody. */
Hooks.on("getSceneControlButtons", controls => {
  const tokens = controls?.tokens;
  if ( !tokens?.tools ) return;
  tokens.tools.quadroDeMissao = {
    name: "quadroDeMissao",
    title: MODULE_TITLE,
    icon: "fa-solid fa-scroll",
    order: Object.keys(tokens.tools).length,
    button: true,
    visible: true,
    onChange: () => BoardApp.open()
  };
});

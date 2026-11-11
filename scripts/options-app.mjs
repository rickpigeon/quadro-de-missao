/**
 * Board options (GM): next dungeon, god on the posters, party size, completed missions
 * and the residents that are out of play (an escorted NPC who died, Tanit after her last demand...).
 */
import { MODULE_ID, MODULE_TITLE, TEMPLATES } from "./constants.mjs";
import { DUNGEONS, ESTABLISHMENTS, GATED_RESIDENTS } from "./data.mjs";
import { campaignContext, getUnavailable, partyCharacters, setUnavailable } from "./store.mjs";
import { availableResidents } from "./generator.mjs";
import { guardActions } from "./errors.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const APP_ID = `${MODULE_ID}-options`;

export class OptionsApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: APP_ID,
    classes: ["quadro-de-missao", "qdm-options-app"],
    tag: "form",
    window: { title: "Quadro de Missão: opções", icon: "fa-solid fa-gear", resizable: true },
    position: { width: 620, height: 700 },
    form: { handler: OptionsApp.#onSubmit, submitOnChange: false, closeOnSubmit: true },
    actions: guardActions({})
  };

  static PARTS = {
    form: { template: `${TEMPLATES}/options.hbs`, scrollable: [".qdm-opt-scroll"] }
  };

  static open() {
    if ( !game.user.isGM ) return null;
    const existing = foundry.applications.instances.get(APP_ID);
    if ( existing ) {
      existing.render({ force: true });
      existing.bringToFront?.();
      return existing;
    }
    const app = new OptionsApp();
    app.render({ force: true });
    return app;
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const ctx = campaignContext();
    const out = new Set(getUnavailable());
    const gate = GATED_RESIDENTS["Eh’mmed"];
    const ehmmedIn = availableResidents("biblioteca", { ...ctx, unavailable: [] }).includes("Eh’mmed");
    Object.assign(context, {
      dungeons: DUNGEONS.slice(1).map(d => ({ value: d.n, label: `${d.n}ª · Desafio de ${d.god} (${d.n}º nível)`, selected: d.n === ctx.nextDungeon })),
      revealGod: ctx.revealGod,
      partySize: game.settings.get(MODULE_ID, "partySize"),
      detected: partyCharacters().length,
      completed: ctx.completedMissions,
      places: Object.values(ESTABLISHMENTS).map(e => ({
        label: e.label,
        residents: e.residents.map(name => ({ name, out: out.has(name) }))
      })),
      ehmmedText: ehmmedIn
        ? "Eh’mmed já pode assinar missões da Biblioteca."
        : `Eh’mmed só aparece depois da ${gate.afterDungeon}ª masmorra ou de ${gate.afterMissions} missões cumpridas (p. ${gate.page}).`
    });
    return context;
  }

  static async #onSubmit(event, form) {
    const value = name => form.querySelector(`[name="${name}"]`);
    await game.settings.set(MODULE_ID, "nextDungeon", Number(value("nextDungeon").value) || 1);
    await game.settings.set(MODULE_ID, "revealGod", !!value("revealGod").checked);
    await game.settings.set(MODULE_ID, "partySize", Math.max(0, Math.min(12, Math.round(Number(value("partySize").value) || 0))));
    await game.settings.set(MODULE_ID, "completedCount", Math.max(0, Math.min(999, Math.round(Number(value("completed").value) || 0))));
    const names = [...form.querySelectorAll("input[data-resident]")].filter(el => el.checked).map(el => el.dataset.resident);
    await setUnavailable(names);
    ui.notifications.info(`${MODULE_TITLE}: opções salvas.`);
  }
}

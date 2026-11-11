/**
 * Status changes of a poster (GM): accepted, completed or failed.
 * Completing rolls what the reward needs (1d4 PA) and the optional extras:
 *   honraria da Guilda: one more reward, 1d6 on the Recompensa column (p. 31);
 *   Myssia, Leal: the GM rolls two rewards and the group picks one (p. 41).
 */
import { MODULE_ID, MODULE_TITLE, TEMPLATES, random } from "./constants.mjs";
import { ESTABLISHMENTS, OBJECTIVES, REWARDS } from "./data.mjs";
import { fill, rollDie, rollReward } from "./generator.mjs";
import { REWARD_RULES } from "./texts.mjs";
import { addCompleted, getPoster, getPosters, getUnavailable, partyCharacters, partyLimit, patchPoster, setUnavailable } from "./store.mjs";
import { guardActions } from "./errors.mjs";
import { announceCompletion, announceFailure, announceAccepted } from "./chat.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const MODES = {
  aceita: { title: "Aceitar missão", icon: "fa-solid fa-thumbtack", button: "Marcar como aceita" },
  cumprida: { title: "Missão cumprida", icon: "fa-solid fa-circle-check", button: "Marcar como cumprida" },
  fracassou: { title: "Missão fracassada", icon: "fa-solid fa-circle-xmark", button: "Marcar como fracassada" }
};

/** A reward as shown in chat: label, rules text and the 1d4 of Afinidade when there is one. */
export function rewardOutcome(key, poster) {
  const reward = REWARDS[key] ?? REWARDS.informacao;
  const estab = ESTABLISHMENTS[poster.estab] ?? ESTABLISHMENTS.guilda;
  const out = { key, label: reward.label, icon: reward.icon, text: fill(REWARD_RULES[key] ?? "", { de_estab: estab.de }), roll: "" };
  if ( key === "afinidade" ) {
    const n = rollDie(4, random);
    out.roll = `1d4 = ${n} PA com um morador ${estab.de}`;
  }
  return out;
}

export class StatusApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(options = {}) {
    super(options);
    this.posterId = options.posterId;
    this.mode = MODES[options.mode] ? options.mode : "aceita";
  }

  static DEFAULT_OPTIONS = {
    classes: ["quadro-de-missao", "qdm-status-app"],
    tag: "form",
    window: { resizable: false },
    position: { width: 480, height: "auto" },
    form: { handler: StatusApp.#onSubmit, submitOnChange: false, closeOnSubmit: true },
    actions: guardActions({})
  };

  static PARTS = {
    form: { template: `${TEMPLATES}/status.hbs` }
  };

  static open(posterId, mode) {
    if ( !game.user.isGM ) return null;
    const id = `${MODULE_ID}-status-${posterId}`;
    foundry.applications.instances.get(id)?.close();
    const app = new StatusApp({ id, posterId, mode });
    app.render({ force: true });
    return app;
  }

  get title() {
    return MODES[this.mode].title;
  }

  #poster() {
    const poster = getPoster(this.posterId);
    if ( !poster ) throw new Error("Esse cartaz não existe mais no quadro.");
    return poster;
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const poster = this.#poster();
    const accepted = getPosters().filter(p => p.visible && p.status === "aceita" && p.id !== poster.id).length;
    const limit = partyLimit();
    Object.assign(context, {
      poster,
      mode: this.mode,
      icon: MODES[this.mode].icon,
      button: MODES[this.mode].button,
      isAccept: this.mode === "aceita",
      isComplete: this.mode === "cumprida",
      isFail: this.mode === "fracassou",
      objectiveLabel: OBJECTIVES[poster.objective].label,
      rewardLabel: REWARDS[poster.reward].label,
      party: partyCharacters(),
      who: poster.acceptedBy,
      limitText: limit ? `${accepted + 1} de ${limit}` : "",
      overLimit: limit > 0 && accepted + 1 > limit,
      isEscort: poster.objective === "escolta",
      npc: poster.npc,
      npcOut: getUnavailable().includes(poster.npc)
    });
    return context;
  }

  static async #onSubmit(event, form) {
    const poster = this.#poster();
    const get = name => form.querySelector(`[name="${name}"]`);
    const checked = name => !!get(name)?.checked;
    const who = String(get("who")?.value ?? "").trim().slice(0, 80);
    const announce = checked("announce");

    if ( this.mode === "aceita" ) {
      await patchPoster(poster.id, { status: "aceita", acceptedBy: who, visible: true });
      if ( announce ) await announceAccepted({ ...poster, acceptedBy: who });
      return;
    }

    if ( this.mode === "cumprida" ) {
      const result = { who, base: rewardOutcome(poster.reward, poster), extra: null, myssia: [] };
      if ( checked("guildHonor") ) result.extra = rewardOutcome(rollReward(random).reward, poster);
      if ( checked("myssia") ) result.myssia = [rewardOutcome(rollReward(random).reward, poster), rewardOutcome(rollReward(random).reward, poster)];
      await patchPoster(poster.id, { status: "cumprida", acceptedBy: who || poster.acceptedBy, visible: true });
      if ( poster.status !== "cumprida" ) await addCompleted(1);
      if ( announce ) await announceCompletion(poster, result);
      else ui.notifications.info(`${MODULE_TITLE}: missão cumprida. Recompensa: ${result.base.label}${result.base.roll ? ` (${result.base.roll})` : ""}.`);
      return;
    }

    /* fracassou */
    await patchPoster(poster.id, { status: "fracassou" });
    if ( poster.status === "cumprida" ) await addCompleted(-1);
    if ( checked("npcOut") && poster.npc ) {
      await setUnavailable([...getUnavailable(), poster.npc]);
      ui.notifications.info(`${MODULE_TITLE}: ${poster.npc} agora está fora de jogo e não assina mais missões.`);
    }
    if ( announce ) await announceFailure(poster);
  }
}

/** Put a poster back on the board as available. */
export async function reopenPoster(poster) {
  await patchPoster(poster.id, { status: "afixada", acceptedBy: "" });
  if ( poster.status === "cumprida" ) await addCompleted(-1);
  ui.notifications.info(`${MODULE_TITLE}: "${poster.title}" voltou a ficar disponível.`);
}

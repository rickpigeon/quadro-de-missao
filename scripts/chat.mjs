/**
 * Chat cards. Plain public messages (no roll modes involved), spoken by the Guild.
 */
import { escapeHTML } from "./constants.mjs";
import { ESTABLISHMENTS, OBJECTIVES, REWARDS } from "./data.mjs";
import { whereText } from "./generator.mjs";
import { campaignContext } from "./store.mjs";

const SPEAKER = { alias: "Guilda de Candeh’ssa" };

async function post(content) {
  const cls = CONFIG.ChatMessage?.documentClass ?? globalThis.ChatMessage;
  return cls.create({ content, speaker: SPEAKER });
}

function header(poster, kicker) {
  const estab = ESTABLISHMENTS[poster.estab] ?? ESTABLISHMENTS.guilda;
  const objective = OBJECTIVES[poster.objective] ?? OBJECTIVES.entrega;
  return `<header class="qdm-chat-head">
      <span class="qdm-chat-seal"><i class="${estab.icon}"></i></span>
      <span class="qdm-chat-kicker">${escapeHTML(kicker)} · <i class="${objective.icon}"></i> ${escapeHTML(objective.label)}</span>
      <strong class="qdm-chat-title">${escapeHTML(poster.title)}</strong>
    </header>`;
}

const rewardLi = (r, prefix = "") => `<li><i class="${r.icon}"></i> ${prefix}<strong>${escapeHTML(r.label)}</strong>${r.roll ? `: <span class="qdm-chat-roll">${escapeHTML(r.roll)}</span>` : ""}<br><small>${escapeHTML(r.text)}</small></li>`;

/** A new poster on the board, for everybody. */
export async function announcePoster(poster) {
  const reward = REWARDS[poster.reward] ?? REWARDS.informacao;
  const where = whereText(poster, campaignContext(), false);
  return post(`<div class="quadro-de-missao qdm-chat">
    ${header(poster, "Novo cartaz no quadro")}
    <p class="qdm-chat-line"><i class="fa-solid fa-location-dot"></i> ${escapeHTML(where)}</p>
    <p class="qdm-chat-line"><i class="${reward.icon}"></i> ${escapeHTML(reward.label)}</p>
    <p class="qdm-chat-sign">${escapeHTML(poster.signature)}</p>
    <p class="qdm-chat-hint">Abra o Quadro de Missão (botão nos controles de token) para ler o cartaz.</p>
  </div>`);
}

export async function announceAccepted(poster) {
  const who = poster.acceptedBy ? `Aceita por ${poster.acceptedBy}.` : "Missão aceita pelo grupo.";
  return post(`<div class="quadro-de-missao qdm-chat">
    ${header(poster, "Missão aceita")}
    <p class="qdm-chat-line"><i class="fa-solid fa-thumbtack"></i> ${escapeHTML(who)}</p>
  </div>`);
}

/** result: { who, base, extra, myssia: [a, b] } from status-app.mjs */
export async function announceCompletion(poster, result) {
  const items = [rewardLi(result.base)];
  if ( result.extra ) items.push(rewardLi(result.extra, "Honraria da Guilda (+1 recompensa): "));
  let myssia = "";
  if ( result.myssia?.length === 2 ) {
    myssia = `<p class="qdm-chat-line"><i class="fa-solid fa-scale-balanced"></i> Myssia (Leal): o mestre rolou duas recompensas; o grupo escolhe uma delas.</p>
      <ul class="qdm-chat-rewards">${result.myssia.map(r => rewardLi(r)).join("")}</ul>`;
  }
  const who = result.who ? `Cumprida por ${result.who}.` : "Missão cumprida!";
  return post(`<div class="quadro-de-missao qdm-chat is-done">
    ${header(poster, "Missão cumprida")}
    <p class="qdm-chat-line"><i class="fa-solid fa-circle-check"></i> ${escapeHTML(who)}</p>
    <ul class="qdm-chat-rewards">${items.join("")}</ul>
    ${myssia}
  </div>`);
}

export async function announceFailure(poster) {
  return post(`<div class="quadro-de-missao qdm-chat is-failed">
    ${header(poster, "Missão fracassada")}
    <p class="qdm-chat-line"><i class="fa-solid fa-circle-xmark"></i> A Guilda registrou o fracasso.</p>
  </div>`);
}

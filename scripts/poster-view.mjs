/**
 * The look of a poster, as an HTML string (board tiles, the enlarged view, the previews and chat).
 * Pure: everything is escaped here, so templates print it with {{{triple braces}}}.
 */
import { PINS, STATUSES, escapeHTML } from "./constants.mjs";
import { ESTABLISHMENTS, OBJECTIVES, REWARDS } from "./data.mjs";
import { whereText } from "./generator.mjs";

const paragraphs = body => String(body ?? "").split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
  .map(p => `<p>${escapeHTML(p).replace(/\n/g, "<br>")}</p>`).join("");

/** First paragraph that is not a greeting line (the heart of the request), cut for the tiles. */
function excerpt(body, max = 170) {
  const parts = String(body ?? "").split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const main = parts.find(p => p.length > 60 && !/[:!]$/.test(p)) ?? parts[0] ?? "";
  return main.length > max ? `${main.slice(0, max).replace(/\s+\S*$/, "")}…` : main;
}

function stamp(poster) {
  const s = STATUSES[poster.status];
  if ( !s?.stamp ) return "";
  const who = poster.status === "aceita" && poster.acceptedBy ? `<small>${escapeHTML(poster.acceptedBy)}</small>` : "";
  return `<span class="qdm-stamp qdm-stamp-${poster.status}">${escapeHTML(s.stamp)}${who}</span>`;
}

/**
 * opts: { mode: "tile" | "full" | "chat", gm, ctx: { revealGod, nextDungeon }, showNotes }
 */
export function renderPoster(poster, opts = {}) {
  const mode = opts.mode ?? "full";
  const gm = !!opts.gm;
  const ctx = opts.ctx ?? {};
  const estab = ESTABLISHMENTS[poster.estab] ?? ESTABLISHMENTS.guilda;
  const objective = OBJECTIVES[poster.objective] ?? OBJECTIVES.entrega;
  const reward = REWARDS[poster.reward] ?? REWARDS.informacao;
  const pin = PINS[poster.pin]?.color ?? PINS.vermelho.color;
  const classes = ["qdm-poster", `qdm-mode-${mode}`, `qdm-status-${poster.status}`];
  if ( !poster.visible ) classes.push("is-draft");
  const style = `--qdm-tilt:${Number(poster.tilt) || 0}deg;--qdm-pin:${pin}`;
  const where = escapeHTML(whereText(poster, ctx, gm));
  const draftRibbon = !poster.visible && gm ? `<span class="qdm-draft-ribbon" title="Os jogadores não veem este cartaz">Rascunho</span>` : "";

  const head = `
    <span class="qdm-pin" aria-hidden="true"></span>
    ${draftRibbon}
    <header class="qdm-poster-head">
      <span class="qdm-seal" title="${escapeHTML(estab.label)}"><i class="${estab.icon}"></i></span>
      <span class="qdm-kind"><i class="${objective.icon}"></i> ${escapeHTML(objective.label)}</span>
      <h3 class="qdm-title">${escapeHTML(poster.title)}</h3>
    </header>`;

  if ( mode === "tile" ) {
    return `<article class="${classes.join(" ")}" data-poster-id="${escapeHTML(poster.id)}" style="${style}">
      ${head}
      <p class="qdm-excerpt">${escapeHTML(excerpt(poster.body))}</p>
      <p class="qdm-line"><i class="fa-solid fa-location-dot"></i> ${where}</p>
      <p class="qdm-line qdm-line-reward"><i class="${reward.icon}"></i> ${escapeHTML(reward.label)}</p>
      <footer class="qdm-sign">${escapeHTML(poster.signature)}</footer>
      ${stamp(poster)}
    </article>`;
  }

  const terms = poster.terms.length
    ? `<div class="qdm-fact"><dt>Termos</dt><dd><ul>${poster.terms.map(t => `<li>${escapeHTML(t)}</li>`).join("")}</ul></dd></div>`
    : "";
  const rewardText = poster.rewardText ? escapeHTML(poster.rewardText) : escapeHTML(reward.label);
  const notes = gm && opts.showNotes !== false && poster.gmNotes.length
    ? `<details class="qdm-gm-notes" ${opts.openNotes ? "open" : ""}><summary><i class="fa-solid fa-user-secret"></i> Notas do mestre (só você vê)</summary><ul>${poster.gmNotes.map(n => `<li>${escapeHTML(n)}</li>`).join("")}</ul></details>`
    : "";

  return `<article class="${classes.join(" ")}" data-poster-id="${escapeHTML(poster.id)}" style="${style}">
    ${head}
    <div class="qdm-body">${paragraphs(poster.body)}</div>
    <dl class="qdm-facts">
      <div class="qdm-fact"><dt>Onde</dt><dd>${where}</dd></div>
      ${terms}
      <div class="qdm-fact qdm-fact-reward"><dt>Recompensa</dt><dd><i class="${reward.icon}"></i> ${rewardText}</dd></div>
    </dl>
    <footer class="qdm-sign">${escapeHTML(poster.signature)}</footer>
    ${stamp(poster)}
    ${notes}
  </article>`;
}

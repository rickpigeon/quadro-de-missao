/**
 * Quadro de Missão: constants and small helpers.
 * The module is written for Portuguese tables, so labels live in the code (no lang files).
 */
export const MODULE_ID = "quadro-de-missao";
export const MODULE_TITLE = "Quadro de Missão";
export const SOCKET = `module.${MODULE_ID}`;
export const TEMPLATES = `modules/${MODULE_ID}/templates`;

/** Poster states. "afixada" = on the board, nobody took it yet. */
export const STATUSES = {
  afixada: { label: "Disponível", stamp: "" },
  aceita: { label: "Aceita", stamp: "Aceita" },
  cumprida: { label: "Cumprida", stamp: "Cumprida" },
  fracassou: { label: "Fracassou", stamp: "Fracassou" }
};

/** Colours of the pin on top of each poster. */
export const PINS = {
  vermelho: { label: "Vermelho", color: "#b8322a" },
  azul: { label: "Azul", color: "#2f5f9e" },
  verde: { label: "Verde", color: "#3f7d3a" },
  dourado: { label: "Dourado", color: "#c99a2e" },
  roxo: { label: "Roxo (Valkaria)", color: "#7b4bb0" },
  preto: { label: "Preto", color: "#2b2b2b" }
};

export const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => (
  { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
));

/** Build `<option>` data for Handlebars from a catalog { key: label | {label} }. */
export const choices = (catalog, value) => Object.entries(catalog).map(([key, v]) => ({
  value: key,
  label: typeof v === "string" ? v : v.label,
  selected: String(key) === String(value)
}));

/** The game's random source when Foundry is there, Math.random otherwise. */
export function random() {
  try {
    const fn = globalThis.CONFIG?.Dice?.randomUniform;
    if ( typeof fn === "function" ) {
      const value = fn();
      if ( Number.isFinite(value) && value >= 0 && value < 1 ) return value;
    }
  } catch {
    /* fall through */
  }
  return Math.random();
}

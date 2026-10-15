/* =========================================================================
   Helpers
   ========================================================================= */
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function safeUrl(u) {
  u = String(u || "").trim();
  if (!u) return "";
  if (/^(https?:|mailto:)/i.test(u)) return u;
  if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(u)) return "https://" + u;
  return "";
}
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function initials(name) { return (name || "?").trim().split(/\s+/).slice(0, 2).map((w) => w[0] || "").join("").toUpperCase() || "?"; }
function parseStats(text) {
  return String(text || "").split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 4).map((l) => {
    const i = l.indexOf(":");
    const label = i >= 0 ? l.slice(0, i).trim() : l, value = i >= 0 ? l.slice(i + 1).trim() : "";
    const m = value.match(/^(-?\d+(?:\.\d+)?)(.*)$/);
    return { label, value, num: m ? parseFloat(m[1]) : null, suffix: m ? m[2] : "" };
  }).filter((s) => s.label && s.value);
}
function parseSkills(text) {
  const rows = String(text || "").split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
    const m = l.match(/^(.*?)[\s:,-]+([1-5])$/);
    return m ? { name: m[1].trim(), level: +m[2] } : { name: l, level: 0 };
  });
  return { rated: rows.filter((r) => r.level).sort((a, b) => b.level - a.level), tags: rows.filter((r) => !r.level).map((r) => r.name) };
}
const tagsOf = (s) => String(s || "").split(",").map((t) => t.trim()).filter(Boolean);
function resolveDesign(d) {
  const rnd = mulberry32(d.seed >>> 0);
  const pick = (key, list) => { const r = Math.floor(rnd() * list.length); return d[key] >= 0 ? d[key] : r; };
  return { palette: pick("palette", PALETTES), fonts: pick("fonts", FONTS), hero: pick("hero", HEROES), motif: pick("motif", MOTIFS), cards: pick("cards", CARDS) };
}
